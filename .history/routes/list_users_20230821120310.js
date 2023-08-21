


export default function list_users(admin_service) {

  async function listWaiters(req, res) {
    try {
      const waiters = await admin_service.listWaiters();
      const username = req.params.username; // Fetch the username from the URL parameters
  
      if (username) {
        res.render("list-users", { waiters, username });
      } else {
        // Handle the case where the username is not found in the URL
        res.status(404).render("error", { message: "Username not found" });
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