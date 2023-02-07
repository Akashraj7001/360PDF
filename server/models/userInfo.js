const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    empid:{
        type: String,
        require: true,
    },
    empname:{
        type: String,
        require: true
    },
    role: {
        type:String,
        required: true,
    },
    competency:[],
    value:[],
})

module.exports=mongoose.model("userinfo",userSchema);