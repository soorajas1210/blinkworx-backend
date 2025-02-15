import pool from "../config/db.js";

export const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ORDERS (
        id SERIAL PRIMARY KEY,
        orderDescription VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS PRODUCTS (
        id SERIAL PRIMARY KEY,
        productName VARCHAR(100) NOT NULL,
        productDescription TEXT
      );

      CREATE TABLE IF NOT EXISTS OrderProductMap (
        id SERIAL PRIMARY KEY,
        orderId INT NOT NULL,
        productId INT NOT NULL,
        FOREIGN KEY (orderId) REFERENCES ORDERS(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES PRODUCTS(id) ON DELETE CASCADE
      );
    `);

    console.log("Tables checked/created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};
