import bcrypt from 'bcrypt'



export default function adminService(db) {
    
        async function getAdminByUsername(username) {
            return await db.oneOrNone('SELECT * FROM public.admins WHERE username = $1', [username])
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

          async function getShifts() {
            return await db.any('SELECT day, time_slot, username FROM waiters_schedule');
          }

          async function deleteWaiterSchedule(username) {
            await db.none('DELETE FROM waiters_schedule WHERE username = $1', [username]);
          }

          async function insertAdmin(username, passwordHash) {
            return await db.none('INSERT INTO public.admins (username, password) VALUES ($1, $2)', [username, passwordHash]);
        }
        
        async function updatePassword(username, newPasswordHash) {
          try {
            await db.none('UPDATE public.admins SET password = $2 WHERE username = $1', [username, newPasswordHash]);
            return { success: true, message: 'Password updated successfully.' };
          } catch (error) {
            return { success: false, message: error.message };
          }
        }
        
        async function deleteAdmin(username) {
          try {
            await db.none('DELETE FROM public.admins WHERE username = $1', [username]);
            return { success: true, message: 'Admin deleted successfully.' };
          } catch (error) {
            return { success: false, message: error.message };
          }
        }
        



        return {
            getShifts,
            getAdminByUsername,
            verifyPassword,
            createUser,
            listWaiters,
            deleteUser,
            verifyCredentials,
            deleteWaiterSchedule,
            insertAdmin,
            updatePassword,
            deleteAdmin
        }


}







