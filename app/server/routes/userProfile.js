const express = require('express');
const router = express.Router();
const auth = require('../auth');
const db = require('../db');
const pool = require("../db");
const verifySetAccess = require('../verifySetAccess');
const { verify } = require('jsonwebtoken');

// Get public flashcard sets
router.get('/pub_lib', auth, async (req, res) => {
    try {
        // const vfcPublicLib = await pool.query(
        //     "SELECT vfc_set_title FROM vfc_set WHERE vfc_set_view_access = 'public'");

        const vfcPublicLib = await pool.query(
            "SELECT u.vfc_user_fname, u.vfc_user_lname, s.vfc_set_title, s.vfc_set_access, s.vfc_set_id FROM vfc_user AS u LEFT JOIN vfc_set AS s ON u.vfc_user_id = s.vfc_user_id WHERE s.vfc_set_access = 'public'"
        );
        pubLib = vfcPublicLib.rows;
        // console.log(pubLib);
        console.log(vfcPublicLib);
        if (pubLib === undefined) {
            console.log("Public library is currently empty.");
            res.send("Public library is currently empty.");
        } else {
            console.log(pubLib);
            res.send(pubLib);
            // res.json(pubLib);
        }
    } catch (err) {
        console.log("Error - " + err);
        res.send("Error - " + err);
    }
});

// Get private flashcard sets for vfc_user
router.get('/lib', auth, async (req, res) => {
    try {
        console.log("Private library route:");
        userID = req.user;
        console.log(`UserID: ${userID}`);
        const vfcPrivateLib = await pool.query(
            "SELECT s.vfc_set_id, s.vfc_set_title, s.vfc_set_access FROM vfc_user AS u INNER JOIN vfc_set AS s ON u.vfc_user_id = s.vfc_user_id WHERE u.vfc_user_id = $1", [userID]
        );
        privLib = vfcPrivateLib.rows;
        // console.log("vfcPrivateLib: " + vfcPrivateLib);
        // Message for an empty private lib
        if (privLib === undefined) {
            console.log("Personal library is currently empty.");
            res.send("Personal library is currently empty.");
        } else {
            // console.log("Current library: " + JSON.stringify(privLib));
            console.log(typeof (privLib))
            res.send(privLib);
            // res.json(privLib);
        }
    } catch (err) {
        console.log("Error - " + err);
        res.send("Error" + err);
    }
});

// Get cards from a personal/private vfc_set
router.get("/lib/:vfcSetID", auth, async (req, res) => {
    const userID = req.user;
    console.log("Get card route (private:");
    try {
        const { vfcSetID } = req.params;
        console.log(vfcSetID);
        const verifyPermission = await pool.query(
            "SELECT * from vfc_set WHERE vfc_user_id = $1 AND vfc_set_id = $2", [userID, vfcSetID]
        );

        if (verifyPermission.rows.length === 0) throw "403 - Forbidden";

        const getCards = await pool.query(
            "SELECT s.vfc_set_title, c.vfc_id, c.vfc_question, c.vfc_answer FROM vfc AS c INNER JOIN vfc_set AS s ON c.vfc_set_id = s.vfc_set_id WHERE c.vfc_set_id = $1 AND s.vfc_user_id = $2",
            [vfcSetID, userID]
            // "SELECT * FROM vfc WHERE vfc_set_id = $1", [vfcSetID]
        );
        // console.log(getCards);
        if (getCards.rows.length === 0) {
            console.log("No cards found");
            res.json("No cards found.");
        } else {
            console.log("No error found");
            // console.log(JSON.stringify(getCards));
            console.log(getCards.rows);
            res.json(getCards.rows);
        }
    } catch (err) {
        console.log("Error - " + err);
        res.json("Error - " + err);
    }

});

