import { createContext, useEffect, useState } from "react";
import { jobsData } from "../src/assets/assets";

export const AppContext=createContext();


export const AppContextProvider=(props)=>{
    const [searchFilter,setSearchFilter]=useState({
        search : "",
        location : ""
    })

    const [searched,setIsSearched]=useState(false);
    const [jobs,setJobs]=useState([]);
    const [showRecruiterLogin,setShowRecruiterLogin]=useState(false);

    const fetchJobs =async()=>{
        setJobs(jobsData)
    }
    useEffect(()=>{
        fetchJobs();
    },[])
    const value={
        searchFilter,
        setSearchFilter,
        searched,
        setIsSearched,
        jobs,
        setJobs,
        showRecruiterLogin,
        setShowRecruiterLogin
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}