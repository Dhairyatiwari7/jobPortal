import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";


export const AppContext = createContext();

export const AppContextProvider = (props) => {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const {user}=useUser();
  const {getToken}=useAuth();
  const [searchFilter, setSearchFilter] = useState({
    search: "",
    location: "",
  });

  const [searched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [userData,setUserData]=useState(null);
  const [userApplications,setUserApplications]=useState([]);

  
  const getCompanyData = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/company/company`, {
        headers: { token: companyToken },
      });
      if (data.success) {
        console.log("fetched data",data);
        setCompanyData(data.company);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (companyToken) {
      console.log("companyToken", companyToken);
      getCompanyData();
    }
  }, [companyToken]);

  const fetchJobs = async () => {
    try {
      
      const {data}=await axios.get(`${BACKEND_URL}/api/jobs`);
      if(data.success){
        console.log("JOBS",data);
        setJobs(data.job)
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    
  };
  

  useEffect(() => {
    fetchJobs();
    const storedCompanyToken = localStorage.getItem("companyToken");
    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    } 
  }, []);
const getuserData=async()=>{
    const token=await getToken();
    try {
      const {data}=await axios.get(`${BACKEND_URL}/api/users/user`,
        {
          headers :{Authorization: `Bearer ${token}`}
        }
      );
      if(data.success){
        console.log('USER',data);
        setUserData(data.user);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const fetchUserJobApplications=async()=>{
      try {
        const token=await getToken();
        const {data}=await axios.get(`${BACKEND_URL}/api/users/job-application`,{
          headers:{Authorization:`Bearer ${token}`}
        })
        if(data.success){
          setUserApplications(data.applications);
          toast.success(data.message);
        }
        else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  useEffect(()=>{
    if(user){
      getuserData()
      fetchUserJobApplications()
    }
  },[user])
  

  const value = {
    BACKEND_URL,
    searchFilter,
    fetchUserJobApplications,
    setSearchFilter,
    searched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
    getuserData,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
