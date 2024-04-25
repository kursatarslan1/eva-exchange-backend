const { User } = require("../models/users_model");


async function login(req, res){
    const { email, password } = req.body;

    try{
        const user = await User.login(email, password);

        if(!user){
            return res.status(401).json({ error: "User Not Found" });
        }

        res.json({ user });
    } catch (error){
        console.error("Login error: " + error);
        res.status(500).json({ error: "Login unsuccessful" });
    }
}

module.exports = { login };