import { UserProfile, SocialHandle, Product, Gallery } from "@/lib/models";
import sequelize from "@/lib/db"; // Ensure db exposes sequelize instance for transaction

export async function getUserProfile(email: string) {
    console.log("getUserProfile searching for email:", email);
    // Try both 'User' and 'user' case conventions
    // Try both 'User' and 'user' case conventions
    const UserModel = sequelize.models.User || sequelize.models.user;

    if (!UserModel) {
        throw new Error(`User model not found. Available models: ${Object.keys(sequelize.models).join(', ')}`);
    }
    try {
        const user = await UserModel.findOne({ where: { email } });
        if (!user) return null;

        const profile = await UserProfile.findOne({
            where: { userId: user.dataValues.id },
            include: [
                { model: SocialHandle, as: 'socialHandles' },
                { model: Product, as: 'products' },
                { model: Gallery, as: 'gallery' }
            ]
        });

        if (!profile) {
            // User exists but has no profile yet -> Return just the ID so we can create one
            return { userId: user.dataValues.id };
        }

        // Return profile data mixed with userId (explicitly ensuring it's there)
        return {
            ...profile.toJSON(),
            userId: user.dataValues.id
        };
    } catch (error: any) {
        console.error("Failed to fetch user profile:", error);
        // Throw the real error so we can see it in the UI
        throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
}

export async function createOrUpdateProfile(userId: string, data: any) {
    console.log("createOrUpdateProfile called for userId:", userId);
    const transaction = await sequelize.transaction();
    try {
        const { social_links, products, gallery, ...profileData } = data;
        console.log("Saving profile data...", {
            hasSocial: !!social_links,
            hasProducts: !!products,
            hasGallery: !!gallery
        });

        // 1. Find or Create UserProfile

        // Destructure to remove fields that don't belong in the defaults object directly
        // This prevents "Unknown attributes" warnings and potential EPIPE if these fields contain large data (base64)
        const { userImage, designation, ...validDefaults } = profileData;

        const [profile, created] = await UserProfile.findOrCreate({
            where: { userId },
            defaults: {
                userId,
                ...validDefaults, // Spread only safe fields
                profession: designation, // Map schema 'designation' to DB 'profession'
                picture: userImage, // Map schema 'userImage' to DB 'picture'
                business_logo: profileData.business_logo,
                qr_favicon: profileData.qr_favicon,
                qr_fg_color: profileData.qr_fg_color,
                qr_dots_style: profileData.qr_dots_style,
                qr_marker_border_style: profileData.qr_marker_border_style,
                qr_marker_center_style: profileData.qr_marker_center_style,
                brochure: profileData.brochure,
                booking_url: profileData.booking_url,
                theme_color: profileData.theme_color,
                button_color: profileData.button_color,
                card_layout: profileData.card_layout,
                terms_accepted: profileData.terms_accepted
            },
            transaction
        });

        // 2. Update Profile Data
        if (!created) {
            await profile.update({
                f_name: profileData.f_name,
                l_name: profileData.l_name,
                email: profileData.email, // Explicitly include email
                phone_no: profileData.phone_no,
                company_name: profileData.company_name,
                company_description: profileData.company_description,
                company_website: profileData.company_website,
                address: profileData.address,
                map_url: profileData.map_url,
                display_name: profileData.display_name,
                profession: profileData.designation,
                bio: profileData.bio,
                picture: profileData.userImage,
                business_logo: profileData.business_logo,
                qr_favicon: profileData.qr_favicon,
                qr_fg_color: profileData.qr_fg_color,
                qr_dots_style: profileData.qr_dots_style,
                qr_marker_border_style: profileData.qr_marker_border_style,
                qr_marker_center_style: profileData.qr_marker_center_style,
                brochure: profileData.brochure,
                booking_url: profileData.booking_url,
                services: profileData.services,
                positions: profileData.positions,
                theme_color: profileData.theme_color,
                button_color: profileData.button_color,
                card_layout: profileData.card_layout,
                terms_accepted: profileData.terms_accepted
            }, { transaction });
        }

        const profileId = profile.dataValues.id;

        // 3. Handle Social Links (Delete all and recreate - simplest strategy)
        // Optimization: Could be smarter, but full replace ensures sync
        if (social_links) {
            await SocialHandle.destroy({ where: { userProfileId: profileId }, transaction });
            if (social_links.length > 0) {
                const socialHandlesToCreate = social_links.map((link: any) => ({
                    userProfileId: profileId,
                    type_id: link.type_id,
                    soc_link: link.link // Map 'link' from form to 'soc_link' in DB
                    // Note: id is intentionally omitted - it's auto-increment
                }));
                await SocialHandle.bulkCreate(socialHandlesToCreate, {
                    transaction,
                    fields: ['userProfileId', 'type_id', 'soc_link'] // Explicitly specify fields to exclude id
                });
            }
        }

        // 4. Handle Products (Delete all and recreate)
        // Warning: This deletes existing products. For ID stability, upsert is better, but this is consistent with 'save entire form' behavior.
        if (products) {
            // Note: If you want to keep IDs constant, you'd need to diff. For now, clear and replace.
            await Product.destroy({ where: { userProfileId: profileId }, transaction });
            if (products.length > 0) {
                const productsToCreate = products.map((prod: any) => ({
                    userProfileId: profileId,
                    prod_name: prod.prod_name,
                    prod_description: prod.prod_description,
                    prod_price: prod.prod_price,
                    prod_type: prod.prod_type,
                    prod_url: prod.prod_url, // Added support for IT product URL
                    prod_images: prod.prod_images // Array of strings (base64)
                }));
                await Product.bulkCreate(productsToCreate, { transaction });
            }
        }

        // 5. Handle Gallery (Delete all and recreate)
        if (gallery) {
            await Gallery.destroy({ where: { userProfileId: profileId }, transaction });
            if (gallery.length > 0) {
                const galleryToCreate = gallery.map((imgStr: string) => ({
                    userProfileId: profileId,
                    image_url: imgStr // Assuming 'image_url' is the column name in Gallery model. Need to check models.ts
                }));
                await Gallery.bulkCreate(galleryToCreate, { transaction });
            }
        }

        await transaction.commit();
        return profile;
    } catch (error) {
        await transaction.rollback();
        console.error("Error saving profile:", error);
        throw error;
    }
}

export async function getProfileBySlug(slug: string) {
    // Try both 'User' and 'user' case conventions for consistency
    const UserModel = sequelize.models.User || sequelize.models.user;

    if (!UserModel) {
        throw new Error(`User model not found. Available models: ${Object.keys(sequelize.models).join(', ')}`);
    }

    try {
        const profile = await UserProfile.findOne({
            where: { display_name: slug },
            include: [
                { model: SocialHandle, as: 'socialHandles' },
                { model: Product, as: 'products' },
                { model: Gallery, as: 'gallery' }
            ]
        });

        if (!profile) return null;

        // Fetch User email/image if needed, though profile has most data
        const user = await UserModel.findByPk(profile.dataValues.userId);

        return {
            ...profile.toJSON(),
            // Prefer custom profile picture, fallback to Auth user image
            userImage: profile.dataValues.picture || user?.dataValues?.image,
            email: user?.dataValues?.email
        };
    } catch (error) {
        console.error("Failed to fetch profile by slug:", error);
        return null;
    }
}
