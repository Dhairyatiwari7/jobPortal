import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { assets, jobsApplied } from "../assets/assets";
import moment from "moment";
import Footer from "../components/footer";
const Applications = () => {
  const [isEdit, setIsEdit] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [resume, setResume] = useState(null);
  return (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {isEdit ? (
            <>
              <label className="flex items-center" htmlFor="resumeUpload">
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
                  Select Resume
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
                onClick={() => setIsEdit(false)}
                className="bg-green-100 text-green-400 rounded-lg px-4 py-2"
              >
                save
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <a
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
                href=""
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
            {jobsApplied.map((job, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 flex items-center gap-2 border-t border-gray-200">
                  <img src={job.logo} className="w-8 h-8 object-contain" />
                  {job.company}
                </td>
                <td className="py-3 px-4 border-t border-gray-200">
                  {job.title}
                </td>
                <td className="py-3 px-4 border-t border-gray-200 max-sm:hidden">
                  {job.location}
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
