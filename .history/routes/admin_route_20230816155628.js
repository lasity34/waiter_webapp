export default function admin_route(admin_service) {
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
          
          redirect(`admin/${username}`);
        } else {
            res.status(401).send('Invalid password');
        }
      } else {
        res.status(404).send('Admin not found');
      }
    } catch {

    }
  }

  return {
    add,
  };
}
