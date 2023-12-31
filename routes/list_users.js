


export default function list_users(admin_service) {
  async function listWaiters(req, res) {
    try {
      const waiters = await admin_service.listWaiters();
   
      res.render("list-users", { waiters, username: req.session.adminUsername });
    } catch (error) {
      console.error(error);
      req.session.notification = "An error occurred while listing users";
      res.redirect('/admin'); // Redirect to the admin page with the error notification
      req.session.notification = null
    }
  }
  
  


      return {
        listWaiters
      }

}