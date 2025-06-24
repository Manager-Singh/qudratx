const express = require('express');
const router = express.Router();
const {login ,logout} = require('../controllers/authController');
const passport = require('passport');
const authenticateJWT = require('../middlewares/auth');
const { isAdmin, isEmployee } = require('../middlewares/roleCheck');


// POST /api/auth/login
router.post('/login',passport.authenticate('local', { session: false }),login);
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});


router.get('/me', authenticateJWT, (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});



module.exports = router;