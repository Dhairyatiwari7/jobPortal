import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import JobListing from '../components/JobListing'
import AppDownLoad from '../components/AppDownLoad'
import Footer from '../components/footer'
const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <JobListing />
      <AppDownLoad />
      <Footer />
    </div>
  )
}

export default Home