// Get cards from a public vfc_set
router.get("/pub_lib/:vfcSetID", auth, async (req, res) => {
    try {
        const userID = req.user;
        const { vfcSetID } = req.params
        // console.log("set id: " + vfcSetID);
        console.log(userID);

        const verifyAccess = await pool.query(
            "SELECT * FROM vfc_set WHERE vfc_set_id = $1 AND vfc_set_access = 'public'", [vfcSetID]
        );

        if (verifyAccess.rows.length === 0) throw "403 - Forbidden";

        const vfcList = await pool.query(
            "SELECT s.vfc_set_title, c.vfc_id, c.vfc_question, c.vfc_answer FROM vfc_set AS s LEFT JOIN vfc AS c ON s.vfc_set_id = c.vfc_set_id WHERE s.vfc_set_access = 'public' AND c.vfc_set_id = $1", [vfcSetID]
        );

        if (vfcList.rows.length === 0) {
            console.log("Card set is empty.");
            res.json("Card set is empty.");
        } else {
            console.log(vfcList.rows);
            res.json(vfcList.rows)
        }
    } catch (err) {
        console.log(`Error - ${err}`);
        res.json(`Error - ${err}`);
    }

});

// Create new vfc_set
router.post("/new_set/", auth, async (req, res) => {
    try {
        const userID = req.user;
        const { title, access } = req.body;
        if (title === undefined) throw "Missing title";
        if (access === undefined) throw "Missing access type. (public/private)"
        // const findDuplicateTitle = await pool.query(
        //     "SELECT vfc_set_title FROM vfc_set WHERE vfc_set_title = $1", [title]
        // );
        const findDuplicateTitle = await pool.query(
            "SELECT vfc_set_title FROM vfc_set WHERE vfc_user_id = $1 AND vfc_set_title = $2", [userID, title]
        );
        console.log("findDuplicateTitle: " + JSON.stringify(findDuplicateTitle.rows));
        console.log("findDuplicateTitle length: " + findDuplicateTitle.rows.length);
        // console.log("findDuplicateTitle: " + findDuplicateTitle.rows[0]);
        if (findDuplicateTitle.rows.length !== 0) throw "Duplicate title. Please try another.";

        const newSet = await pool.query(
            "INSERT INTO vfc_set (vfc_user_id, vfc_set_title, vfc_set_access) VALUES ($1, $2, $3) RETURNING *",
            [userID, title, access]
        );
        const newSetID = newSet.rows[0].vfc_set_id
        console.log(newSet.rows[0].vfc_set_id);
        console.log("New vflashcard set added: " + newSetID);
        res.send("New vflashcard set added: " + newSetID);
    } catch (err) {
        console.log("Error: " + err);
        res.send("Error: " + err);
    }

});
// Create a new card for a vfc_set
router.post("/lib/:vfcSetID", auth, async (req, res) => {
    try {
        console.log("[Route - Create new card]");
        const { vfcSetID } = req.params;
        const userID = req.user;
        const { question, answer } = req.body;
        if (question === undefined || answer === undefined) throw "Error - No input for question or answer."

        const verifyPermission = await pool.query(
            "SELECT * FROM vfc_set WHERE vfc_set_id = $1 AND vfc_user_id = $2", [vfcSetID, userID]
        );
        console.log(verifyPermission.rows);
        if (verifyPermission.rows.length === 0) throw "403 - Forbidden"

        const createNewCard = await pool.query(
            "INSERT INTO vfc (vfc_set_id, vfc_question, vfc_answer) VALUES ($1, $2, $3) RETURNING *", [vfcSetID, question, answer]
        );

        if (createNewCard.rows.length === 0) throw "403 - Forbidden"

        const result = "New card added.";
        console.log(result);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.send(error);
    }
});

