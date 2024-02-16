// services.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { client } = require('./db');

const loginAdmin = async (username, password) => {
  const admin = await client.query('SELECT * FROM admins WHERE username = $1', [username]);
  if (!admin.rows[0] || !(await bcrypt.compare(password, admin.rows[0].password))) {
    throw new Error();
  }

  const token = jwt.sign({ id: admin.rows[0].id }, 'token');
  return token;
};

const addItem = async (name, price, inventory) => {
  const result = await client.query('INSERT INTO grocery_items(name, price, inventory) VALUES($1, $2, $3) RETURNING *', [name, price, inventory]);
  return result.rows[0];
};

const deleteItem = async (itemId) => {
  try {
    let result = await client.query('DELETE FROM grocery_items WHERE id = $1 RETURNING *', [itemId]);
    if (result.rows.length > 0) {
      return result = ({ message: 'Item removed successfully', removedItem: result.rows[0] });
    } else {
      return result = ({ error: 'Item not found' });
    }
  } catch (error) {
    console.error(error);
    return error;
  }
}

const updateItem = async (itemId, name, price, inventory) => {
  try {
    let result = await client.query('UPDATE grocery_items SET name = $1, price = $2, inventory = $3 WHERE id = $4 RETURNING *', [name, price, inventory, itemId]);
    if (result.rows.length > 0) {
      return result = ({ message: 'Item updated successfully', updatedItem: result.rows[0] });
    } else {
      return result = ({ error: 'Item not found' });
    }
  } catch (error) {
    console.error(error);
    return error;
  }
}

const viewItem = async () => {
  try {
    const result = await client.query('SELECT * FROM grocery_items');
    const count = result.rowCount;
    return { count: count, data: result.rows };
  } catch (error) {
    console.error(error);
    return error;
  }
}

const bookItems = async (bookedItems) => {
  try {
    // Fetch the details of the booked items
    const itemDetailsQueries = bookedItems.map(item => {
      return client.query('SELECT * FROM grocery_items WHERE id = $1', [item.itemId]);
    });

    // Execute all item details queries
    const itemDetailsResults = await Promise.all(itemDetailsQueries);

    // Check if there is enough inventory for each item
    const insufficientInventory = itemDetailsResults.some((result, index) => {
      const bookedQuantity = bookedItems[index].quantity;
      return result.rows.length === 0 || result.rows[0].inventory < bookedQuantity;
    });

    if (insufficientInventory) {
      return ({ error: 'Some items are out of stock or not found' });
    }

    // Update the inventory count for each booked item based on quantity
    const updateQueries = itemDetailsResults.map((result, index) => {
      const bookedQuantity = bookedItems[index].quantity;
      return client.query('UPDATE grocery_items SET inventory = inventory - $1 WHERE id = $2 RETURNING *', [bookedQuantity, result.rows[0].id]);
    });

    // Execute all update queries
    const updatedItems = await Promise.all(updateQueries);

    return ({ message: 'Items booked successfully', bookedItems: updatedItems.map(result => result.rows[0]) });

  } catch (error) {
    console.error(error);
    return error;
  }
}

module.exports = {
  loginAdmin,
  addItem,
  deleteItem,
  updateItem,
  viewItem,
  bookItems,
};
