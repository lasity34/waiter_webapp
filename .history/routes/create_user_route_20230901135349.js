import nodemailer from "nodemailer";
import dotenv from "dotenv";


export default function create_user_route(admin_service) {

  dotenv.config();

  async function showCreateUserPage(req, res) {
    try {
      // Assuming admin username is stored in session as 'adminUsername'
      res.render("created_user", { username: req.session.adminUsername });
    } catch (error) {
      console.error(error);
      res.status(500).render("error", { message: "An error occurred" });
    }
  }


  async function sendEmail(email, password) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    // setup email data
    let mailOptions = {
      from: '"waiters_web_app" <bjornworrall@gmail.com>', // sender address
      to: email, // receiver's email
      subject: "Your Account Password", // Subject line
      text: `Your password is: ${password}`, // plaintext body
    };
  
    // send mail with defined transport object
    await transporter.sendMail(mailOptions);
  }
  

  
    
    async function createUser(req, res) {
        try {
          let { username, password, email } = req.body;

          const existingUser = await admin_service.getAdminByUsername(username);
       
          if (existingUser) {
            // If the user already exists, render the admin page with a message
            const waiters = await admin_service.listWaiters();
            res.render("created_user", {
              username,
              waiters,
              notification: "User with this username already exists",
            });
          } else {
            const newUser = await admin_service.createUser(username, password);
            await sendEmail(email, password);
            req.session.notification = "User Successfully created"
            res.redirect(`/admin/${username}`);
            req.session.notification = null
          }
        }catch (error) {
          if (error.message === 'User with this username already exists') {
            // Handle this specific error
            res.render("created_user", {
              notification: error.message,
         
            });
          } else {
            // Handle other errors
            console.error(error);
            res.status(500).render("error", { message: "An error occurred" });
          }
        }
      }

     
 


      return {
        createUser,
        showCreateUserPage,
        sendEmail
      }


}