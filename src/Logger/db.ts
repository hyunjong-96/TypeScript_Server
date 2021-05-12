import mongoose from 'mongoose';
import config from '../config'

const connectDB = async()=>{
    try{
        await mongoose.connect(config.mongoURI,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useUnifiedTopology:true
        });

        console.log("Mongoose Connnected...");
    }catch(err){
        console.error(err.messasge);
        process.exit(1);
    }
}

export default connectDB;