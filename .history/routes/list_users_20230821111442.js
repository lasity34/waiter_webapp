


export default function list_users(admin_service) {

    async function listWaiters(req, res) {
        try {
          const waiters = await admin_service.listWaiters();
          res.render("list-users", { waiters });
        } catch (error) {
          console.error(error);
          res.status(500).render("error", { message: "An error occurred" });
        }
      }


      return {
        listWaiters
      }

}