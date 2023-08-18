export default function admin_route(admin_service, waiter_service) {
  async function add(req, res) {
    try {
      const { username, password } = req.body;
      const admin = await admin_service.getAdminByUsername(username);

      if (admin) {
        const isPasswordCorrect = await admin_service.verifyPassword(
          password,
          admin.password
        );

        if (isPasswordCorrect) {
          res.redirect(`/admin/${username}`);
        } else {
          res.status(401).send("Invalid password");
        }
      } else {
        res.status(404).send("Admin not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
  }

  async function show(req, res) {
    const username = req.params.username;
    const waiters = await admin_service.listWaiters();
    const shifts = await admin_service.getShifts()
    res.render("admin", { username, waiters, shifts });
  }

  async function updateWaiter(req, res) {
    try {
      const { waiterId, name, status } = req.body;
      const updatedWaiter = await waiter_service.updateWaiter(
        waiterId,
        name,
        status
      );

      if (updatedWaiter) {
        res.status(200).send("Waiter updated successfully");
      } else {
        res.status(404).send("Waiter not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
  }

  async function createUser(req, res) {
    try {
      const { username, password } = req.body;
      const existingUser = await admin_service.getAdminByUsername(username);

      if (existingUser) {
        // If the user already exists, render the admin page with a message
        const waiters = await admin_service.listWaiters();
        res.render("admin", {
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

  async function listWaiters(req, res) {
    try {
      const waiters = await admin_service.listWaiters();
      res.render("waiters", { waiters });
    } catch (error) {
      console.error(error);
      res.status(500).render("error", { message: "An error occurred" });
    }
  }

  async function deleteUser(req, res) {
    try {
      const { username } = req.body;
      const adminUsername = req.params.username;
      const deleted = await admin_service.deleteUser(username);

      if (deleted) {
        res.redirect(`/admin/${adminUsername}`);
      } else {
        res.status(400).render("error", { message: "Failed to delete user" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).render("error", { message: "An error occurred" });
    }
  }

  return {
    add,
    show,
    updateWaiter,
    createUser,
    listWaiters,
    deleteUser,
  };
}
