"""
Flask API Server for Appointment Management
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from appointment_service import appointment_service

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    """API endpoint to get appointments with optional filtering"""
    date_filter = request.args.get('date')
    status_filter = request.args.get('status')
    
    appointments = appointment_service.get_appointments(date_filter, status_filter)
    return jsonify({"appointments": appointments})

@app.route('/api/appointments/<appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    """API endpoint to update appointment status"""
    data = request.json
    new_status = data.get('status')
    
    if not new_status:
        return jsonify({"error": "Status is required"}), 400
    
    result = appointment_service.update_appointment_status(appointment_id, new_status)
    
    if result["success"]:
        return jsonify(result), 200
    else:
        return jsonify(result), 404

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "Appointment Management API"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)