const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Secret key (should be stored in an env variable in production)
const SECRET_KEY = 'your_secret_key';

// 🔐 Utility function to generate a JWT token
const encrypt = (payload, secret) => {
  return jwt.sign(payload, secret, { expiresIn: '60s' });
};

// 📌 Route to generate token using `encrypt`
app.get('/token', (req, res) => {
  const payload = { userId: 123, role: 'admin' };
  const token = encrypt(payload, SECRET_KEY);
  res.json({ token });
});

// 🔐 Middleware to verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('Access denied. No token provided.');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Token expired or invalid.');

    req.user = user;
    next();
  });
}

// 🔒 Protected route
app.get('/protected', verifyToken, (req, res) => {
  res.send(`Hello User ${req.user.userId}, access granted.`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ✅ Export the encrypt function (optional, if used elsewhere)
module.exports = encrypt;
