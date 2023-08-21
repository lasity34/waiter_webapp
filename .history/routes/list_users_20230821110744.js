


export default function list_users() {

    async function listWaiters(req, res) {
        try {
          const waiters = await admin_service.listWaiters();
          res.render("waiters", { waiters });
        } catch (error) {
          console.error(error);
          res.status(500).render("error", { message: "An error occurred" });
        }
      }


      return {
        listWaiters
      }

}