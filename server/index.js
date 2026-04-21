const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',  require('./routes/auth'));        // cook auth
app.use('/api/buyer', require('./routes/buyerAuth'));   // buyer auth
app.use('/api/menu',  require('./routes/menu'));
app.use('/api/cooks', require('./routes/cooks'));

app.get('/', (req, res) => res.send('NearBite API running ✅'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅');
    app.listen(process.env.PORT, () => console.log(`Server on port ${process.env.PORT}`));
  })
  .catch(err => console.log('DB Error:', err));