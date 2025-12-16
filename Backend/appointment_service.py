import json
from datetime import datetime, date
from typing import List, Dict, Optional

class AppointmentService:
    def __init__(self):
        self.appointments = self._create_mock_appointments()
    
    def _create_mock_appointments(self) -> List[Dict]:
        """Create mock appointment data simulating Aurora PostgreSQL fetch"""
        return [
            {
                "id": "1",
                "patientName": "Surender",
                "date": "2025-12-10",
                "time": "09:00 AM",
                "duration": 30,
                "doctorName": "Dr. Rakesh Kumar",
                "status": "Confirmed",
                "mode": "In-Person",
                "type": "Follow-up",
                "description": "Resume Diabetes Management",
                "patientEmail": "sarah@email.com"
            },
            {
                "id": "2",
                "patientName": "Satendra",
                "date": "2025-12-10",
                "time": "10:00 AM",
                "duration": 45,
                "doctorName": "Dr. Sandeep N",
                "status": "Scheduled",
                "mode": "In-Person",
                "type": "Consultation",
                "description": "Annual Physical Examination",
                "patientEmail": "michael@email.com"
            },
            {
                "id": "3",
                "patientName": "Dipti",
                "date": "2025-12-10",
                "time": "11:30 AM",
                "duration": 30,
                "doctorName": "Dr. Rohit Bhakar",
                "status": "Confirmed",
                "mode": "Video Call",
                "type": "Follow-up",
                "description": "Follow-up for Persistent Cough",
                "patientEmail": "emily@email.com"
            },
            {
                "id": "4",
                "patientName": "Vinay",
                "date": "2025-12-11",
                "time": "08:30 AM",
                "duration": 60,
                "doctorName": "Dr. Akhilesh Mathur",
                "status": "Upcoming",
                "mode": "In-Person",
                "type": "Consultation",
                "description": "Cardiology Consultation",
                "patientEmail": "robert@email.com"
            },
            {
                "id": "5",
                "patientName": "Mona Lisa",
                "date": "2025-12-11",
                "time": "02:00 PM",
                "duration": 45,
                "doctorName": "Dr. Akhilesh Mathur",
                "status": "Scheduled",
                "mode": "Video Call",
                "type": "Follow-up",
                "description": "Post-op Follow-up",
                "patientEmail": "lisa@email.com"
            },
            {
                "id": "6",
                "patientName": "David Miller",
                "date": "2025-12-08",
                "time": "10:00 AM",
                "duration": 30,
                "doctorName": "Dr. Sandeep N",
                "status": "Completed",
                "mode": "In-Person",
                "type": "Check-up",
                "description": "Routine Check-up",
                "patientEmail": "david@email.com"
            },
            {
                "id": "7",
                "patientName": "Maria",
                "date": "2025-12-06",
                "time": "03:30 PM",
                "duration": 60,
                "doctorName": "Dr. Rohit Bhakar",
                "status": "Completed",
                "mode": "In-Person",
                "type": "Consultation",
                "description": "Heart Condition Review",
                "patientEmail": "maria@email.com"
            },
            {
                "id": "8",
                "patientName": "James Taylor",
                "date": "2025-12-07",
                "time": "09:30 AM",
                "duration": 30,
                "doctorName": "Dr. Sandeep N",
                "status": "Cancelled",
                "mode": "Video Call",
                "type": "Follow-up",
                "description": "Medication Review",
                "patientEmail": "james@email.com"
            },
            {
                "id": "9",
                "patientName": "Jennifer Lawrence",
                "date": "2025-12-07",
                "time": "11:00 AM",
                "duration": 45,
                "doctorName": "Dr. Akhilesh Mathur",
                "status": "Upcoming",
                "mode": "In-Person",
                "type": "Consultation",
                "description": "New Patient Assessment",
                "patientEmail": "jennifer@email.com"
            },
            {
                "id": "10",
                "patientName": "Thomas Edison",
                "date": "2025-12-06",
                "time": "01:00 PM",
                "duration": 60,
                "doctorName": "Dr. Rohit Bhakar",
                "status": "Scheduled",
                "mode": "In-Person",
                "type": "Consultation",
                "description": "Cardiac Stress Test Review",
                "patientEmail": "thomas@email.com"
            }
        ]
    
    def get_appointments(self, date_filter: Optional[str] = None, 
                        status_filter: Optional[str] = None) -> List[Dict]:
        """
        Query function to filter appointments.
        
        GraphQL Query Structure (simulating AppSync):
        query GetAppointments($date: String, $status: String) {
            appointments(date: $date, status: $status) {
                id
                patientName
                date
                time
                duration
                doctorName
                status
                mode
                type
                description
                patientEmail
            }
        }
        """
        filtered = self.appointments
        
        if date_filter:
            filtered = [app for app in filtered if app["date"] == date_filter]
        
        if status_filter:
            filtered = [app for app in filtered if app["status"] == status_filter]
        
        return filtered
    
    def update_appointment_status(self, appointment_id: str, new_status: str) -> Dict:
        """
        Mutation function to update appointment status.
        
        GraphQL Mutation Structure:
        mutation UpdateAppointmentStatus($id: ID!, $status: String!) {
            updateAppointmentStatus(id: $id, status: $status) {
                id
                patientName
                status
                updatedAt
            }
        }
        
        In a real implementation with AWS AppSync and Aurora:
        1. This mutation would trigger an AppSync Subscription to notify all 
           subscribed clients of the status change in real-time
        2. The Aurora PostgreSQL would perform a transactional write ensuring
           ACID compliance
        3. The subscription would use WebSocket to push updates to frontend
        """
        for appointment in self.appointments:
            if appointment["id"] == appointment_id:
                appointment["status"] = new_status
                
                # Simulating real-time update timestamp
                appointment["updatedAt"] = datetime.now().isoformat()
                
                # In production: This would trigger AppSync subscription
                # AppSync.subscribe('appointmentUpdates', appointment)
                
                # In production: Aurora transactional write would ensure
                # data consistency across distributed systems
                # with transaction:
                #     update_appointment_in_db(appointment_id, new_status)
                #     log_status_change(appointment_id, new_status)
                
                return {
                    "success": True,
                    "message": f"Appointment {appointment_id} updated to {new_status}",
                    "appointment": appointment
                }
        
        return {"success": False, "message": "Appointment not found"}

# Singleton instance
appointment_service = AppointmentService()