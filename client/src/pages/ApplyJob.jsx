import { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../Context/AppContext';
import Loading from '../components/Loading.jsx';
import Navbar from '../components/Navbar.jsx';
import { assets } from '../assets/assets';
import kconvert from 'k-convert';
import moment from 'moment';
import JobCard from '../components/jobCard';
import Footer from '../components/footer.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth,  } from '@clerk/clerk-react';
const ApplyJob = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const {BACKEND_URL,jobs,userData,userApplications,fetchUserJobApplications}=useContext(AppContext)
  const [isAlreadyApplied,setIsAlreadyApplied]=useState(false);
  const Navigate=useNavigate();
  //const {user}=useUser();
  const {getToken}=useAuth()

  const fetchJobByid=async()=>{
    try {
      const {data}=await axios.get(`${BACKEND_URL}/api/jobs/${id}`);
      if(data.success){
        console.log("JOBDATA",data);
        setJobData(data.job);
        toast.success(data.message);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    fetchJobByid();
  }, [id]);

  const handleApplyNow=async()=>{
    try {
      if(!userData){
        return toast.error("Login first");
        
      }
      if(!userData.resume){
        Navigate('/applications')
        return toast.error("Upload resume first");
      }
      const token=await getToken()
      const {data}=await axios.post(`${BACKEND_URL}/api/users/apply-job`,
        {
          jobId:id
        },
        {
          headers :{Authorization:`Bearer ${token}`}
        }
      )
      if(data.success){
        toast.success('Job applied successfully');
        fetchUserJobApplications(); 
      }
      else{
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error)
    }
  }
  const hadAlreadyApplied=()=>{
     const hasApplied=userApplications.some(item=>item.jobId._id===jobData._id)
     setIsAlreadyApplied(hasApplied)
  }
  useEffect(()=>{
    if(userApplications.length>0 && jobData){
      hadAlreadyApplied()
    }
  },[jobData,userApplications,id])
  return jobData ? (
    <>
      <Navbar />
      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full'>

          {/* Job Header */}
          <div className='flex flex-col md:flex-row justify-between items-center px-14 py-12 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center gap-4'>
              <img className='h-24 bg-white rounded-lg p-4 border' src={jobData.companyId.image} alt="" />
              <div className='text-center md:text-left text-neutral-700'>
                <h1 className='text-2xl sm:text-4xl font-medium'>{jobData?.title}</h1>
                <div className='flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 items-center text-gray-600 mt-2'>
                  <span className='flex items-center gap-1'>
                    <img src={assets.suitcase_icon} alt="" />
                    {jobData?.companyId.name}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.location_icon} alt="" />
                    {jobData?.location}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.person_icon} alt="" />
                    {jobData?.level}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.money_icon} alt="" />
                    CTC: $ {kconvert.convertTo(jobData?.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-col items-end self-start mt-4 md:mt-0'>
              <button className='bg-blue-600 text-white rounded px-6 py-2' onClick={handleApplyNow}>{isAlreadyApplied ? "Already Applied":"Apply Now"}</button>
              <p className='mt-1 text-gray-600 text-sm'>Posted {moment(jobData.date).fromNow()}</p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className='flex flex-col lg:flex-row gap-8 px-8 pb-10'>
            {/* Left: Job Description */}
            <div className='w-full lg:w-2/3'>
              <h2 className='font-bold text-2xl mb-4'>Job Description</h2>
              <div>
                <div className='rich-text' dangerouslySetInnerHTML={{ __html: jobData.description }}></div>
                <button className='bg-blue-600 text-white rounded mt-10 px-10 py-2 cursor-pointer' onClick={handleApplyNow}>{isAlreadyApplied ? "Already Applied":"Apply Now"}</button>
              </div>
            </div>

            {/* Right: More Jobs */}
            <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
              <h2 className='font-bold text-xl mb-4'>More jobs from {jobData.companyId.name}</h2>
              <div className='flex flex-col gap-4'>
                {jobs
                  .filter((job) => job._id !== jobData._id && job.companyId._id === jobData.companyId._id)
                  .filter(job=>{
                    const appliedJobsId=new Set(userApplications.map(app=>app.jobId && app.jobId._id))
                    return !appliedJobsId.has(job._id)
                  })
                  .slice(0, 4)
                  .map((job, index) => (
                    <JobCard key={index} job={job} />
                  ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;
