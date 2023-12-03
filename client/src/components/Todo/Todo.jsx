import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar'

export const Todo = () => {
    const [formData, setFormData] = useState({
        category: '',
        task_name: '',
        posting_date: '',
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
          const response = await fetch('/api/submit/todos', {
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

    const [todos, setTdoos] = useState([]);
    const [dataAvailable, setDataAvailable] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/show_todos');
          if (response.ok) {
            const data = await response.json();
  
            // Check if data is truthy before using Object.entries
            if (data) {
              const todosArray = Object.entries(data).map(([id, job]) => ({
                id,
                ...job,
              }));
  
              console.log(todosArray);
  
              if (todosArray.length > 0) {
                setTdoos(todosArray);
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

    const handleDelete = async (tododIdToDelete) => {
        try {
          if (!tododIdToDelete) {
            console.error('Todo ID is empty');
            return;
          }
      
          console.log(tododIdToDelete);
      
          const response = await fetch(`/api/delete_job`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: tododIdToDelete }),
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log(data.message); // task deleted successfully
      
          } else {
            const errorData = await response.json();
            console.error(errorData.error); // Error message
          }
        } catch (error) {
          console.error('Error:', error);
        }
    
        window.location.reload()
    };

    const handleAccpet = async (taskIdTocomplete) => {
        try {
          if (!taskIdTocomplete) {
            console.error('Task ID is empty');
            return;
          }
      
          console.log(taskIdTocomplete);
      
          const response = await fetch(`/api/task_completed`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: taskIdTocomplete }),
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log(data.message); // task completed successfully
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
            <h1 style={{ textAlign: 'center', fontSize: '40px', color: 'white' }}>Add Tasks</h1>
            <div className='blue-glassmorphism'>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="category" placeholder='Category' value={formData.category} onChange={handleChange} />
                    <br />
                    <input type="text" name="task_name" placeholder='Task Name' value={formData.task_name} onChange={handleChange} />
                    <br />
                    <input type="date" name="posting_date" placeholder='Select Posting Date' value={formData.posting_date} onChange={handleChange} />
                    <br />
                    <button type="submit" className='custom-button'>Submit</button>
                </form>
            </div>
        </div>
            <h1 style={{ textAlign: 'center', fontSize: '40px', color: 'white' }}>Current Todos</h1>
            {todos.length > 0 && (
                <div className='blue-glassmorphism-container'>
                    {todos.map((todo) => (
                        <div key={todo.id} className='blue-glassmorphism job-item'>
                        <h2 style={{ color: 'white' }}> Category: {todo.category}</h2>
                        <h2 style={{ color: 'white' }}> Task: {todo.task_name}</h2>
                        <h2 style={{ color: 'white' }}> Date Posted: {todo.posting_date}</h2>
                        <h2 style={{ color: 'white' }}> Status: {todo.Status}</h2>
                        <br />
                        <div style={{ display: 'flex'}}>
                            <button
                            className='custom-button'
                            style={{marginRight: '10px', backgroundColor:'green'}}
                            onClick={() => handleAccpet(todo.id)}
                            >
                            Completed
                            </button>
                            <button
                            className='custom-button'
                            style={{ backgroundColor: 'black' }}
                            onClick={() => handleDelete(todo.id)}
                            >
                            Delete Task
                            </button>
                        </div>
                        </div>
                    ))}
                </div>
            )}
                {todos.length === 0 && (
                <h1 style={{ textAlign: 'center', fontSize: '40px', color: 'white' }}>
                    You have nothing to do.
                </h1>
            )}
    </div>
  )
}

export default Todo
