import pool from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const query = `SELECT * FROM PRODUCTS`;
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Products not found" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addNewProduct = async (req, res) => {
  const { productName, productDescription } = req.body;

  if (!productName || !productDescription) {
    return res
      .status(400)
      .json({ message: "Product name and description are required" });
  }

  try {
    const query = `
      INSERT INTO PRODUCTS (productName, productDescription)
      VALUES ($1, $2) RETURNING id, productName, productDescription
    `;
    const values = [productName, productDescription];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Product added successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      DELETE FROM PRODUCTS
      WHERE id = $1
      RETURNING id
    `;
    const values = [id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      orderId: id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
