import { z } from "zod";

// Regex patterns
const phoneRegExp = /^(\+91)?[6-9]\d{9}$/;
const urlRegExp = /^https?:\/\/[^\s$.?#].[^\s]*$/;

// Social Link Schema
export const SocialLinkSchema = z.object({
    id: z.number().optional(),
    type_id: z.number(),
    link: z.string().optional().default(""), // Made optional with default empty string
}).superRefine((data, ctx) => {
    // Skip all validation if link is empty or whitespace
    if (!data.link || data.link.trim() === "") return;

    // WhatsApp (ID 1)
    if (data.type_id === 1) {
        // Validation: Exactly 10 digits
        const isTenDigits = /^\d{10}$/.test(data.link.trim());
        if (!isTenDigits) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Enter 10-digit mobile number",
                path: ["link"],
            });
        }
    } else {
        // Other Social Links
        let cleanLink = data.link.trim();
        cleanLink = cleanLink.replace(/^https?:\/\//, '');

        const isDomain = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(cleanLink);

        if (!isDomain) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid format (e.g., instagram.com/username)",
                path: ["link"],
            });
        }
    }
});
// Product Schema
export const ProductSchema = z.object({
    id: z.number().optional(),
    prod_name: z.string().min(1, "Product name is required").max(100),
    prod_description: z.string().min(1, "Description is required"),
    prod_price: z.coerce.number().min(0, "Price must be positive").default(0),
    prod_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    prod_type: z.enum(["Physical", "IT"]).default("Physical"),
    prod_images: z.array(z.string()).optional(),
});

// Main Profile Schema
export const UserProfileSchema = z.object({
    userImage: z.string().optional(), // Profile Picture URL or Base64
    business_logo: z.string().optional(), // Business Logo URL or Base64
    theme_color: z.string().optional().default("#FFFFFF"),
    button_color: z.string().optional().default("#1B54E0"),
    qr_favicon: z.string().optional(), // QR Code Favicon URL or Base64
    qr_fg_color: z.string().optional().default("#000000"),
    qr_dots_style: z.string().optional().default("square"),
    qr_marker_border_style: z.string().optional().default("square"),
    qr_marker_center_style: z.string().optional().default("square"),
    card_layout: z.enum(["accordion", "full_page"]).optional().default("accordion"),
    f_name: z.string().min(2, "First Name must be at least 2 characters"),
    l_name: z.string().min(1, "Last Name is required"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    phone_no: z.string().regex(phoneRegExp, "Invalid phone number").optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    map_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    company_name: z.string().min(1, "Company Name is required"),
    company_description: z.string().optional(), // About the Company
    company_website: z.string().url("Invalid URL").optional().or(z.literal("")),
    designation: z.string().optional(), // Maps to 'profession'
    bio: z.string().optional(),
    display_name: z.string().min(1, "Display Name is required").regex(/^[a-zA-Z0-9._-]+$/, "Invalid display name format"),

    // Nested Objects managed via UI states
    social_links: z.array(SocialLinkSchema).optional().transform(links => {
        return links
            ?.filter(link => link.link && link.link.trim() !== "") // FILTER OUT EMPTY LINKS
            ?.map(link => {
                if (link.type_id !== 1) { // Not WhatsApp
                    // Strip protocol
                    return { ...link, link: link.link.replace(/^https?:\/\//, '') };
                }
                return link;
            });
    }),
    products: z.array(ProductSchema).max(10, "Maximum 10 products allowed").optional(),
    gallery: z.array(z.string()).optional(), // Array of base64 strings
    services: z.array(z.string()).optional(), // Array of service names
    brochure: z.string().optional(), // Brochure URL or Base64
    positions: z.array(z.object({
        title: z.string().min(1, "Title is required"),
        org: z.string().min(1, "Organization is required")
    })).optional().default([]),
    booking_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    terms_accepted: z.boolean().refine(val => val === true, {
        message: "You must accept the Terms and Conditions"
    }),
});

// Settings Schema - Only validates theme and QR code settings
// All other fields are optional to allow saving settings without full profile validation
export const SettingsSchema = z.object({
    // Settings fields (required for settings dialog)
    theme_color: z.string().optional().default("#FFFFFF"),
    button_color: z.string().optional().default("#1B54E0"),
    qr_favicon: z.string().optional(),
    qr_fg_color: z.string().optional().default("#000000"),
    qr_dots_style: z.string().optional().default("square"),
    qr_marker_border_style: z.string().optional().default("square"),
    qr_marker_center_style: z.string().optional().default("square"),
    card_layout: z.enum(["accordion", "full_page"]).optional().default("accordion"),

    // All other fields are optional (will be merged with existing profile data)
    userImage: z.string().optional(),
    business_logo: z.string().optional(),
    f_name: z.string().optional(),
    l_name: z.string().optional(),
    email: z.string().optional(),
    phone_no: z.string().optional(),
    address: z.string().optional(),
    map_url: z.string().optional(),
    company_name: z.string().optional(),
    company_description: z.string().optional(),
    company_website: z.string().optional(),
    designation: z.string().optional(),
    bio: z.string().optional(),
    display_name: z.string().optional(),
    social_links: z.array(SocialLinkSchema).optional(),
    products: z.array(ProductSchema).optional(),
    gallery: z.array(z.string()).optional(),
    services: z.array(z.string()).optional(),
    brochure: z.string().optional(),
    positions: z.array(z.object({
        title: z.string().optional(),
        org: z.string().optional()
    })).optional(),
    booking_url: z.string().optional(),
    terms_accepted: z.boolean().optional(),
});
