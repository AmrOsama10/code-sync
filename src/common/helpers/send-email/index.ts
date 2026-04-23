import nodemailer from 'nodemailer';

export const sendEmail = async (mailOptions: nodemailer.SendMailOptions) => {

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    return await transporter.sendMail(mailOptions);
};