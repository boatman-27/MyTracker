import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar'
import './App.css'

const App = () => {

  const [jobs, setJobs] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/show_jobs');
        if (response.ok) {
          const data = await response.json();

          // Check if data is truthy before using Object.entries
          if (data) {
            const jobsArray = Object.entries(data).map(([id, job]) => ({
              id,
              ...job,
            }));

            console.log(jobsArray);

            if (jobsArray.length > 0) {
              setJobs(jobsArray);
              setDataAvailable(true);
            } else {
              setDataAvailable(false);
            }
          } else {
            setDataAvailable(false);
          }
        } else {
          console.error('Failed to fetch job data');
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
        <div className='background'>
        <Navbar />
        <h1 style={{ textAlign: 'center', fontSize: '40px', color: 'white' }}>Jobs I applied for</h1>
        {jobs.length > 0 && (
        <div className='blue-glassmorphism-container'>
          {jobs.map((job) => (
            <div key={job.id} className='blue-glassmorphism job-item'>
              <h2 style={{ color: 'white' }}> Company Name: {job.Company_name}</h2>
              <h2 style={{ color: 'white' }}> Job Title: {job.job_title}</h2>
              <h2 style={{ color: 'white' }}> Location: {job.location}</h2>
              <h2 style={{ color: 'white' }}> Date Posted: {job.posting_date}</h2>
              <h2 style={{ color: 'white' }}> Status: {job.Status}</h2>
              <button
                className='custom-button'
                onClick={() => window.open(job.linkedin_link, '_blank')}
              >
                View LinkedIn Job
              </button>
            </div>
              ))}
              </div>
              )}
      </div>
    </div>
    
  );
};

export default App;
