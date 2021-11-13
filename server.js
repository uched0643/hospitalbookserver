const express = require('express');
const app = express();
const cors = require('cors');
require('./config/mongodb.config')
require('./config/firebase.config')
const { route } = require('./routes/web.route')

require('dotenv').config()
const port =  process.env.PORT || 8000;

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
  });

app.use(route)
app.listen(port, ()=> console.log(`app is listerning on http://${process.env.HOST}:${port}`) )
