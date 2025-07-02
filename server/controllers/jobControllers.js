import Job from '../models/Job.js'


export const getJobs=async(req,res)=>{
    try {
        const job=await Job.find({visible:true}).populate({path:'companyId',select:'-password'});
        if(!job){
            return res.json({success:false,message:"No jobs found"});
        }
        return res.json({success:true,job});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}
export const getJobById=async(req,res)=>{
    const JobId=req.params.id;
    if(!JobId){
        return res.json({success:false,message:"Missing JobId"});
    }
    try {
        const job=await Job.findById(JobId).populate({path:'companyId',select:'-password'});
        if(!job){
            return res.json({success:false,message:"No jobs found with this id"});
        }
        return res.json({success:true,jobs});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}