import React, { useRef, useEffect, useState,useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../Context/AppContext";
const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner Level");
  const [salary, setSalary] = useState(0);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write the job description here...",
      });
    }
  }, []);

  const  {BACKEND_URL,companyToken}=useContext(AppContext);  
  const handleAddJob=async(e)=>{
    e.preventDefault()
    try {
      const {data}=await axios.post(`${BACKEND_URL}/api/company/post-job`,{
        title,
        description:quillRef.current.root.innerHTML,
        location,
        category,
        level,
        salary
      },
    {
      headers:{token:companyToken}
    })
      if(data.success){
        toast.success(data.message);
        setTitle('');
        setSalary(0);
        quillRef.current.root.innerHTML='';
      }
      else{
        toast.error(data.message); 
      }
    } catch (error) {
      toast.error(error.message);
    }
}

  return (
    <form onSubmit={handleAddJob} className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Job</h2>

      {/* Job Title */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
          placeholder="Enter job title"
        />
      </div>

      {/* Job Description */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
        <div
          ref={editorRef}
          className="bg-white border border-gray-300 rounded-md min-h-[150px]"
        />
      </div>

      {/* Job Category */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Category</label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        >
          {JobCategories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Category</label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        >
          {JobLocations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Job Level & Salary */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Level</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setLevel(e.target.value)}
            value={level}
          >
            <option value="Beginner Level">Beginner Level</option>
            <option value="Intermediate Level">Intermediate Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Salary (₹)</label>
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setSalary(parseInt(e.target.value))}
            value={salary}
            placeholder="Enter salary"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition duration-200"
        
      >
        Add Job
      </button>
    </form>
  );
};

export default AddJob;
