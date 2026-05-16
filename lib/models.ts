import { DataTypes, Model } from 'sequelize';
import sequelize, { DB_SYNC } from './db';

// Note: NextAuth models (User, Account, Session, VerificationToken) are 
// automatically created by @auth/sequelize-adapter. We only define our custom models here.

// Get the User model from sequelize (will be created by the adapter)
// We reference it after the adapter initializes it
const getUserModel = () => sequelize.models.user;

// --- User Model Handling ---
// We explicitly define the User model here to ensure it exists for public pages (e.g. QR code page)
// where auth.ts (and thus the adapter initialization) might not be loaded.
export const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    emailVerified: {
        type: DataTypes.DATE,
        field: 'email_verified'
    },
    image: DataTypes.STRING,
    password: {
        type: DataTypes.STRING,
        allowNull: true, // Optional because OAuth users won't have it initially
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_admin'
    },
    isBanned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_banned'
    },
}, {
    tableName: 'Users',
    freezeTableName: true,
    timestamps: false,
});

// Note: NextAuth adapter will normally create User, Account, Session, VerificationToken models automatically.
// However, relying on side-effects of imports is fragile. Explicit definition handles this dependency.
// We let the adapter handle Account, Session, VerificationToken for now unless we need them in public paths.

// --- DigiCard Specific Models ---

// Mapping `users_profile` from DigiCard
export const UserProfile = sequelize.define('UserProfile', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        // Reference will be set up in associations after User model exists
    },
    f_name: DataTypes.STRING,
    l_name: DataTypes.STRING,
    display_name: DataTypes.STRING(24),
    profession: DataTypes.STRING,
    bio: DataTypes.TEXT,
    company_name: DataTypes.STRING,
    company_description: DataTypes.TEXT, // About the Company
    company_website: DataTypes.STRING, // Company Website URL
    address: DataTypes.STRING,
    map_url: DataTypes.STRING, // Google Maps URL
    phone_no: DataTypes.STRING(20),
    email: DataTypes.STRING, // Email address
    services: DataTypes.JSON, // Stored as JSON string or object
    brochure: DataTypes.TEXT,
    theme_color: {
        type: DataTypes.STRING,
        defaultValue: "#FFFFFF",
    },
    button_color: {
        type: DataTypes.STRING,
        defaultValue: "#1B54E0",
    },
    picture: DataTypes.TEXT('long'), // Profile picture specific to the card
    business_logo: DataTypes.TEXT('long'), // Business Logo
    qr_favicon: DataTypes.TEXT('long'), // QR Code Center Icon
    qr_fg_color: { type: DataTypes.STRING, defaultValue: "#000000" },
    qr_dots_style: { type: DataTypes.STRING, defaultValue: "square" },
    qr_marker_border_style: { type: DataTypes.STRING, defaultValue: "square" },
    qr_marker_center_style: { type: DataTypes.STRING, defaultValue: "square" },
    positions: DataTypes.JSON, // Array of { title, org }
    card_layout: { type: DataTypes.STRING, defaultValue: "accordion" }, // 'accordion' or 'full_page'
    // Suffix Generator Config
    contact_suffix_prefix: { type: DataTypes.STRING, defaultValue: "C" },
    contact_id_counter: { type: DataTypes.INTEGER, defaultValue: 1000 },
    // Appointment Booking
    booking_url: DataTypes.STRING, // Google Calendar Appointment Schedule or Calendly URL
    terms_accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
});

export const SocialHandle = sequelize.define('SocialHandle', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userProfileId: { // Link to UserProfile instead of User directly for correct data modeling
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: UserProfile,
            key: 'id',
        },
    },
    soc_link: DataTypes.STRING,
    type_id: DataTypes.INTEGER,
}, {
    tableName: 'SocialHandles', // Explicitly set table name to match database
});

export const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: UserProfile,
            key: 'id',
        },
    },
    categories: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    prod_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prod_description: {
        type: DataTypes.TEXT,
        defaultValue: 'No description available',
    },
    prod_price: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    prod_picture: {
        type: DataTypes.STRING,
    },
    prod_images: {
        type: DataTypes.JSON, // Stores array of base64 strings
        defaultValue: [],
    },
    prod_type: {
        type: DataTypes.STRING,
    },
    prod_url: {
        type: DataTypes.STRING,
    },
});

export const Gallery = sequelize.define('Gallery', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: UserProfile,
            key: 'id',
        },
    },
    image_url: DataTypes.TEXT, // Stores base64 string
});

export const Interaction = sequelize.define('Interaction', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: UserProfile,
            key: 'id',
        },
    },
    type: DataTypes.STRING,
    url: DataTypes.STRING,
    ip: DataTypes.STRING,
    count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
});

export const Lead = sequelize.define('Lead', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: UserProfile,
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
    },
    viewed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

