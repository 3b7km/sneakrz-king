-- Sneakrz King Database Schema
-- This SQL schema can be used when you set up a backend database

-- Create database
CREATE DATABASE sneakrz_king;
USE sneakrz_king;

-- Customers table
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL UNIQUE,
    address TEXT,
    city VARCHAR(100),
    governorate VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_email (email)
);

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    condition_type VARCHAR(50) DEFAULT 'Brand New',
    authenticity VARCHAR(100) DEFAULT '100% Guaranteed',
    rating DECIMAL(2, 1) DEFAULT 0.0,
    is_new BOOLEAN DEFAULT FALSE,
    on_sale BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_brand (brand),
    INDEX idx_category (category),
    INDEX idx_price (price)
);

-- Product images table
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id)
);

-- Product sizes table
CREATE TABLE product_sizes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    size VARCHAR(10) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    UNIQUE KEY unique_product_size (product_id, size)
);

-- Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) DEFAULT 80.00,
    payment_method VARCHAR(50) DEFAULT 'cash_on_delivery',
    customer_notes TEXT,
    admin_notes JSON,
    delivery_address TEXT,
    delivery_city VARCHAR(100),
    delivery_governorate VARCHAR(100),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_order_number (order_number),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date)
);

-- Order items table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_brand VARCHAR(100) NOT NULL,
    selected_size VARCHAR(10),
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    product_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);

-- Order status history table (for tracking status changes)
CREATE TABLE order_status_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by VARCHAR(100) DEFAULT 'system',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_created_at (created_at)
);

-- Create views for easier querying

-- Customer orders summary view
CREATE VIEW customer_orders_summary AS
SELECT 
    c.id as customer_id,
    c.name as customer_name,
    c.phone as customer_phone,
    c.email as customer_email,
    COUNT(o.id) as total_orders,
    SUM(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
    SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
    SUM(CASE WHEN o.status = 'delivered' THEN o.total ELSE 0 END) as total_spent,
    MAX(o.order_date) as last_order_date
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name, c.phone, c.email;

-- Order details view
CREATE VIEW order_details_view AS
SELECT 
    o.id,
    o.order_number,
    o.status,
    o.total,
    o.shipping_fee,
    o.payment_method,
    o.order_date,
    o.delivered_at,
    c.name as customer_name,
    c.phone as customer_phone,
    c.email as customer_email,
    c.address as customer_address,
    c.city as customer_city,
    c.governorate as customer_governorate,
    COUNT(oi.id) as item_count,
    GROUP_CONCAT(
        CONCAT(oi.product_name, ' (', oi.selected_size, ') x', oi.quantity)
        SEPARATOR ', '
    ) as items_summary
FROM orders o
JOIN customers c ON o.customer_id = c.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, o.status, o.total, o.shipping_fee, 
         o.payment_method, o.order_date, o.delivered_at,
         c.name, c.phone, c.email, c.address, c.city, c.governorate;

-- Sample queries for common operations:

-- 1. Get all pending orders
-- SELECT * FROM order_details_view WHERE status = 'pending' ORDER BY order_date DESC;

-- 2. Get customer order history
-- SELECT * FROM order_details_view WHERE customer_phone = '+201234567890' ORDER BY order_date DESC;

-- 3. Get daily sales report
-- SELECT 
--     DATE(order_date) as order_day,
--     COUNT(*) as orders_count,
--     SUM(total) as daily_revenue
-- FROM orders 
-- WHERE status = 'delivered' 
-- GROUP BY DATE(order_date) 
-- ORDER BY order_day DESC;

-- 4. Get top selling products
-- SELECT 
--     oi.product_name,
--     oi.product_brand,
--     SUM(oi.quantity) as total_sold,
--     SUM(oi.total_price) as total_revenue
-- FROM order_items oi
-- JOIN orders o ON oi.order_id = o.id
-- WHERE o.status = 'delivered'
-- GROUP BY oi.product_name, oi.product_brand
-- ORDER BY total_sold DESC;

-- 5. Update order status with history tracking
-- DELIMITER //
-- CREATE PROCEDURE UpdateOrderStatus(
--     IN order_id INT,
--     IN new_status VARCHAR(50),
--     IN status_notes TEXT,
--     IN changed_by_user VARCHAR(100)
-- )
-- BEGIN
--     DECLARE old_status VARCHAR(50);
--     
--     -- Get current status
--     SELECT status INTO old_status FROM orders WHERE id = order_id;
--     
--     -- Update order status
--     UPDATE orders 
--     SET status = new_status,
--         confirmed_at = CASE WHEN new_status = 'confirmed' THEN CURRENT_TIMESTAMP ELSE confirmed_at END,
--         shipped_at = CASE WHEN new_status = 'shipped' THEN CURRENT_TIMESTAMP ELSE shipped_at END,
--         delivered_at = CASE WHEN new_status = 'delivered' THEN CURRENT_TIMESTAMP ELSE delivered_at END,
--         updated_at = CURRENT_TIMESTAMP
--     WHERE id = order_id;
--     
--     -- Insert status history
--     INSERT INTO order_status_history (order_id, old_status, new_status, notes, changed_by)
--     VALUES (order_id, old_status, new_status, status_notes, changed_by_user);
-- END //
-- DELIMITER ;

-- Insert sample data (optional)
-- INSERT INTO customers (name, phone, email, address, city, governorate) VALUES
-- ('Ahmed Mohamed', '+201234567890', 'ahmed@example.com', '123 Main St', 'Cairo', 'Cairo'),
-- ('Sara Ali', '+201234567891', 'sara@example.com', '456 Oak Ave', 'Alexandria', 'Alexandria');

-- INSERT INTO products (name, brand, category, price, original_price, rating, is_new) VALUES
-- ('Nike Air Force 1 Triple White', 'Nike', 'Lifestyle', 1950.00, 2700.00, 4.8, TRUE),
-- ('Adidas Samba OG White Black Gum', 'Adidas', 'Lifestyle', 1750.00, 2100.00, 4.5, FALSE);
