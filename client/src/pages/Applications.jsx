import React, { useState,useContext } from "react";
import Navbar from "../components/Navbar";
import { assets,} from "../assets/assets";
import moment from "moment";
import Footer from "../components/footer";
import { AppContext } from "../../Context/AppContext";
import { useUser ,useAuth} from "@clerk/clerk-react";
import axios from 'axios'
import { toast } from "react-toastify";
import { useEffect } from "react";
const Applications = () => {
  const {user}=useUser();
  const {getToken}=useAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);

  const {BACKEND_URL,userData,userApplications,getuserData}=useContext(AppContext);

  const updateUserResume=async()=>{
    try {
      if(!user){
        toast.error('Login to upload resume');
      }
      const token=await getToken();
      const formData=new FormData();
      formData.append('resume',resume);
      const {data}=await axios.post(`${BACKEND_URL}/api/users/update-resume`,formData,
        {
          headers:{Authorization:`Bearer ${token}`}
        }
      )
      if(data.success){
        console.log('resume updated successfully');
        toast.success(data.message);
        await getuserData();
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsEdit(false);
    setResume(null);
  }
  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {isEdit || userData && userData.resume===''
          ? (
            <>
              <label className="flex items-center" htmlFor="resumeUpload">
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
                  {resume ? resume.name : "Select Resume"}
                </p>
                <input
                  id="resumeUpload"
                  onChange={(e) => setResume(e.target.files[0])}
                  accept="application/pdf"
                  type="file"
                  hidden
                />
                <img src={assets.profile_upload_icon}></img>
              </label>
              <button
                
                onClick={updateUserResume}
                className="bg-green-100 text-green-400 rounded-lg px-4 py-2"
              >
                save
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <a
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
                href={userData.resume}
                target='_blank'
              >
                Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <h2 className="tex-xl font-semibold mb-4">Jobs Applied</h2>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-gray-700 font-medium border-b border-gray-200">
                Company
              </th>
              <th className="px-4 py-3 text-left text-gray-700 font-medium border-b border-gray-200">
                Job Title
              </th>
              <th className="px-4 py-3 text-left text-gray-700 font-medium border-b border-gray-200 max-sm:hidden">
                Location
              </th>
              <th className="px-4 py-3 text-left text-gray-700 font-medium border-b border-gray-200 max-sm:hidden">
                Date
              </th>
              <th className="px-4 py-3 text-left text-gray-700 font-medium border-b border-gray-200">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {userApplications.map((job, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 flex items-center gap-2 border-t border-gray-200">
                  <img src={job.companyId.image} className="w-8 h-8 object-contain" />
                  {job.companyId.name}
                </td>
                <td className="py-3 px-4 border-t border-gray-200">
                  {job.jobId.title}
                </td>
                <td className="py-3 px-4 border-t border-gray-200 max-sm:hidden">
                  {job.jobId.location}
                </td>
                <td className="py-3 px-4 border-t border-gray-200 max-sm:hidden">
                  {moment(job.date).format("ll")}
                </td>
                <td className="py-3 px-4 border-t border-gray-200">
                  <span className={`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5 rounded`}>{job.status}</span>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default Applications;
