const jwt = require('jsonwebtoken');
const { client } = require('./db');

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'token');
    const admin = await client.query('SELECT * FROM admins WHERE id = $1', [decoded.id]);
    if (!admin.rows[0]) {
      throw new Error();
    }
    req.admin = admin.rows[0];
    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

module.exports = {
  authenticateAdmin,
};
