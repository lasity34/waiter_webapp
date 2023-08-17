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
            res.status(401).send('Invalid password');
        }
      } else {
        res.status(404).send('Admin not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  }


  async function show(req, res) {
    const username = req.params.username;
    res.render('admin', { username });
  }

  async function updateWaiter(req, res) {

    try {
      const { waiterId, name, status} = req.body;
      const updatedWaiter = await waiter_service.updateWaiter(waiterId, name, status);

   
      if (updatedWaiter) {
        res.status(200).send('Waiter updated successfully');
      } else {
        res.status(404).send('Waiter not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  }

  async function createUser(req, res) {
    try {
      const { username, password } = req.body;
      const newUser = await admin_service.createUser(username, password);
  
      if (newUser) {
        res.redirect(`/admin/${username}`); 
      } else {
        res.status(400).render('error', { message: 'Failed to create user' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).render('error', { message: 'An error occurred' });
    }
  }
  
  async function listWaiters(req, res) {
    try {
      const waiters = await admin_service.listWaiters();
      res.render('waiters', { waiters }); // Render a view with the waiters
    } catch (error) {
      console.error(error);
      res.status(500).render('error', { message: 'An error occurred' });
    }
  
  

  return {
    add,
    show,
    updateWaiter,
    createUser,
    listWaiters
  };
}
