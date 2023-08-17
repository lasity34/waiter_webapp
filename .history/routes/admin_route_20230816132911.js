import bcrypt from bcrypt


export default function admin_route() {



    function add(req, res) {
        const {username, password} = req.body;
        if (username === "lyla" && password === "lyla123") {
            res.redirect(`/admin/${username}`)
        } else {
            res.status(401).send("Access denied")
        }


    }


    return {
        add
    }

}