import User from '../models/User.js';
import JobApplication from '../models/JobApplication.js';
import Job from '../models/Job.js';
import {v2 as cloudinary} from 'cloudinary';
export const getUserData=async(req,res)=>{
    const id=req.auth.userId
    if(!id){
        return res.json({success:false,message:"User not found"});
    }
    try {
        const user=await User.findById(id);
        if(!user){
            return res.json({success:false,message:"User does not exist"});
        }
        return res.json({success:true,user});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export const applyForJob=async(req,res)=>{
    const {jobId}=req.body;
    const userId=req.auth.userId

    if(!jobId){
        return res.json({success:false,message:"Missing required fields"});
    }
    try {
        const isAlreadyApplied=await JobApplication.find({jobId,userId});
        if(isAlreadyApplied.length>0){
            return res.json({success:false,message:"You have already applied for this job"});
        }
        const jobData=await Job.findById(jobId);

        if(!jobData){
            return res.json({success:false,message:"Job not found"});
        }
        await JobApplication.create({
            userId,
            companyId : jobData.companyId,
            jobId,
            date : Date.now()
        });
        
        return res.json({success:true,message : "Job applied successfully"});
    }
    catch (error) {
        return res.json({success:false, message : error.message});
    }
}

export const getUserJobApplications=async(req,res)=>{
    try {
        const userId=req.auth.userId;
        const applications=await JobApplication.find({userId})
        .populate('companyId','name email image')
        .populate('jobId','title description location category level salary')
        .exec();
        if(!applications){
            return res.json({success:false,message:"No applications found"});
        }
        return res.json({success:true,applications});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export const updateUserResume=async(req,res)=>{
    try {
        const userId=req.auth.userId;
        const resumeFile=req.file;
        if(!resumeFile){
            return res.json({success:false,message:"Missing resume file"});
        }
        const userData=await User.findById(userId);
        if(!userData){
            return res.json({success:false,message:"User not found"});
        }
        const resumeUpload=await cloudinary.uploader.upload(resumeFile.path);
        userData.resume=resumeUpload.secure_url;
        await userData.save();
        return res.json({success:true,message:"Resume updated successfully"});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}