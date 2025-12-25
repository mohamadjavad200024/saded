-- Fix vehicle logo column size
-- Change from VARCHAR(500) to LONGTEXT to support large base64 images

ALTER TABLE vehicles MODIFY COLUMN logo LONGTEXT;

