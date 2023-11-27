// const express = require('express') // CommonJS
import express from 'express'// ES Modules
//import csrf from 'csurf'
//import cookieParser from 'cookie-parser'
import userRoutes from "./routes/userRoutes.js"
import db from './config/db.js'

//Crear la app
const app = express()

//Habilitar lectura de datos de formularios
app.use(express.urlencoded({extended: true}))
//Habilitar Cookie Parser
//app.use(cookieParser())
//Habilitar el CSRF
//app.use(csrf({cookie: true}))
//Conexión a la base de datos
try {
    await db.authenticate()
    db.sync()
    console.log('Conexión correcta a la Base de Datos')
} catch(error) {
    console.log(error)
}

//Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

//Carpeta Pública
app.use(express.static('public'))

//Routing
app.use('/auth', userRoutes)

//Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`El servidor está funcionando en el puerto ${port}`)
})