import Company from "../models/Company.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
//Register new company
export const registerComapany=async(req,res)=>{
    const {companyname,email,password}=req.body;
    const imageFile=req.file;
    if(!companyname || ! email || !password || !imageFile){
        return res.json({success :false,message:"Missing fields"});
    }
    try {
        const companyExists=await Company.findOne({email});
        if(companyExists){
            return res.json({success :false,message:"Company already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password,salt);
        const imageUpload=await cloudinary.uploader.upload(imageFile.path);

        const company=await Company.create({
            name:companyname,
            email,
            password: hashPassword,
            image:imageUpload.secure_url
        })
        return res.json({success :true,company :{
            _id : company._id,
            name : company.name,
            email : company.email,
            image : company.image
        },
        generateToken:generateToken(company._id)
    });
    } catch (error) {
        return res.json({success :false,message:error.message});
    }
}


export const loginCompany=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    try {
        const company=await Company.findOne({email});
        if(!company){
            return res.json({success :false,message:"Company not found"});
        }
        const ismatch=await bcrypt.compare(password,company.password);
        if(!ismatch){
            return res.json({success :false,message:"Incorrect password"});
        }
        return res.json({success :true,company :{
            _id : company._id,
            name : company.name,
            email : company.email,
            image : company.image
        },
        generateToken:generateToken(company._id)});
    } catch (error) {
        return res.json({success :false,message:error.message});
    }
}
export const getCompanyData=async(req,res)=>{
    
    try {
        
        const company=req.company;
        if(!company){
            return res.jsonL({success:false,message:"Company not found"});
        }
        return res.json({success :true,
            company :company
        });
    } catch (error) {
        return res.json({success: false,message :"Error fetching company data"});
    }
    
}
export const postJob=async(req,res)=>{
    const {title,description,location,category,level,salary}=req.body;
    if(!title || !description || !location || !category || !level || !salary){
        return res.json({success :false,message:"Missing required fields"});
    }
    const companyId=req.company._id;
    console.log(companyId);
    try {
        const job=new Job({
            title,
            description,
            location,
            category,
            level,
            salary,
            date : Date.now(),
            companyId
        })
        const iscreated=await job.save();
        if(!iscreated){
            return res.json({success:false,message:"Failed to create Job"});
        }
        return res.json({success :true,job});
    } catch (error) {
        return res.json({success :false,message:error.message});
    }
}
export const getCompanyJobApplicants=async(req,res)=>{

}
export const getCompanyPostedJobs=async(req,res)=>{
    const id=req.company._id;
    if(!id){
        return res.json({success:false,message:"Company not found"});
    }
    try {
        const jobs=await Job.find({companyId:id}).populate({path:'companyId',select:'-password'});
        if(!jobs){
            return res.json({success:false,message:"No jobs found"});
        }
        return res.json({success:true,jobs});
    } catch (error) {   
        return res.json({success:false,message:error.message});
    }
}
export const changeJobStatus=async(req,res)=>{
    
}
export const changeVisibility=async(req,res)=>{
    const {id}=req.body;
    if(!id){
        return res.json({success:false,message:"Missing required fields"});
    }
    try {
        const job =await Job.findById(id);
        if(!job){
            return res.json({success:false,message:"Job not found"});
        }
        const companyId=req.company._id;
        if(companyId.toString()===job.companyId.toString()){
            job.visible= !job.visible;
        }
        await job.save()
        return res.json({
            success: 'true',
            job
        })
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}


