
export default function home_route() {

    
    function show(req, res) {
        res.render("login")
    }

    return {
        show
    }

}


