const app = require('express')()
const consign = require('consign')
const db = require('./config/db')

//instanciação do knex na váriavel app 
app.db = db

consign()
.then('./config/middlewares.js')
.then('./api/validator.js')
.then('./api')
.then('./config/routes.js')
.into(app)


app.listen(3000, ()=>{
    console.log('Back executando...')

})