-- =====================================================
-- ShareCard Database Schema
-- =====================================================
-- This schema matches the Sequelize models defined in the codebase
-- Tables use InnoDB engine with utf8mb4 charset for full Unicode support
-- =====================================================

-- =====================================================
-- NextAuth Tables (Authentication & Authorization)
-- =====================================================

-- Users table (NextAuth + Custom fields)
-- Managed by @auth/sequelize-adapter, but table name is 'Users' (capitalized)
-- Note: Adapter expects snake_case column names (email_verified) but maps to camelCase in models
CREATE TABLE IF NOT EXISTS `Users` (
  `id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified` datetime DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_banned` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Accounts table (NextAuth OAuth providers)
-- Note: Adapter expects snake_case column names
CREATE TABLE IF NOT EXISTS `Accounts` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `provider_account_id` varchar(255) NOT NULL,
  `refresh_token` text,
  `access_token` text,
  `expires_at` int DEFAULT NULL,
  `token_type` varchar(255) DEFAULT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `id_token` text,
  `session_state` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `provider` (`provider`,`provider_account_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sessions table (NextAuth)
-- Note: Adapter expects snake_case column names
CREATE TABLE IF NOT EXISTS `Sessions` (
  `id` char(36) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `user_id` char(36) NOT NULL,
  `expires` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token` (`session_token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- VerificationTokens table (NextAuth email verification)
CREATE TABLE IF NOT EXISTS `VerificationTokens` (
  `identifier` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires` datetime NOT NULL,
  PRIMARY KEY (`token`),
  UNIQUE KEY `identifier` (`identifier`,`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Application Tables (ShareCard Specific)
-- =====================================================

-- UserProfiles table (User profile and card data)
-- One-to-one relationship with Users table
CREATE TABLE IF NOT EXISTS `UserProfiles` (
  `id` char(36) NOT NULL,
  `userId` char(36) NOT NULL,
  `f_name` varchar(255) DEFAULT NULL,
  `l_name` varchar(255) DEFAULT NULL,
  `display_name` varchar(24) DEFAULT NULL,
  `profession` varchar(255) DEFAULT NULL,
  `bio` text,
  `company_name` varchar(255) DEFAULT NULL,
  `company_description` text,
  `company_website` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `map_url` varchar(255) DEFAULT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `services` json DEFAULT NULL,
  `brochure` longtext,
  `theme_color` varchar(255) DEFAULT '#FFFFFF',
  `button_color` varchar(255) DEFAULT '#1B54E0',
  `picture` longtext,
  `business_logo` longtext,
  `qr_favicon` longtext,
  `qr_fg_color` varchar(255) DEFAULT '#000000',
  `qr_dots_style` varchar(255) DEFAULT 'square',
  `qr_marker_border_style` varchar(255) DEFAULT 'square',
  `qr_marker_center_style` varchar(255) DEFAULT 'square',
  `positions` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `UserProfiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SocialHandles table (Social media links)
-- Many-to-one relationship with UserProfiles
CREATE TABLE IF NOT EXISTS `SocialHandles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userProfileId` char(36) NOT NULL,
  `soc_link` varchar(255) DEFAULT NULL,
  `type_id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userProfileId` (`userProfileId`),
  CONSTRAINT `SocialHandles_userProfileId_fkey` FOREIGN KEY (`userProfileId`) REFERENCES `UserProfiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table (Product catalog)
-- Many-to-one relationship with UserProfiles
CREATE TABLE IF NOT EXISTS `Products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userProfileId` char(36) NOT NULL,
  `categories` json DEFAULT NULL,
  `prod_name` varchar(255) NOT NULL,
  `prod_description` text DEFAULT 'No description available',
  `prod_price` int DEFAULT '0',
  `prod_picture` varchar(255) DEFAULT NULL,
  `prod_images` json DEFAULT NULL,
  `prod_type` varchar(255) DEFAULT NULL,
  `prod_url` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userProfileId` (`userProfileId`),
  CONSTRAINT `Products_userProfileId_fkey` FOREIGN KEY (`userProfileId`) REFERENCES `UserProfiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Galleries table (Image gallery)
-- Many-to-one relationship with UserProfiles
CREATE TABLE IF NOT EXISTS `Galleries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userProfileId` char(36) NOT NULL,
  `image_url` longtext,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userProfileId` (`userProfileId`),
  CONSTRAINT `Galleries_userProfileId_fkey` FOREIGN KEY (`userProfileId`) REFERENCES `UserProfiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Interactions table (User interaction tracking)
-- Many-to-one relationship with UserProfiles
CREATE TABLE IF NOT EXISTS `Interactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userProfileId` char(36) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `count` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userProfileId` (`userProfileId`),
  CONSTRAINT `Interactions_userProfileId_fkey` FOREIGN KEY (`userProfileId`) REFERENCES `UserProfiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Leads table (Contact form submissions)
-- Many-to-one relationship with UserProfiles
CREATE TABLE IF NOT EXISTS `Leads` (
  `id` char(36) NOT NULL,
  `userProfileId` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `message` text,
  `viewed` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userProfileId` (`userProfileId`),
  CONSTRAINT `Leads_userProfileId_fkey` FOREIGN KEY (`userProfileId`) REFERENCES `UserProfiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AnalyticsEvents table (Analytics and event tracking)
-- Many-to-one relationship with UserProfiles
CREATE TABLE IF NOT EXISTS `AnalyticsEvents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userProfileId` char(36) NOT NULL,
  `eventType` varchar(255) NOT NULL,
  `eventData` json DEFAULT NULL,
  `visitorId` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userProfileId` (`userProfileId`),
  CONSTRAINT `AnalyticsEvents_userProfileId_fkey` FOREIGN KEY (`userProfileId`) REFERENCES `UserProfiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Performance Indexes
-- =====================================================
-- Note: Run these indexes after table creation. MySQL doesn't support IF NOT EXISTS for indexes.
-- These indexes improve query performance for common operations:

-- Index on display_name for slug-based profile lookups (used in getProfileBySlug)
-- CREATE INDEX `idx_userprofiles_display_name` ON `UserProfiles` (`display_name`);

-- Index on userProfileId and type for Interactions queries
-- CREATE INDEX `idx_interactions_userProfileId_type` ON `Interactions` (`userProfileId`, `type`);

-- Index on userProfileId and eventType for AnalyticsEvents queries
-- CREATE INDEX `idx_analytics_userProfileId_eventType` ON `AnalyticsEvents` (`userProfileId`, `eventType`);

-- Index on createdAt for AnalyticsEvents time-based queries (used in getAnalytics)
-- CREATE INDEX `idx_analytics_createdAt` ON `AnalyticsEvents` (`createdAt`);

-- Index on viewed status for Leads filtering
-- CREATE INDEX `idx_leads_viewed` ON `Leads` (`viewed`);

-- =====================================================
-- Notes
-- =====================================================
-- 1. All UUID fields use char(36) to store UUID strings
-- 2. JSON fields are used for flexible data structures:
--    - services (UserProfiles): Array of service names
--    - categories (Products): Product categories
--    - positions (UserProfiles): Array of {title, org} objects
--    - eventData (AnalyticsEvents): Event-specific data
--    - prod_images (Products): Array of base64 image strings
-- 3. LONGTEXT fields are used for base64-encoded images:
--    - picture (UserProfiles): Profile picture
--    - business_logo (UserProfiles): Business logo
--    - qr_favicon (UserProfiles): QR code center icon
--    - brochure (UserProfiles): Brochure/document
--    - image_url (Galleries): Gallery images
-- 4. VARCHAR(255) fields:
--    - prod_picture (Products): Single product image URL or base64 (limited size)
-- 5. Foreign keys use CASCADE DELETE to maintain referential integrity
-- 6. Table names are capitalized to match Sequelize model configurations
-- 7. NextAuth tables (Users, Accounts, Sessions, VerificationTokens) use snake_case column names
--    as expected by @auth/sequelize-adapter (e.g., email_verified, user_id, session_token)
-- 8. Application tables use camelCase for foreign keys (userId, userProfileId) matching model definitions
-- 9. Default values match model definitions (e.g., prod_description default, prod_price default 0)
-- 10. Field constraints match model definitions (allowNull, unique, etc.)
