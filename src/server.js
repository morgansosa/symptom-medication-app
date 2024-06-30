// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const medications = require('./routes/medications');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const users = require('./routes/users');
const symptoms = require('./routes/symptoms');

app.use('/api/users', users);
app.use('/api/symptoms', symptoms);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/medications', medications);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
