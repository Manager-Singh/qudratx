require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const app = express();
const adminRoute = require('./routes/admin/index')
const authenticateJWT = require('./middlewares/auth')
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/error');
const {isAdmin, isEmployee} = require('./middlewares/roleCheck')
require('./config/passport')(passport);

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


app.get('/', (req, res) => res.send('Welcome to the API!'));

app.use('/api', authRoutes);
app.use('/admin',authenticateJWT,isAdmin,adminRoute)

const PORT = process.env.PORT || 5000;
sequelize.authenticate()
  .then(() => {
    console.log('✅ DB Connected');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ DB Error:', err));

app.use(errorHandler);
