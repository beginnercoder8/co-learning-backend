const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const connectDb = require("./db/db");
connectDb();
const PORT = process.env.PORT || 2000;
app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", require("./router/auth.router"));

app.listen(PORT, () => {
    console.log(`server is successfully running on port ${PORT}`)
});