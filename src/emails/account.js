const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendNotoficationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vitali.sakalou@gmail.com',
        subject: 'Thanks for your message!',
        text: `${name}, Thank you for your opinion.`,
    });
    sgMail.send({
        to: 'vitali.sakalou@gmail.com',
        from: 'vitali.sakalou@gmail.com',
        subject: 'New review',
        text: `Yuo have new review from ${name}`,
    });
};

module.exports = {
    sendNotoficationEmail,
};
