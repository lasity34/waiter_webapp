

export default function create_user_route(admin_service) {


    async function showCreateUserPage(req, res) {
        try {
          res.render("created_user");
        } catch (error) {
          console.error(error);
          res.status(500).render("error", { message: "An error occurred" });
        }
      }
      
    

    async function createUser(req, res) {
        try {
          let { username, password } = req.body;

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
            res.redirect(`/admin/${username}`);
            req.session.notification = "User Successfully created"

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
        showCreateUserPage
      }


}