export const AnalyticsEvent = sequelize.define('AnalyticsEvent', {
    id: {
        type: DataTypes.INTEGER, // High volume expected, integer is faster/smaller than UUID
        autoIncrement: true,
        primaryKey: true,
    },
    userProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: UserProfile,
            key: 'id',
        },
    },
    eventType: {
        type: DataTypes.STRING, // VIEW, CLICK_CONTACT, CLICK_SOCIAL, CLICK_LINK, CLICK_PRODUCT, SHARE
        allowNull: false,
    },
    eventData: {
        type: DataTypes.JSON, // Stores details like 'whatsapp', 'instagram', product ID etc.
        defaultValue: {},
    },
    visitorId: {
        type: DataTypes.STRING, // For calculating unique visitors
        allowNull: true,
    },
});

export const SavedContact = sequelize.define('SavedContact', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: UserProfile,
            key: 'id',
        },
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    alt_phone: DataTypes.STRING,
    company: DataTypes.STRING,
    designation: DataTypes.STRING,
    address: DataTypes.STRING,
    website: DataTypes.STRING,
    notes: DataTypes.TEXT,
    card_image: DataTypes.TEXT('long'), // Base64
    custom_id: DataTypes.STRING, // Auto-generated ID (C1000)
});

// Add Suffix config to UserProfile (Update this via migration in real app)
/* 
   We entered these fields in findOrCreate defaults in user-data.ts earlier, 
   but need to define them here if not already. 
   Existing UserProfile model doesn't show them in lines 19-61.
   Wait, I need to ADD them to UserProfile definition above or rely on `sync({alt:true})`?
   For now, I'll add them to the UserProfile definition block if I can, OR just defined them in the DB.
   Since I cannot edit non-contiguous easily, I'll assume they need adding.
   However, `replace_file_content` is contiguous.
   I should edit UserProfile definition separately.
*/

// --- Associations ---
// Note: Associations with User model will be set up after the adapter initializes it
// This function should be called after NextAuth adapter has created its models
export const setupAssociations = () => {
    // Try both case conventions as NextAuth adapter might use either depending on config
    const User = sequelize.models.User || sequelize.models.user;

    if (User) {
        // App Associations
        User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile' });
        UserProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

        // NextAuth Account Association (Crucial for OAuth linking)
        // Note: Account model is defined in auth.ts, so associations should be set up there
        // to avoid conflicts. We skip setting up Account associations here to prevent
        // duplicate foreign key columns.
        const Account = sequelize.models.Account || sequelize.models.account;
        if (Account) {
            // Only set up associations if Account model exists and doesn't already have them
            // Use targetKey to ensure we use the existing userId column
            User.hasMany(Account, {
                foreignKey: 'userId',
                sourceKey: 'id',
                constraints: false, // Don't create foreign key constraint if column already exists
            });
            Account.belongsTo(User, {
                foreignKey: 'userId',
                targetKey: 'id',
                constraints: false, // Don't create foreign key constraint if column already exists
            });
        }
    }
};

UserProfile.hasMany(SocialHandle, { foreignKey: 'userProfileId', as: 'socialHandles' });
SocialHandle.belongsTo(UserProfile, { foreignKey: 'userProfileId' });

UserProfile.hasMany(Product, { foreignKey: 'userProfileId', as: 'products' });
Product.belongsTo(UserProfile, { foreignKey: 'userProfileId' });

UserProfile.hasMany(Gallery, { foreignKey: 'userProfileId', as: 'gallery' });
Gallery.belongsTo(UserProfile, { foreignKey: 'userProfileId' });

UserProfile.hasMany(Interaction, { foreignKey: 'userProfileId', as: 'interactions' });
Interaction.belongsTo(UserProfile, { foreignKey: 'userProfileId' });

UserProfile.hasMany(Lead, { foreignKey: 'userProfileId', as: 'leads' });
Lead.belongsTo(UserProfile, { foreignKey: 'userProfileId' });

UserProfile.hasMany(AnalyticsEvent, { foreignKey: 'userProfileId', as: 'analyticsEvents' });
AnalyticsEvent.belongsTo(UserProfile, { foreignKey: 'userProfileId' });

// Sync database (Create tables if they don't exist)
// In production, use migrations instead of sync()
let syncPromise: Promise<void> | null = null;

export const syncDatabase = async () => {
    if (syncPromise) return syncPromise;

    syncPromise = (async () => {
        try {
            // The adapter will create its own tables (User, Account, Session, VerificationToken)
            // We only sync our custom models, not the adapter models
            // Exclude adapter models to avoid conflicts
            const adapterModelNames = ['User', 'user', 'Account', 'account', 'Session', 'session', 'VerificationToken', 'verificationToken'];
            const modelsToSync = Object.values(sequelize.models).filter(
                model => !adapterModelNames.includes(model.name)
            );

            if (DB_SYNC && modelsToSync.length > 0) {
                // Sync only our custom models, not adapter models
                await Promise.all(modelsToSync.map(model => (model as any).sync({ alter: false })));
                console.log("ShareCard database models synced successfully.");
            } else {
                console.log("ShareCard database sync skipped (DB_SYNC is false or no models to sync).");
            }

            // Associations are now set up synchronously below
        } catch (err) {
            console.error("Error syncing ShareCard database:", err);
        }
    })();

    return syncPromise;
};

// Setup associations synchronously to ensure they are ready for NextAuth
setupAssociations();

// Auto-sync on import (only happens once due to the promise guard)
syncDatabase();
