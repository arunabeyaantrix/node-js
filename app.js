const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const authJwt = require('./helpers/jwt')
var config = require('./config/config');
require('dotenv/config')

// "mongodb": {
//     "host": "localhost",
//     "port": 27017,
//     "database": "mongodb://localhost/magicplanet"
// },


app.use(bodyParser.json())
app.use(morgan('tiny'))

const api = process.env.API_URL
//middleware
const Product = require('./models/product')
const productReducer = require('./router/product')
const categoryReducer = require('./router/category')
const userReducer = require('./router/user')
app.use(`${api}/products`, productReducer)
app.use(`${api}/categories`, categoryReducer)
app.use(`${api}/users`, userReducer)
app.use(authJwt)
app.use(cors());
app.options('*', cors())


// mongoose.connect(process.env.DATABASE_MONGOOSE, {
//     useNewUrlParser: true,
//     useUnifiedTopology:true,
//     dbName: 'Ecommerce'
// })
// .then(() => {
//     console.log('Db connection ready');
// })
// .catch((err) => {
//     console.log(err);
// })

mongoose.connect(config.mongodb.database, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
})
.then(() => {
    console.log('Db connection ready');
})
.catch((err) => {
    console.log(err);
})


app.listen(3000, () => {
    console.log('server is running at http://localhost:3000')
})
