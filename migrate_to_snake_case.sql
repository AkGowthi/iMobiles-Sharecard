-- =====================================================
-- Migration Script: Convert NextAuth columns to snake_case
-- =====================================================
-- Run this script if your database already exists with camelCase column names
-- This will rename columns to match what @auth/sequelize-adapter expects
-- =====================================================

-- Migrate Users table
ALTER TABLE `Users` 
  CHANGE COLUMN `emailVerified` `email_verified` datetime DEFAULT NULL,
  CHANGE COLUMN `isBanned` `is_banned` tinyint(1) DEFAULT '0';

-- Migrate Accounts table
ALTER TABLE `Accounts`
  CHANGE COLUMN `userId` `user_id` char(36) NOT NULL,
  CHANGE COLUMN `providerAccountId` `provider_account_id` varchar(255) NOT NULL;

-- Update foreign key constraint name and column reference
ALTER TABLE `Accounts`
  DROP FOREIGN KEY `Accounts_userId_fkey`,
  ADD CONSTRAINT `Accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Update unique index on Accounts
ALTER TABLE `Accounts`
  DROP INDEX `provider`,
  ADD UNIQUE KEY `provider` (`provider`,`provider_account_id`);

-- Migrate Sessions table
ALTER TABLE `Sessions`
  CHANGE COLUMN `sessionToken` `session_token` varchar(255) NOT NULL,
  CHANGE COLUMN `userId` `user_id` char(36) NOT NULL;

-- Update foreign key constraint name and column reference
ALTER TABLE `Sessions`
  DROP FOREIGN KEY `Sessions_userId_fkey`,
  ADD CONSTRAINT `Sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Update unique index on Sessions
ALTER TABLE `Sessions`
  DROP INDEX `sessionToken`,
  ADD UNIQUE KEY `session_token` (`session_token`);

-- VerificationTokens table should already be correct (uses identifier, token, expires)

-- =====================================================
-- Verification
-- =====================================================
-- After running this migration, verify the changes:
-- DESCRIBE Users;
-- DESCRIBE Accounts;
-- DESCRIBE Sessions;
