const User = require("../models/Users");

async function getUserById(req, res) {
    const { user_id } = req.query;

    try {
        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(401).json({ error: "User Not Found" });
        }

        res.json({ user });
    } catch (error) {
        console.error("Error getting user by id in user controller: " + error);
        res.status(500).json({ error: "User Not Found" });
    }
}

module.exports = { getUserById };
