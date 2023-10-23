const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", require("./routes/login"));
app.use("/p", require("./routes/userProfile"));

app.listen(5000, () => {
    console.log("Server listening on port 5000");
});