// Update a vfc_set's title and access type(private/public)
router.put("/lib/:vfcSetID", auth, async (req, res) => {
    try {
        console.log("[Route - Update card set]");
        if (req.body.title === undefined && req.body.access === undefined) throw "Missing arguments. Please retry."

        const userID = req.user;
        const { vfcSetID } = req.params;
        const { title, access } = req.body;

        if (title && access) {
            console.log("2 parameters");
            const accessVerified = verifySetAccess(access);
            console.log(accessVerified);
            const updateCardSet = await pool.query(
                "UPDATE vfc_set SET vfc_set_title = $1, vfc_set_access = $2 WHERE vfc_set_id = $3 AND vfc_user_id = $4 RETURNING *",
                [title, accessVerified, vfcSetID, userID]
            );
            console.log(JSON.stringify(updateCardSet));
            if (updateCardSet.rows.length === 0) throw "403 - Forbidden"

        } else if (title === undefined && access !== undefined) {
            console.log("access type only");
            const accessVerified = verifySetAccess(access);
            const updateCardSet = await pool.query(
                "UPDATE vfc_set SET vfc_set_access = $1 WHERE vfc_set_id = $2 AND vfc_user_id = $3 RETURNING *",
                [accessVerified, vfcSetID, userID]
            );
            console.log(JSON.stringify(updateCardSet));
            if (updateCardSet.rows.length === 0) throw "403 - Forbidden"
        } else if (title !== undefined && access === undefined) {
            console.log("title only");

            const updateCardSet = await pool.query(
                "UPDATE vfc_set SET vfc_set_title = $1 WHERE vfc_set_id = $2 AND vfc_user_id = $3 RETURNING *",
                [title, vfcSetID, userID]

            );
            // console.log(updateCardSet.rows.length);
            if (CardSet.rows.length === 0) throw "403 - Forbidden"
            // console.log("End title only");

        }
        // const getAccess = (req.body.access !== undefined) ? (req.body.access).toLowerCase() : undefined
        // const argLength = getAccess.length;
        // console.log(`access: ${getAccess}`);
        // if (getAccess !== undefined || argLength < 6 || argLength > 7 || (argLength === 7 && getAccess !== "private") || (argLength === 6 && getAccess !== "public")) {
        //     console.log("Invalid access type");
        //     throw "Invalid access type.";
        // }

        // console.log("access arg = ok!");

        // const userID = req.user;
        // const { vfcSetID } = req.params;
        // console.log(vfcSetID);
        // test result from SQL query
        // const result = await pool.query("SELET vfc_set_access from vfc_set WHERE vfc_set_id = $1 AND vfc_user = $2", vfcSetID, userID); 
        // const result = await pool.query("SELET vfc_set_access from vfc_set WHERE vfc_set_id = $1", vfcSetID);

        // console.log("Result: " + result);

        // const access = (
        //     req.body.access !== undefined ? req.body.access : await pool.query("SELET vfc_set_access from vfc_set WHERE vfc_set_id = $1 AND vfc_user = $2", vfcSetID, userID));
        // const title = (
        //     req.body.title !== undefined ? req.body.title :
        //         await pool.query("SELECT vfc_set_title FROM vfc_set WHERE vfc_set_id = $1 AND vfc_user = $2", vfcSetID, userID));

        // const { title, access } = req.body;
        // console.log("userid: " + userID);
        // console.log("vfc ID: " + vfcSetID);

        // const updateCardSet = await pool.query(
        //     "UPDATE vfc_set SET vfc_set_title = $1, vfc_set_access = $2 WHERE vfc_set_id = vfcSetID = $3 AND vfc_user_id = $4",
        //     [title, access, vfcSetID, userID]
        // );

        // if (title && access) {
        //     console.log("2 parameters");
        //     const updateCardSet = await pool.query(
        //         "UPDATE vfc_set SET vfc_set_title = $1, vfc_set_access = $2 WHERE vfc_set_id = vfcSetID = $3 AND vfc_user_id = $4",
        //         [title, access, vfcSetID, userID]
        //     );
        // } else if (title === undefined && access !== undefined) {
        //     console.log("access type only");
        //     const updateCardSet = await pool.query(
        //         "UPDATE vfc_set SET vfc_set_access = $1 WHERE vfc_set_id = $2 AND vfc_set_id = $3",
        //         [access, vfcSetID, userID]
        //     );
        // } else if (title !== undefined && access === undefined) {
        //     console.log("title only");
        //     const updateCardSet = await pool.query(
        //         "UPDATE vfc_set SET vfc_set_title = $1 WHERE vfc_set_id = $2 AND vfc_set_id = $3",
        //         [title, vfcSetID, userID]

        //     );
        //     console.log("End title only");
        //     console.log(updateCardSet);
        // } else {
        //     console.log("Missing 2 parameters");
        //     console.log(`Parameters: ${vfcSetID}, ${title}, ${access}`, vfcSetID, title, access);
        //     throw "400 - Bad Request"
        // }

        // console.log(updateCardSet);
        // if (updateCardSet.rows.length === 0) throw "403 - Forbidden"
        const result = "vFlashCard set has been successfully updated.";
        console.log(result);
        res.json(result);
    } catch (err) {
        console.error("Error - " + err);
        res.send("Error - " + err);
    }

});

