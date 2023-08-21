

export default function create_user_route(admin_service) {


    async function showCreateUserPage(req, res) {
        try {
          // You can retrieve any necessary data here, if needed
          res.render("user"); // Render the view for creating a user
        } catch (error) {
          console.error(error);
          res.status(500).render("error", { message: "An error occurred" });
        }
      }


    async function createUser(req, res) {
        try {
          const { username, password } = req.body;
          const existingUser = await admin_service.getAdminByUsername(username);
    
          if (existingUser) {
            // If the user already exists, render the admin page with a message
            const waiters = await admin_service.listWaiters();
            res.render("user", {
              username,
              waiters,
              message: "User with this username already exists",
            });
          } else {
            const newUser = await admin_service.createUser(username, password);
            res.redirect(`/admin/${username}`);
          }
        } catch (error) {
          console.error(error);
          const waiters = await admin_service.listWaiters();
          res.render("admin", {
            message: "User with this username already exists",
            waiters,
          });
        }
      }


      return {
        createUser,
        showCreateUserPage
      }


}