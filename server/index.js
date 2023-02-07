const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cors=require('cors');


//  const { feedData } = require('./helpers/feedData');

const app=express();

dotenv.config({path:'./config.env'})

const port=process.env.PORT || 4500;

const db=process.env.DATABASE;


const options={
    keepAlive:true, 
    useNewUrlParser:true,
    useUnifiedTopology:true,
}

mongoose.set('strictQuery',true);

mongoose.connect(db,options)
.then(()=>console.log('connected to the database'))
.catch((err)=>console.log(err))

//  feedData();

app.use(cors());

app.use(require('./routes/routes'));


app.listen(port,()=>console.log(`App is running on Port ${port}`))