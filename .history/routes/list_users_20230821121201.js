


export default function list_users(admin_service) {
  async function listWaiters(req, res) {
    try {
      const waiters = await admin_service.listWaiters();
      const username = req.session.adminUsername; 
  
      if (username) {
        res.render("list-users", { waiters, username });
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