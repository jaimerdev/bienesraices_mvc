import nodemailer from 'nodemailer'

const emailRegister = async(data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const {name, email, token} = data

    //Enviar el email
    await transport.sendMail({
        from: 'bienesraices.com ',
        to: email,
        sunject: 'Confirma tu cuenta de BienesRaices',
        text: 'Confirma tu cuenta de BienesRaices',
        html: `
            <p>Hola ${name}, verifica tu cuenta para acceder a todos los beneficios que ofrece BienesRaices</p>
            <p>Dale click al enlace para activar tu cuenta: <a href='${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}'>Corfirmar cuenta</a></p>
            <p>Si no creaste esta cuenta, por favor ignora el mensaje</p>
        `
    })
}
export {
    emailRegister
}