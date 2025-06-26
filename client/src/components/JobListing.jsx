import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { assets, JobCategories ,JobLocations} from "../assets/assets";
import JobCard from "./jobCard";

const JobListing = () => {
  const { searched, searchFilter, setSearchFilter, jobs } = useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurretPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const removeTitle = () => {
    setSearchFilter((prev) => ({
      ...prev,
      title: "",
    }));
  };

  const removeLocation = () => {
    setSearchFilter((prev) => ({
      ...prev,
      location: "",
    }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((item) => item !== location)
        : [...prev, location]
    );
  };

  const filteredJobs = useMemo(() => {
  return jobs
    .slice()
    .reverse()
    .filter((job) => {
      const jobTitle = job?.title?.toLowerCase?.() || "";
      const jobLocation = job?.location?.toLowerCase?.() || "";
      const filterTitle = searchFilter?.title?.toLowerCase?.() || "";
      const filterLocation = searchFilter?.location?.toLowerCase?.() || "";

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(job.category);
      const matchesLocation =
        selectedLocations.length === 0 || selectedLocations.includes(job.location);
      const matchesTitle =
        filterTitle === "" || jobTitle.includes(filterTitle);
      const matchesSearchLocation =
        filterLocation === "" || jobLocation.includes(filterLocation);

      return matchesCategory && matchesLocation && matchesTitle && matchesSearchLocation;
    });
}, [jobs, selectedCategories, selectedLocations, searchFilter]);

  const jobsPerPage = 6;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const displayedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* Left Sidebar */}
      <div className="w-full lg:w-1/4 bg-white px-4">
        {searched && (searchFilter.title || searchFilter.location) && (
          <>
            <h1 className="font-medium text-large mb-4">Current Search</h1>
            <div className="mb-4 text-gray-600">
              {searchFilter.title && (
                <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                  {searchFilter.title}
                  <img
                    className="cursor-pointer"
                    src={assets.cross_icon}
                    alt="Remove title filter"
                    onClick={removeTitle}
                  />
                </span>
              )}
              {searchFilter.location && (
                <span className="ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
                  {searchFilter.location}
                  <img
                    className="cursor-pointer"
                    src={assets.cross_icon}
                    alt="Remove location filter"
                    onClick={removeLocation}
                  />
                </span>
              )}
            </div>
          </>
        )}

        {/* Toggle Filters on Mobile */}
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="px-6 py-1.5 rounded border border-gray-400 lg:hidden"
        >
          {showFilter ? "Close" : "Filters"}
        </button>

        {/* Category Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4">Search By Categories</h4>
          <ul className="space-y-4 text-gray-600">
            {JobCategories.map((category, index) => (
              <li key={index} className="flex gap-3 items-center">
                <input
                  className="scale-125"
                  onChange={() => handleCategoryChange(category)}
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                />
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Location Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4 pt-14">Search By Location</h4>
          <ul className="space-y-4 text-gray-600">
            {JobLocations.map((location, index) => (
              <li key={index} className="flex gap-3 items-center">
                <input
                  onChange={() => handleLocationChange(location)}
                  className="scale-125"
                  type="checkbox"
                  checked={selectedLocations.includes(location)}
                />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job Listings */}
      <section className="w-full lg:w-3/4 text gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="job-list">
          Latest Jobs
        </h3>
        <p className="mb-8">Get your desired job from top companies</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedJobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="flex justify-center items-center space-x-2 mt-10">
            <a href="#job-list">
              <img
                onClick={() => setCurretPage(Math.max(1, currentPage - 1))}
                src={assets.left_arrow_icon}
                alt="left arrow"
              />
            </a>
            {Array.from({ length: totalPages }).map((_, index) => (
              <a key={index} href="#job-list">
                <button
                  onClick={() => setCurretPage(index + 1)}
                  className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${
                    currentPage === index + 1
                      ? " bg-blue-100 text-blue-500 "
                      : "text-gray-500"
                  }`}
                >
                  {index + 1}
                </button>
              </a>
            ))}
            <a href="#job-list">
              <img
                onClick={() => setCurretPage(Math.min(totalPages, currentPage + 1))}
                src={assets.right_arrow_icon}
                alt="right arrow"
              />
            </a> 
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
