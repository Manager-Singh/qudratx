const dotenv=require('dotenv')
dotenv.config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const errorHandler = require('./middlewares/error');
const cookieparser=require('cookie-parser')
const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true, 
}));
app.use(express.json());
app.use(cookieparser())


app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'This is your API data' });
});
const PORT = process.env.PORT || 4000;
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');
    return sequelize.sync();
  })
  .then(() => {
    console.log('✅ Models synced');
 
    console.log('PORT from env:', PORT); // debug line
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
  });

// Error Middleware
app.use(errorHandler);
