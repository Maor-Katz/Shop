const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());



app.use('/auth', require('./auth'))
app.use('/products', require('./products'))

app.listen(1009, console.log('server running'));