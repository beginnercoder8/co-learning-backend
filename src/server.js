const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 2000;
app.use(express.json());
app.use(cors());

app.get('/api/v1/hello-world' ,async(req,res) => {
    res.status(200).json({code:200,message:'success'});
})

app.listen(PORT, () => {
    console.log(`server is successfully running on port ${PORT}`)
});