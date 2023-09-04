import sgMail from '@sendgrid/mail';
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

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  async function sendEmail(email, password) {
    const msg = {
      to: email, // Receiver's email
      from: 'your-email@example.com', // Sender's email
      subject: 'Your password', // Subject line
      text: `Your initial password is: ${password}`, // Plain text body
    };
  
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);
  
      if (error.response) {
        console.error(error.response.body);
      }
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