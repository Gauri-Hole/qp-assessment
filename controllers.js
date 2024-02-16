const { loginAdmin, addItem, deleteItem, updateItem, viewItem, bookItems } = require('./services');

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await loginAdmin(username, password);
    console.log("token::", token)
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Invalid credentials' });
  }
};

const adminAddItem = async (req, res) => {
  try {
    const { name, price, inventory } = req.body;
    const result = await addItem(name, price, inventory);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add item' });
  }
};

const adminDeleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const result = await deleteItem(itemId);
    res.status(200).json(result);
  } catch (error) {
    console.error("e..", error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
}
const adminUpdateItem = async (req, res) => {
  try {
    const { name, price, inventory } = req.body;
    const itemId = req.params.id;
    const result = await updateItem(itemId, name, price, inventory);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update item' });
  }
}

const viewItems = async (req, res) => {
  try {
    const result = await viewItem();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to view all item' });
  }
}
const userBookItems = async (req, res) => {
  try {
    const bookedItems = req.body;
    const result = await bookItems(bookedItems);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to book items' });
  }
}


module.exports = {
  adminLogin,
  adminAddItem,
  adminDeleteItem,
  adminUpdateItem,
  viewItems,
  userBookItems,
};