// Update a vfc from a set
router.put("/lib/:vfcSetID/card/", auth, async (req, res) => {
    try {
        const userID = req.user;
        const { vfcSetID } = req.params;
        const { vfcID, question, answer } = req.body;

        if (vfcID === undefined) throw "vFlashCard ID not provided. Please retry."
        if (question === undefined && answer === undefined) throw "Missing information."

        const verifyAccess = await pool.query(
            "SELECT * FROM vfc_set WHERE vfc_user_id = $1 AND vfc_set_id = $2", [userID, vfcSetID]
        );

        console.log(verifyAccess.rows.length);

        if (verifyAccess.rows.length === 0) throw "403 - Forbidden";

        console.log("Matching user + setID");

        const verifyCard = await pool.query(
            "SELECT * FROM vfc WHERE vfc_set_id = $1 AND vfc_id = $2",
            [vfcSetID, vfcID]
        );
        if (verifyCard.rows.length === 0) throw "404 - Not found."

        console.log("Access OK - Will Update...");

        if (question && answer) {
            console.log("question + answer");
            const updateCardSet = await pool.query(
                "UPDATE vfc SET vfc_question = $1, vfc_answer = $2 WHERE vfc_id = $3 RETURNING *",
                [question, answer, vfcID]
            );
            // console.log(JSON.stringify(updateCardSet));
            if (updateCardSet.rows.length === 0) throw "403 - Forbidden"
        } else if (question !== undefined && answer === undefined) {
            console.log("question only");
            const updateCardSet = await pool.query(
                "UPDATE vfc SET vfc_question = $1 WHERE vfc_id = $2 RETURNING *",
                [question, vfcID]
            );
        } else if (question === undefined && answer !== undefined) {
            console.log("answer only");
            const updateCardSet = await pool.query(
                "UPDATE vfc SET vfc_answer = $1 WHERE vfc_id = $2 RETURNING *",
                [answer, vfcID]
            );
        }
        const result = "Card successfully updated.";
        console.log(result);
        res.json(result);
    } catch (err) {
        console.error("Error - " + err);
        res.send("Error - " + err);
    }
})

// Delete vfc_set
router.delete("/lib/:vfcSetID", auth, async (req, res) => {
    try {

        const userID = req.user;
        const { vfcSetID } = req.params;
        console.log("Delete private card set:");
        // console.log(vfcSetID);

        // [Query test] - Delete query was not working properly:
        // const vfcPrivateLib = await pool.query(
        //     "SELECT s.vfc_set_id, s.vfc_set_title FROM vfc_user AS u INNER JOIN vfc_set AS s ON u.vfc_user_id = s.vfc_user_id WHERE u.vfc_user_id = $1", [userID]
        // );
        // console.log("Get library test: " + JSON.stringify(vfcPrivateLib.rows));
        // // [END query test]

        // Delete query
        const deleteCardSet = await pool.query(
            "DELETE FROM vfc_set WHERE vfc_user_id = $1 AND vfc_set_id = $2 RETURNING *",
            [userID, vfcSetID]
        );
        console.log(deleteCardSet.rows);
        if (deleteCardSet.rows.length === 0) throw "403 - Forbidden";

        console.log("vFlashCard set has been deleted.");
        res.json("vFlashCard set has been deleted.");
    } catch (err) {
        console.log("Error - " + err);
        res.send("Error - " + err);
    }
});

// Delete a vfc from a set
router.delete("/lib/:vfcSetID/:vfc_id", auth, async (req, res) => {
    try {
        console.log("[Route - delete existing card");

        const userID = req.user;
        const { vfcSetID, vfc_id } = req.params;

        const verifyAccess = await pool.query(
            "SELECT * FROM vfc_set WHERE vfc_user_id = $1 AND vfc_set_id = $2", [userID, vfcSetID]
        );
        // console.log(verifyAccess)

        if (verifyAccess.rows.length === 0) throw "403 - Forbidden";

        console.log("Access OK - Will DELETE card");
        const deleteCard = await pool.query(
            "DELETE FROM vfc WHERE vfc_set_id = $1 AND vfc_id = $2 RETURNING *", [vfcSetID, vfc_id]
        );
        console.log(deleteCard.rows);
        if (deleteCard.rows.length === 0) throw "403 - Forbidden";

        const result = "Card delete successfully.";
        console.log(result);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.json(err);
    }

})



module.exports = router;