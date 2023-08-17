


export default function admin_route(admin_service) {



    async function add(req, res) {
        try {
            const {username, password} = req.body;
            const admin = await admin_service.getAdminByUsername(username)


            if (admin) {
                const isPasswordCorrect = await admin_service.verifyPassword(password, admin.password)

                if (isPasswordCorrect) {
                    redirect(`admin/${username}`)
                }

            } else {
                
            }
            
        }

       
        
        catch {

        }




    }


    return {
        add
    }

}