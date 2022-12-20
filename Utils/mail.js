import nodemailer from "nodemailer"
import Handlebars from 'handlebars';
import path from "path";
import fs from "fs"

// {to,subject,text,html}
export const sendMail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_AUTHORIZATION_USER,
                pass: process.env.EMAIL_AUTHORIZATION_PASSWORD
            }
        })
        await transporter.sendMail(await options)

    } catch (err) {
        console.log(err)
    }
}

export const emailVerificationMessage = async ({ link, email, username }) => {
    const templateSource = fs.readFileSync(
        path.join(__dirname, '/templates/verifyEmail.hbs'),
        'utf8',
    );

    const template = Handlebars.compile(templateSource)

    return {
        from: "Miko",
        to: await email,
        subject: "Email verification",
        text: "verify your email to get started",
        html: template({ username, link })
    }
}


export const forgotPasswordMail = async ({ link, email }) => {
    const templateSource = fs.readFileSync(
        path.join(__dirname, "/templates/forgotPassword.hbs"),
        "utf-8"
    )

    const template = Handlebars.compile(templateSource)
    return {
        from: "Miko",
        to: await email,
        subject: "Rest password",
        text: "let's get you back on track",
        html: template({ link })
    }
}