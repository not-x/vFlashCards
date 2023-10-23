const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

// Get public flashcard sets
router.get('/vfc_public_lib', auth, async(req, res) => {
    try {
        const vfcPublicLib = await pool.query(
            "SELECT vfc_set_title FROM vfc_set WHERE vfc_set_view_access = 'public'");
        res.json(vfcPublicLib);
    } catch (err) {
        console.log("Error - " + err);
        res.send("Error" + err);
    }
});

// // Get private flashcard set for vfc_user
router.get('/vfc_lib', auth, async(req, res) => {
    try {
        // const vfc_user = await pool.query("SELECT vfc_user")
    } catch (error) {
        
    }
});

// Get cards from a single vfc_set

// Create new vfc_set

// Create a new card for a vfc_set

// Update a vfc_set's description

// Update a vfc from a set

// Delete vfc_set

// Delete a vfc from a set



module.exports = router;