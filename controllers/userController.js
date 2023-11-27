import {check, validationResult} from 'express-validator'
import User from '../models/User.js'
import {generateId} from '../helpers/tokens.js'
import {emailRegister} from '../helpers/emails.js'

const formLogin = (req, res) => {
    res.render('auth/login', {
        page: 'Iniciar Sesión'
    })
}
const formSignup = (req, res) => {
    res.render('auth/signup', {
        page: 'Crear Cuenta'
    })
}
const signup = async(req, res) => {
    //Validación
    await check('name').notEmpty().withMessage('El nombre de usuario es obligatorio').run(req)
    await check('email').isEmail().withMessage('Ingrese un correo válido').run(req)
    await check('password').isLength({min: 6}).withMessage('Contraseña de mínimo 6 caracteres').run(req)
    await check('repeat_password').equals(req.body.password).withMessage('Ambas contraseñas deben ser iguales').run(req)
    let result = validationResult(req)
    //Verificar que 'result' esté vacío
    if(!result.isEmpty()) {
        return res.render('auth/signup', {
            page: 'Crear Cuenta',
            errors: result.array(),
            user: {
                name: req.body.name,
                email: req.body.email
            }
        })
    }
    //Extraer los datos
    const {name, email, password} = req.body
    //Verificar que el usuario no esté duplicado
    const userExist = await User.findOne({where: {email}})
    if(userExist) {
        return res.render('auth/signup', {
            page: 'Crear Cuenta',
            errors: [{msg: 'El correo ya está en uso'}],
            user: {
                name: req.body.name,
                email: req.body.email
            }
        })
    }
    //Almacenar un usuario
    const user = await User.create({
        name,
        email,
        password,
        token: generateId()
    })
    //Envia email de confirmación
    emailRegister({
        name: user.name,
        email: user.email,
        token: user.token
    })
    //Mostrar mensaje de confirmación
    res.render('templates/message', {
        page: 'Cuenta creada correctamente',
        message: 'Revisa tu correo para confirmar tu cuenta'
    })
}
//Función que comprueba una cuenta
const confirm = async(req, res) => {
    const {token} = req.params
    //Verificar si el token es válido
    const user = await User.findOne({where: {token}})
    if(!user) {
        return res.render('auth/confirm-account', {
            page: 'Hubo un error al confirmar tu cuenta',
            message: 'Intentalo nuevamente o contáctate con nuestro soporte técnico',
            error: true
        })
    }
    //Confirmar la cuenta
    user.token = null
    user.confirm = true
    await user.save()
    res.render('auth/confirm-account', {
        page: 'Cuenta existosamente confirmada',
        message: 'Su cuenta fue confirmada correctamente'
    })
}
const formForgetPassword = (req, res) => {
    res.render('auth/forget-password', {
        page: 'Recupera tu cuenta'
    })
}

export {
    formLogin,
    formSignup,
    signup,
    confirm,
    formForgetPassword
}