import pool from "../config/db.js";
import { createTables } from "../models/tablesSchema.js";
createTables();

export const getOrder = async (req, res) => {
  try {
    const query = `
      SELECT 
        o.id AS orderId,
        o.orderDescription,
        o.createdAt,
        COUNT(opm.productId) AS productCount
      FROM ORDERS o
      LEFT JOIN OrderProductMap opm ON o.id = opm.orderId
      GROUP BY o.id, o.orderDescription, o.createdAt
      ORDER BY o.createdAt ASC
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const orderQuery = `
      SELECT id AS orderId, orderDescription, createdAt 
      FROM ORDERS WHERE id = $1
    `;
    const orderResult = await pool.query(orderQuery, [id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult.rows[0];

    const productsQuery = `
      SELECT p.id AS productId, p.productName, p.productDescription
      FROM PRODUCTS p
      INNER JOIN OrderProductMap opm ON p.id = opm.productId
      WHERE opm.orderId = $1
    `;
    const productsResult = await pool.query(productsQuery, [id]);

    res.status(200).json({
      orderId: order.orderid,
      orderDescription: order.orderdescription,
      createdAt: order.createdat,
      productCount: productsResult.rows.length,
      products: productsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addNewOrder = async (req, res) => {
  const { orderDescription, pIds } = req.body;
  console.log(orderDescription, pIds);
  if (!orderDescription) {
    return res.status(400).json({ message: "Order description is required" });
  }
  if (!pIds || pIds.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one product ID is required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderQuery = `
      INSERT INTO ORDERS (orderDescription)
      VALUES ($1) RETURNING id, orderDescription, createdAt
    `;
    const orderValues = [orderDescription];
    const orderResult = await client.query(orderQuery, orderValues);
    const order = orderResult.rows[0];
    const orderId = order.id;

    const orderProductQuery = `
      INSERT INTO OrderProductMap (orderId, productId)
      VALUES ($1, $2)
    `;
    for (const productId of pIds) {
      await client.query(orderProductQuery, [orderId, productId]);
    }

    const countQuery = `
      SELECT COUNT(*) AS productCount FROM OrderProductMap WHERE orderId = $1
    `;
    const countResult = await client.query(countQuery, [orderId]);
    const productCount = countResult.rows[0].productcount;

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order added successfully",
      order: {
        orderId,
        orderDescription: order.orderdescription,
        createdAt: order.createdat,
        productCount,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error adding order:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

export const updateOrderById = async (req, res) => {
  const { id } = req.params;
  const { orderDescription, pIds } = req.body;

  if (!orderDescription && (!pIds || pIds.length === 0)) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let updatedOrder = null;

    if (orderDescription) {
      const updateOrderQuery = `
        UPDATE ORDERS
        SET orderDescription = $1
        WHERE id = $2
        RETURNING id, orderDescription, createdAt
      `;
      const orderResult = await client.query(updateOrderQuery, [
        orderDescription,
        id,
      ]);

      if (orderResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Order not found" });
      }

      updatedOrder = orderResult.rows[0];
    }

    if (pIds && pIds.length > 0) {
      await client.query("DELETE FROM OrderProductMap WHERE orderId = $1", [
        id,
      ]);

      const insertOrderProductQuery = `
        INSERT INTO OrderProductMap (orderId, productId) VALUES ($1, $2)
      `;
      for (const productId of pIds) {
        await client.query(insertOrderProductQuery, [id, productId]);
      }
    }

    const countQuery = `
      SELECT COUNT(*) AS productCount FROM OrderProductMap WHERE orderId = $1
    `;
    const countResult = await client.query(countQuery, [id]);
    const productCount = countResult.rows[0].productcount;

    await client.query("COMMIT");

    res.status(200).json({
      message: "Order updated successfully",
      order: {
        orderId: updatedOrder ? updatedOrder.id : id,
        orderDescription: updatedOrder ? updatedOrder.orderdescription : null,
        createdAt: updatedOrder ? updatedOrder.createdat : null,
        productCount,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

export const removeOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      DELETE FROM ORDERS
      WHERE id = $1
      RETURNING id
    `;
    const values = [id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: `Order ${id} deleted successfully `,
      orderId: id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
