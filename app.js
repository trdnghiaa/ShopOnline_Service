require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth.js');

const app = express();
const port = process.env.PORT || 3000;



app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ShopOnline', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});