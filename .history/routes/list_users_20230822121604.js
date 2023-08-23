


export default function list_users(admin_service) {
  async function listWaiters(req, res) {
    try {
      const waiters = await admin_service.listWaiters();
      const username = req.session.adminUsername;
      const notification = req.session.notification;
  
      // Clear the notification from the session
      delete req.session.notification;
  
      res.render("list-users", { waiters, username, notification });
    } catch (error) {
      console.error(error);
      res.status(500).render("error", { message: "An error occurred" });
    }
  }
  
  
  


      return {
        listWaiters
      }

}