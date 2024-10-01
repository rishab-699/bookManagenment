const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const booksRoute = require('./routes/books');
const UserRoute  = require('./routes/user');
const TransactionRoute  = require('./routes/booktransaction');

dotenv.config()
const app = express();
const port = process.env.PORT;
app.use(cors());

mongoose.connect(process.env.MONGO_URL, {dbName: process.env.dbName})
.then(console.log('Database Connected'))
.catch((err)=> console.log(err));

app.get("/",(req,res)=>{
    res.send('Hello!');
})

app.use(express.json());

app.use('/api/books/', booksRoute);
app.use('/api/user/', UserRoute);
app.use('/api/transaction/', TransactionRoute)

app.listen(port, ()=>{
    console.log(`Application Started on ${port}`)
})