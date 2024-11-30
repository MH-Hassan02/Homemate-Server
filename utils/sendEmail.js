import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'alixyedxameel@gmail.com',
        pass: 'krwn kiyc pwwg qvbw'
    }
});


// Function to send verification email
const sendEmail = (email, link) => {
    const mailOptions = {
        from: 'alixyedxameel@gmail.com',
        to: email,
        subject: 'Verify your email',
        html: `<p>Please verify your email by clicking <a href="${link}">here</a></p>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

export default sendEmail; // Default export
