


export default function admin_route(admin_service) {



    async function add(req, res) {
        const {username, password} = req.body;
        const admin = await admin_service.getAdminByUsername(username)



    }


    return {
        add
    }

}