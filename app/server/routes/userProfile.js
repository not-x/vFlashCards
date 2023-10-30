const express = require('express');
const router = express.Router();
const auth = require('../auth');
const db = require('../db');
const pool = require("../db");

// Get public flashcard sets
router.get('/pub_lib', auth, async (req, res) => {
    try {
        // const vfcPublicLib = await pool.query(
        //     "SELECT vfc_set_title FROM vfc_set WHERE vfc_set_view_access = 'public'");

        const vfcPublicLib = await pool.query(
            "SELECT u.vfc_user_fname, u.vfc_user_lname, s.vfc_set_title FROM vfc_user AS u LEFT JOIN vfc_set AS s ON u.vfc_user_id = s.vfc_user_id WHERE s.vfc_set_access = 'public'"
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
        // console.log(userID);

        const vfcPrivateLib = await pool.query(
            "SELECT s.vfc_set_id, s.vfc_set_title FROM vfc_user AS u INNER JOIN vfc_set AS s ON u.vfc_user_id = s.vfc_user_id WHERE u.vfc_user_id = $1", [userID]
        );
        privLib = vfcPrivateLib.rows;
        console.log("vfcPrivateLib: " + vfcPrivateLib);
        // Message for an empty private lib
        if (privLib === undefined) {
            console.log("Personal library is currently empty.");
            res.send("Personal library is currently empty.");
        } else {
            console.log("Current library: " + JSON.stringify(privLib));
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
    try {
        const { vfcSetID } = req.params;
        // console.log(vfcSetID);
        const getCards = await pool.query(
            "SELECT s.vfc_set_title, c.vfc_id, c.vfc_question, c.vfc_answer FROM vfc AS c INNER JOIN vfc_set AS s ON c.vfc_set_id = s.vfc_set_id WHERE c.vfc_set_id = $1 AND s.vfc_user_id = $2",
            [vfcSetID, userID]
            // "SELECT * FROM vfc WHERE vfc_set_id = $1", [vfcSetID]
        );
        console.log(getCards);
        if (getCards.rows.length === 0) {
            console.log("No cards found");
            res.json("No cards found.");
        } else {
            console.log("No error found");
            console.log(JSON.stringify(getCards));
            console.log(getCards.rows);
            res.json(getCards);
        }
    } catch (err) {
        console.log("Error - " + err);
        res.json("Error - " + err);
    }

});

// Get cards from a public vfc_set
router.get("/pub_lib/:vfcSetID", auth, async (req, res) => {
    try {
        // const userID = req.user;
        const { vfcSetID } = req.params
        console.log("set id: " + vfcSetID);
        const vfcList = await pool.query(
            "SELECT s.vfc_set_title, c.vfc_id, c.vfc_question, c.vfc_answer FROM vfc_set AS s LEFT JOIN vfc AS c ON s.vfc_set_id = c.vfc_set_id WHERE s.vfc_set_access = 'public' AND c.vfc_set_id = $1", [vfcSetID]
        );

        if (vfcList.rows.length === 0) {
            console.log("Card set is empty.");
            res.json("Card set is empty.");
        } else {
            res.json(vfcList)
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
        const { title, accessType } = req.body;
        if (title === undefined) throw "Missing title";
        if (accessType === undefined) throw "Missing access type. (public/private)"
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
            "INSERT INTO vfc_set (vfc_user_id, vfc_set_title, vfc_set_view_access) VALUES ($1, $2, $3) RETURNING *",
            [userID, title, accessType]
        );
        console.log("New vflashcard set added.");
        res.send("New vflashcard set added.")
    } catch (err) {
        console.log("Error: " + err);
        res.send("Error: " + err);
    }

});
// Create a new card for a vfc_set

// Update a vfc_set's title and access type(private/public)
router.put("/lib/:vfcSetID", auth, async (req, res) => {
    try {
        if (req.body.title === undefined && req.body.accessType === undefined) throw "Missing arguments. Please retry."
        // const getAccess = (req.body.accessType).toLowerCase();
        // console.log(getAccess);
        // if (getAccess !== "private" && req.body.accessType !== "public") {
        //     console.log("Invalid access type");
        //     throw "Invalid access type.";
        // }
        const userID = req.user;
        const {vfcSetID} = req.params;
        console.log(vfcSetID);
        // test result from SQL query
        const result = await pool.query("SELET vfc_set_access from vfc_set WHERE vfc_set_id = $1 AND vfc_user = $2", vfcSetID, userID);

        console.log("Result: " + result);

        const accessType = (
            req.body.access !== undefined ? req.body.access : await pool.query("SELET vfc_set_access from vfc_set WHERE vfc_set_id = $1 AND vfc_user = $2", vfcSetID, userID));
        const title = (
            req.body.title !== undefined ? req.body.title :
                await pool.query("SELECT vfc_set_title FROM vfc_set WHERE vfc_set_id = $1 AND vfc_user = $2", vfcSetID, userID));

        // const { title, accessType } = req.body;
        console.log("userid: " + userID);
        console.log("vfc ID: " + vfcSetID);

        const updateCardSet = await pool.query(
            "UPDATE vfc_set SET vfc_set_title = $1, vfc_set_access = $2 WHERE vfc_set_id = vfcSetID = $3 AND vfc_user_id = $4",
            [title, accessType, vfcSetID, userID]
        );

        // if (title && accessType) {
        //     console.log("2 parameters");
        //     const updateCardSet = await pool.query(
        //         "UPDATE vfc_set SET vfc_set_title = $1, vfc_set_access = $2 WHERE vfc_set_id = vfcSetID = $3 AND vfc_user_id = $4",
        //         [title, accessType, vfcSetID, userID]
        //     );
        // } else if (title === undefined && accessType !== undefined) {
        //     console.log("access type only");
        //     const updateCardSet = await pool.query(
        //         "UPDATE vfc_set SET vfc_set_access = $1 WHERE vfc_set_id = $2 AND vfc_set_id = $3",
        //         [accessType, vfcSetID, userID]
        //     );
        // } else if (title !== undefined && accessType === undefined) {
        //     console.log("title only");
        //     const updateCardSet = await pool.query(
        //         "UPDATE vfc_set SET vfc_set_title = $1 WHERE vfc_set_id = $2 AND vfc_set_id = $3",
        //         [title, vfcSetID, userID]

        //     );
        //     console.log("End title only");
        //     console.log(updateCardSet);
        // } else {
        //     console.log("Missing 2 parameters");
        //     console.log(`Parameters: ${vfcSetID}, ${title}, ${accessType}`, vfcSetID, title, accessType);
        //     throw "400 - Bad Request"
        // }

        console.log(updateCardSet);
        if (updateCardSet.rows.length === 0) throw "403 - Forbidden"

        console.log("vFlashCard set has been successfully updated.");
        res.json("vFlashCard set has been successfully updated.");
    } catch (err) {
        console.error(err.message);
        res.send(err);
    }

});

// Update a vfc from a set

// Delete vfc_set
router.delete("lib/:vfcSetID", auth, async (req, res) => {
    try {
        const userID = req.user;
        const { vfcSetID } = req.params;
        console.log(vfcSetID);

        // Query test:
        const vfcPrivateLib = await pool.query(
            "SELECT s.vfc_set_id, s.vfc_set_title FROM vfc_user AS u INNER JOIN vfc_set AS s ON u.vfc_user_id = s.vfc_user_id WHERE u.vfc_user_id = $1", [userID]
        );

        console.log("Get library test: " + vfcPrivateLib);

        const deleteCardSet = await pool.query(
            "DELETE FROM vfc_set WHERE vfc_user_id = $1 AND vfc_set_id = $2 RETURNING *",
            [userID, vfcSetID]
        );
        if (deleteCardSet.row.length === 0) throw "403 - Forbidden";

        console.log("vFlashCard set has been deleted.");
        res.json("vFlashCard set has been deleted.");
    } catch (error) {
        console.log("Error - " + err);
        json.send("Error - " + err);
    }

})

// Delete a vfc from a set



module.exports = router;