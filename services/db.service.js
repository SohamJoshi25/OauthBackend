const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGOURI)
          console.log('Connected to MongoDB successfully');
    }catch(err){
        console.error('MongoDB connection error:', err.message);
    }
}

module.exports = connectDB 