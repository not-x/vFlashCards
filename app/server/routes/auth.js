const router = require("express").Router();
const pool = require("../db");

router.post("/signup", async (req, res) => {
    try {
        let temp = req.body;
        // const { firstName, lastName, email, password } = req.body;
        const { firstName, lastName, email, password } = temp;
        console.log(temp);
        const newLogin = await pool.query(
            "INSERT INTO vfc_user (vfc_user_fname, vfc_user_lname, vfc_user_email, vfc_user_password) VALUES ($1, $2, $3, $4)",
            [firstName, lastName, email, password]);
     
        res.json(req.body);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("500 - Error");
    }
});

module.exports = router;