import mongoose from "mongoose";

const companySChema=new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    image :{
        type : String,
        required : true,
    },
    password :{
        type : String,
        required : true
    }
},{
    timestamps: true
})

const Company=mongoose.model('Company',companySChema)
export default Company;

 