const mongoose=require('mongoose')
const options={
    keepAlive:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
}

const db=process.env.DATABASE;

const connectDb=()=>{
    mongoose.set('strictQuery',true);

    mongoose.connect(db,options)
    .then(()=>console.log('connected to the database'))
    .catch((err)=>console.log(err))
}

module.exports=connectDb;

