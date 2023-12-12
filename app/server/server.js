const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/auth", require("./routes/login"));
app.use("/profile", require("./routes/userProfile"));

// redirect all unknown routes to react app
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});