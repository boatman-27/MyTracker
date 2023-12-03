import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';

const Jobs = () => {
  const [formData, setFormData] = useState({
    Company_name: '',
    job_title: '',
    location: '',
    posting_date: '',
    linkedin_link: '',
    Status: 'Pending'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Form submitted successfully');
        window.location.reload()
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

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

  const handleDelete = async (jobIdToDelete) => {
    try {
      if (!jobIdToDelete) {
        console.error('Job ID is empty');
        return;
      }
  
      console.log(jobIdToDelete);
  
      const response = await fetch(`/api/delete_job`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: jobIdToDelete }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Job deleted successfully
  
      } else {
        const errorData = await response.json();
        console.error(errorData.error); // Error message
      }
    } catch (error) {
      console.error('Error:', error);
    }

    window.location.reload()
  };

  const handleAccpet = async (jobIdToAccept) => {
    try {
      if (!jobIdToAccept) {
        console.error('Job ID is empty');
        return;
      }
  
      console.log(jobIdToAccept);
  
      const response = await fetch(`/api/job_accepted`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: jobIdToAccept }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Job accepted successfully
        window.location.reload()
  
      } else {
        const errorData = await response.json();
        console.error(errorData.error); // Error message
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleReject = async (jobIdToReject) => {
    try {
      if (!jobIdToReject) {
        console.error('Job ID is empty');
        return;
      }
  
      console.log(jobIdToReject);
  
      const response = await fetch(`/api/job_rejected`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: jobIdToReject }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Job accepted successfully
        window.location.reload()
  
      } else {
        const errorData = await response.json();
        console.error(errorData.error); // Error message
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div>
      <Navbar />
      <div className='centered-container'>
        <h1 style={{ textAlign: 'center', fontSize: '40px', color: 'white' }}>Add Jobs I applied for</h1>
        <div className='blue-glassmorphism'>
          <form onSubmit={handleSubmit}>
            <input type="text" name="Company_name" placeholder='Company Name' value={formData.Company_name} onChange={handleChange} />
            <br />
            <input type="text" name="job_title" placeholder='Job Title' value={formData.job_title} onChange={handleChange} />
            <br />
            <input type="text" name="location" placeholder='Location' value={formData.location} onChange={handleChange} />
            <br />
            <input type="date" name="posting_date" placeholder='Select Posting Date' value={formData.posting_date} onChange={handleChange} />
            <br />
            <input type="link" name="linkedin_link" placeholder='LinkedIn Link' value={formData.linkedin_link} onChange={handleChange} />
            <br />
            <button type="submit" className='custom-button'>Submit</button>
          </form>
        </div>
      </div>
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
              <br />
              <br />
              <div>
                <button
                  className='custom-button'
                  style={{marginRight: '10px', backgroundColor:'green'}}
                  onClick={() => handleAccpet(job.id)}
                >
                  Accept
                </button>
                <button
                  className='custom-button'
                  style={{ backgroundColor: 'red' }}
                  onClick={() => handleReject(job.id)}
                >
                  Reject
                </button>
                <br />
                <br />
                <button
                  className='custom-button'
                  style={{ backgroundColor: 'black' }}
                  onClick={() => handleDelete(job.id)}
                >
                  Delete Job
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
        {jobs.length === 0 && (
          <h1 style={{ textAlign: 'center', fontSize: '40px', color: 'white' }}>
            You haven't applied to any Jobs.
          </h1>
        )}
    </div>
  );
};

export default Jobs;
