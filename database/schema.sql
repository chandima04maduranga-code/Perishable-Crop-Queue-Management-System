CREATE DATABASE IF NOT EXISTS perishable_crop_db;

USE perishable_crop_db;

CREATE TABLE IF NOT EXISTS crop_batches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    harvest_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    storage_location VARCHAR(150) NOT NULL,

    status ENUM('AVAILABLE', 'DISTRIBUTED')
        NOT NULL DEFAULT 'AVAILABLE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_crop_quantity
        CHECK (quantity >= 0),

    CONSTRAINT chk_crop_dates
        CHECK (expiry_date >= harvest_date)
);

CREATE TABLE IF NOT EXISTS distributions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    crop_batch_id BIGINT NOT NULL,

    quantity DECIMAL(10,2) NOT NULL,

    distributed_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_distribution_crop
        FOREIGN KEY (crop_batch_id)
        REFERENCES crop_batches(id),

    CONSTRAINT chk_distribution_quantity
        CHECK (quantity > 0)
);

CREATE INDEX idx_crop_fifo
ON crop_batches(status, harvest_date, id);

CREATE INDEX idx_crop_expiry
ON crop_batches(expiry_date);



CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(191) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    role ENUM(
        'ADMIN',
        'FARM_MANAGER',
        'DISTRIBUTOR'
    ) NOT NULL,

    status ENUM(
        'PENDING',
        'ACTIVE',
        'DISABLED'
    ) NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role
ON users(role);

CREATE INDEX idx_users_status
ON users(status);