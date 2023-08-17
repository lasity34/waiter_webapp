import bcrypt from bcrypt



export default function adminModel(db) {
    
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


        return {
            getAdminByUsername,
            
        }


}








//     async verifyPassword(password, hash) {
//       return new Promise((resolve, reject) => {
//         bcrypt.compare(password, hash, function(err, result) {
//           if (err) reject(err);
//           resolve(result);
//         });
//       });
//     }
//   };
// }
