const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
require("dotenv").config();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/auth", require("./routes/login"));
app.use("/profile", require("./routes/userProfile"));


console.log("process.env.NODE_ENV: " + process.env.NODE_ENV)

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "../client/build")));
//     app.get("*", function (req, res) {
//         res.sendFile(path.join(__dirname, "../client/build", "index.html"));
//     });
// }



app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});