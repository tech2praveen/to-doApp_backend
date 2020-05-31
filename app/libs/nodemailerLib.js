'use strict';
const nodemailer = require('nodemailer');



let sendMail =  (mailDetails) =>{
    
nodemailer.createTestAccount((err, account) => {
    
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
        auth: {
            user: 'tech2praveen.todo@gmail.com', 
            pass: 'hdbxlucbrplhzife' //Using hash password of app added in gmail
        }
    });
    
    console.log('created');

    let mailOptions = {
        from: '"To-Do App" <tech2praveen.todo@gmail.com>', // sender address
        to: mailDetails.receiver, // list of receivers
        subject: mailDetails.subject, // Subject line
        // text: mailDetails.text, // plain text body
        html: mailDetails.html // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return false;
        }
        else
        {
            return true;
        }
       

    });
    

});



}


module.exports = {
    sendMail:sendMail
}