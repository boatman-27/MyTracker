from flask import Flask, request, jsonify
from datetime import datetime
from firebase import firebase
import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate("../python-jobs-b64cb-firebase-adminsdk-8365y-947ad35936.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "Your_database_link"
})

# Firebase URL
firebase_url = 'https://python-jobs-b64cb-default-rtdb.firebaseio.com/'

# Initialize Firebase
firebase = firebase.FirebaseApplication(firebase_url, None)

app = Flask(__name__)

# Jobs Page

@app.route('/api/submit', methods=['GET', 'POST'])
def submit_form():
    if request.method == 'POST':
        data = request.json
        result = firebase.post('/jobs', data)
        return jsonify({'message': 'Form submitted successfully'})
    else:
        return jsonify({'message': 'Only POST requests are allowed for this endpoint'})
    
@app.route('/api/show_jobs', methods=['GET'])
def show_jobs():
    if request.method == 'GET':
        jobs_data = firebase.get('/jobs', None)
        return jsonify(jobs_data)
    else:
        return jsonify({'message': 'Only GET requests are allowed for this endpoint'})
    
@app.route('/api/delete_job', methods=['DELETE'])
def delete_job():
    if request.method == 'DELETE':
        data = request.get_json()
        job_id = data.get('id')
        firebase.delete('jobs/', job_id)
        return jsonify({'message': 'Job deleted successfully'})
   
@app.route('/api/job_accepted', methods=['PUT', 'POST'])
def job_accepted():
    if request.method == 'PUT':
        data = request.get_json()
        job_id = data.get('id')
        job_details = firebase.get('jobs/', job_id)
        
        if job_details:
            job_details['Status'] = 'Accepetd'
            firebase.post('/jobs', job_details)
            firebase.delete('jobs/', job_id)
            return jsonify({'message': 'WE GOT A JOB!!'})
        else:
            print("No such Job Found!")
            
@app.route('/api/job_rejected', methods=['PUT', 'POST'])
def job_rejected():
    if request.method == 'PUT':
        data = request.get_json()
        job_id = data.get('id')
        job_details = firebase.get('jobs/', job_id)
        
        if job_details:
            job_details['Status'] = 'Rejected'
            firebase.post('/jobs', job_details)
            firebase.delete('jobs/', job_id)
            return jsonify({'message': 'ON TO THE NEXT ONE!!'})
        else:
            print("No such Job Found!")

# Todos Page

@app.route('/api/submit/todos', methods=['GET', 'POST'])
def submit_todos():
    if request.method == 'POST':
        data = request.json
        result = firebase.post('/todos', data)
        return jsonify({'message': 'Form submitted successfully'})
    else:
        return jsonify({'message': 'Only POST requests are allowed for this endpoint'})

@app.route('/api/show_todos', methods=['GET'])
def show_todos():
    if request.method == 'GET':
        jobs_data = firebase.get('/todos', None)
        return jsonify(jobs_data)
    else:
        return jsonify({'message': 'Only GET requests are allowed for this endpoint'})

@app.route('/api/task_completed', methods=['PUT', 'POST'])
def task_completed():
    if request.method == 'PUT':
        data = request.get_json()
        job_id = data.get('id')
        job_details = firebase.get('todos/', job_id)
        
        if job_details:
            job_details['Status'] = 'Accepetd'
            firebase.post('/todos', job_details)
            firebase.delete('todos/', job_id)
            return jsonify({'message': 'WE DONE BOII!!'})
        else:
            print("No such task Found!")

# Expenses Page

@app.route('/api/expense/amount', methods=['GET', 'POST'])
def show_amount():
    if request.method == 'GET':
        expenses_data = firebase.get('/expenses', None)
        amount = expenses_data.get('amount', 0)
        response_data = {'amount': amount}  
        return jsonify(response_data)

@app.route('/api/expense/income', methods=['GET', 'PUT', 'POST'])
def add_income():
    if request.method == 'POST':
        data = request.json
        result = firebase.post('/expenses', data)
        expenses_data = firebase.get('/expenses', None)
        amount = expenses_data.get('amount', 0)
        amount += int(data['money'])
        firebase.put('/expenses', 'amount', amount)
        return jsonify({'message': 'Form submitted successfully'})
    else:
        return jsonify({'message': 'Only POST requests are allowed for this endpoint'})
    
@app.route('/api/expense/expense', methods=['GET', 'PUT', 'POST'])
def add_expense():
    if request.method == 'POST':
        data = request.json
        result = firebase.post('/expenses', data)
        expenses_data = firebase.get('/expenses', None)
        amount = expenses_data.get('amount', 0)
        amount -= int(data['money'])
        firebase.put('/expenses', 'amount', amount)
        return jsonify({'message': 'Form submitted successfully'})
    else:
        return jsonify({'message': 'Only POST requests are allowed for this endpoint'})
      
@app.route('/api/show/income', methods=['GET', 'PUT'])
def show_income():
    if request.method == 'GET':
        income_data = firebase.get('/expenses', None)
        income_entries = []

        if income_data:
            for _, entry_details in income_data.items():
                if isinstance(entry_details, dict) and entry_details.get('status') == 'Income':
                    income_entries.append(entry_details)

        print(income_entries)
        return jsonify(income_entries)
    
@app.route('/api/show/expense', methods=['GET', 'PUT', 'POST'])
def show_expense():
    if request.method == 'GET':
        expenses_data = firebase.get('/expenses', None)
        expenses_entries = []

        if expenses_data:
            for _, entry_details in expenses_data.items():
                if isinstance(entry_details, dict) and entry_details.get('status') == 'Expense':
                    expenses_entries.append(entry_details)

        print(expenses_entries)
        return jsonify(expenses_entries)
        
if __name__ == '__main__':
    app.run(debug=True)
