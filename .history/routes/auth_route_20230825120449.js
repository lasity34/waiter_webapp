export default function authRoute(adminService, waiterService) {
  async function login(req, res) {
    const { username, password } = req.body;

    // Verify credentials in the admin table
    const admin = await adminService.verifyCredentials(username, password);
    if (admin) {
      req.session.adminUsername = username;
      
      return res.redirect(`/admin/${username}`);
    }

    // Verify credentials in the waiters table
    const waiter = await waiterService.verifyCredentials(username, password);
    if (waiter) {
      return res.redirect(`/waiters/${username}`);
    }

    // Render the login page with an error message if credentials are not valid
    const notification = req.session.notification
    res.render('login', { notification });
  }


  async function logout(req, res) {
    // Destroy the session
    req.session.destroy(err => {
      if (err) {
        return res.redirect('/error'); // Redirect to error page if something goes wrong
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.redirect('/'); // Redirect to home or login page
    });
  }

  return {
    login,
    logout
  };
}
