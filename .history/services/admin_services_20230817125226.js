import bcrypt from 'bcrypt'



export default function adminService(db) {
    
        async function getAdminByUsername(username) {
            return await db.oneOrNone('SELECT * FROM waiters_schedule.admins WHERE username = $1', [username])
        }


        async function verifyPassword(password, hash) {
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, hash, function(err, result) {
                    if (err) reject(err);
                    resolve(result)
                })
            })
        }

        async function createUser(username, password) {

            const existingUser = await db.oneOrNone('SELECT * FROM waiters WHERE username = $1', [username]);

            if (existingUser) {
              throw new Error('User with this username already exists');
            }
          

            const hashedPassword = await bcrypt.hash(password, 10);
            return await db.oneOrNone(
              `INSERT INTO waiters (username, password)
               VALUES ($1, $2)
               RETURNING *;`,
              [username, hashedPassword]
            );
          }
          
        

          async function listWaiters() {
            return await db.any('SELECT username FROM waiters');
          }

          async function deleteUser(username) {
            return await db.result('DELETE FROM waiters WHERE username = $1', [username])
              .then(result => result.rowCount > 0)
              .catch(error => {
                console.error(error);
                return false;
              });
          }

          async function verifyCredentials(username, password) {
            const admin = await getAdminByUsername(username);
            if (admin) {
              const isPasswordValid = await verifyPassword(password, admin.password);
              if (isPasswordValid) {
                return admin;
              }
            }
            return null;
          }



        return {
            getAdminByUsername,
            verifyPassword,
            createUser,
            listWaiters,
            deleteUser
        }


}







