import express from "express"
import { formLogin, formSignup, signup, confirm, formForgetPassword } from "../controllers/userController.js"

const router = express.Router()

//Routing
router.get('/login', formLogin)
router.get('/signup', formSignup)
router.post('/signup', signup)
router.get('/confirm/:token', confirm)
router.get('/forget-password', formForgetPassword)

// router.route('/')
// .get(function(req, res) {
//     res.json({msg: 'Hola mundo'})
// })
// .post(function(req, res) {
//     res.json({msg: 'Nosotros'})
// })

export default router