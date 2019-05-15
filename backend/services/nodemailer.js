// const nodemailer = require("nodemailer");

// const handleSendMail = ({name, username, password, primary_user}) => {
//     const output =`
//                  <p>Hi ${name},</p>
//                  <br>
//                  <p>Welcome to Family Life! You were added to Family Life by ${primary_user.name}. </p> 
//                  <br>                 
//                  <p>To login, please visit <a>www.familylife.netlify.com/login</a></p>
//                  <br>
//                  <p>Here is your login credentials:</p>
//                  <ul>
//                  <li>Username: ${username}</li>
//                  <li>Password: ${password}</li>
//                  <li>Account Type: other</li>
//                  </ul>
//                  <br>
//                   Thanks!
//                  <br>
//                  Famliy Life
//                  ` 
//                 let transporter = nodemailer.createTransport({
//                     service: 'gmail',
//                     auth: {
//                       user: 'familylifeorganizer@gmail.com',
//                       pass: 'familylife123'
//                     }
//                   });                  
//                 let mailOptions = {
//                     from: 'Family Life <familylifeorganizer@gmail.com>',
//                     to: `${email}`,
//                     subject: 'Family Life Membership',
//                     html: output
//                   };
                  
//                   transporter.sendMail(mailOptions, function(error, info){
//                     if (error) {
//                       console.log(error);
//                     } else {
//                       console.log('Email sent: ' + info.response);
//                     }
//                   });
// }

// module.exports = {
//     handleSendMail
// }