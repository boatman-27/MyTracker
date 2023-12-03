import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';

export const Expenses = () => {
    const [formData, setFormData] = useState({
        money: '',
        party: '',
        posting_date: Date.now(),
        desc: '',
        status: ''
      });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    const handleIncome = async (e) => {
        e.preventDefault();
    
        // Convert money to a number
        const moneyAsNumber = Number(formData.money);
    
        try {
            const response = await fetch('/api/expense/income', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    money: moneyAsNumber,
                    status: 'Income'
                }),
            });
    
            if (response.ok) {
                console.log('Form submitted successfully');
                window.location.reload();
            } else {
                console.error('Form submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleExpense = async (e) => {
        e.preventDefault();

        const moneyAsNumber = Number(formData.money);
    
        try {
            const response = await fetch('/api/expense/expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    money: moneyAsNumber,
                    status: 'Expense'
                }),
            });
    
            if (response.ok) {
                console.log('Form submitted successfully');
                window.location.reload();
            } else {
                console.error('Form submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const [amount, setAmount] = useState(null);
    const [dataAvailable, setDataAvailable] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch('/api/expense/amount');
            if (response.ok) {
            const data = await response.json();

            if (data && data.amount !== undefined) {
                setAmount(data.amount);
                setDataAvailable(true);
            } else {
                setDataAvailable(false);
            }
            } else {
            console.error('Failed to fetch amount data');
            }
        } catch (error) {
            console.error('Error fetching amount data:', error);
        }
        };

        fetchData();
    }, []);

    const [incomeData, setIncomeData] = useState([]);

    useEffect(() => {
        const fetchIncomeData = async () => {
            try {
                const response = await fetch('/api/show/income');
                if (response.ok) {
                    const data = await response.json();
                    setIncomeData(data);
                } else {
                    console.error('Failed to fetch income data');
                }
            } catch (error) {
                console.error('Error fetching income data:', error);
            }
        };

        fetchIncomeData();
    }, []);

    const [ExpenseData, setExpenseData] = useState([]);

    useEffect(() => {
        const fetchExpenseData = async () => {
            try {
                const response = await fetch('/api/show/expense');
                if (response.ok) {
                    const data = await response.json();
                    setExpenseData(data);
                } else {
                    console.error('Failed to fetch expense data');
                }
            } catch (error) {
                console.error('Error fetching expense data:', error);
            }
        };

        fetchExpenseData();
    }, []);

  return (
    <div>
        <Navbar />
        <div className='centered-container'>
            <h1 style={{ textAlign: 'center', fontSize: '40px', color: 'white' }}>Expense Tracker</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className='blue-glassmorphism' style={{ marginRight: 'auto' , height: 'auto'}}>
                <h1 style={{ fontSize: '40px', color: 'black', marginTop: 0}}>Income</h1>
                <form onSubmit={handleIncome}>
                    <input type="number" name="money" placeholder='Amount' value={formData.money} onChange={handleChange} />
                    <br />
                    <input type="text" name="party" placeholder='From' value={formData.party} onChange={handleChange} />
                    <br />
                    <input type="text" name="desc" placeholder='Description' value={formData.desc} onChange={handleChange} />
                    <br />
                    <button type="submit" className='custom-button'>Submit</button>
                </form>
            </div>
                <div className='blue-glassmorphism' style={{ alignItems: 'center'}}>
                    <h1 style={{ fontSize: '30px', color: 'grey', margin: 0}}>Total Remaining Budget</h1>
                    {dataAvailable ? <h1 style={{ fontSize: '40px', color: 'black', marginBottom: 0}}> {amount}</h1> : <p>No amount data available</p>}
                </div>
            <div className='blue-glassmorphism' style={{ marginLeft: 'auto' }}>
                <h1 style={{ fontSize: '40px', color: 'black', marginTop: 0}}>Expense</h1>
                <form onSubmit={handleExpense}>
                    <input type="number" name="money" placeholder='Amount' value={formData.money} onChange={handleChange} />
                    <br />
                    <input type="text" name="party" placeholder='To' value={formData.party} onChange={handleChange} />
                    <br />
                    <input type="text" name="desc" placeholder='Description' value={formData.desc} onChange={handleChange} />
                    <br />
                    <button type="submit" className='custom-button'>Submit</button>
                </form>
            </div>
        </div>
        <br />
        <div style={{display:'flex', justifyContent: 'space-around'}}>
            {incomeData.length > 0 && ( 
            <div className='blue-glassmorphism' style={{ marginLeft: 'auto', marginRight:'auto', marginBottom: '20px', padding: '20px', width: '80%', borderRadius: '10px', maxWidth: "18rem"}}>
                <h1 style={{ fontSize: '30px', color: 'grey', margin: 0 }}>Income Table</h1>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '2px solid black'}}>Amount</th>
                            <th style={{ border: '2px solid black'}}>From</th>
                            <th style={{ border: '2px solid black'}}>Description</th>
                            <th style={{ border: '2px solid black'}}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incomeData.map((incomeItem) => (
                            <tr key={incomeItem.id}>
                                <td style={{ border: '2px solid black',}}><b>{incomeItem.money}</b></td>
                                <td style={{ border: '2px solid black' }}><b>{incomeItem.party}</b></td>
                                <td style={{ border: '2px solid black' }}><b>{incomeItem.desc}</b></td>
                                <td style={{ border: '2px solid black' }}><b>{new Date(incomeItem.posting_date).toLocaleDateString('en-GB')}</b></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             )}
             {ExpenseData.length > 0 && (
            <div className='blue-glassmorphism' style={{  marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px', padding: '20px', width: '80%', borderRadius: '10px', maxWidth: "18rem"}}>
                <h1 style={{ fontSize: '30px', color: 'grey', margin: 0 }}>Expenses Table</h1>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '2px solid black' }}>Amount</th>
                            <th style={{ border: '2px solid black' }}>To</th>
                            <th style={{ border: '2px solid black' }}>Description</th>
                            <th style={{ border: '2px solid black' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ExpenseData.map((expenseItem) => (
                            <tr key={expenseItem.id}>
                                <td style={{ border: '2px solid black',}}><b>{expenseItem.money}</b></td>
                                <td style={{ border: '2px solid black' }}><b>{expenseItem.party}</b></td>
                                <td style={{ border: '2px solid black' }}><b>{expenseItem.desc}</b></td>
                                <td style={{ border: '2px solid black' }}><b>{new Date(expenseItem.posting_date).toLocaleDateString('en-GB')}</b></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )} 
        </div>
    </div>
  );
};

export default Expenses;
