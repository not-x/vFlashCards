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
            "SELECT u.vfc_user_fname, u.vfc_user_lname, s.vfc_set_title FROM vfc_user AS u LEFT JOIN vfc_set AS s ON u.vfc_user_id = s.vfc_user_id WHERE s.vfc_set_view_access = 'public'"
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
router.get("/lib/:vfcSetID", auth, (req, res) => {

});

// Get cards from a public vfc_set
router.get("/pub_lib/:vfcSetID", auth, (req, res) => {

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

// Update a vfc_set's description

// Update a vfc from a set

// Delete vfc_set

// Delete a vfc from a set



module.exports = router;