const mongoose = require('mongoose');

const connectDb = async(req, res) => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING, {
            dbName: 'co-learning-app'
        });
        console.log(`successfully connected to database !`);
    } catch(err) {
       console.log(err);
    }
}

module.exports = connectDb;