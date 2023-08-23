


export default function list_users(admin_service) {
  async function listWaiters(req, res) {
    try {
      const waiters = await admin_service.listWaiters();
      const username = req.session.adminUsername;
      const notification = req.session.notification; // Retrieve the notification from the session
  
      // Clear the notification from the session so it doesn't show again on the next page load
      delete req.session.notification;
  
      if (username) {
        res.render("list-users", { waiters, username, notification }); // Pass the notification to the template
      } else {
        res.status(404).send("Username not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).render("error", { message: "An error occurred" });
    }
  }
  
  
  


      return {
        listWaiters
      }

}