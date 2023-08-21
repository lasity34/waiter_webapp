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
    res.render('login', { error: 'Invalid credentials' });
  }

  return {
    login,
  };
}
