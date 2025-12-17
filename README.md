# Technical Architecture & Backend Logic

This document outlines the schema design and server-side logic used to support the EMR Dashboard. The backend is implemented in Python (using a framework like FastAPI/Flask with Ariadne or Graphene), serving data via a GraphQL API.

# 1. GraphQL Query Structure: getAppointments

To efficiently populate the dashboard, I designed a flexible getAppointments query. Instead of creating multiple endpoints for filtering by date, status, or mode, I use a single query with optional arguments. This reduces over-fetching and allows the frontend to request exactly what it needs.

# Schema Definition

# GraphQL

enum AppointmentStatus {
  Confirmed
  Scheduled
  Upcoming
  Completed
  Cancelled
}

enum AppointmentMode {
  In_Person
  Video_Call
}

# type Appointment {

  id: ID!
  patientName: String!
  doctorName: String!
  date: String!        # Format: YYYY-MM-DD
  time: String!
  duration: Int
  status: AppointmentStatus!
  mode: AppointmentMode!
  type: String
  description: String
  patientEmail: String
}

# type Query {

  Fetches appointments based on optional filters. 
  If no filters are provided, returns all records (or paginated results).

  getAppointments(
    date: String
    status: AppointmentStatus
    mode: AppointmentMode
    searchQuery: String
  ): [Appointment]!
}

# Query Design Rationale

    Optional Filters: The arguments date, status, and mode are nullable. The resolver checks which arguments are present and dynamically constructs the SQL WHERE clause (e.g., using SQLAlchemy filters).

    Strong Typing: I used Enums for Status and Mode. This ensures the frontend cannot request or filter by invalid states, catching errors at the schema validation level before they reach the database logic.

    Scalability: The structure supports adding pagination arguments (limit, offset) in the future without breaking existing client implementations.

# 2. Python Backend & Data Consistency

Data consistency is critical in medical scheduling to prevent double bookings or invalid status transitions. Our Python resolvers implement several layers of safety during the updateAppointmentStatus mutation.

# -> The Update Logic (update_status function)

When a request to confirm or cancel an appointment is received, the backend executes the following workflow:

    1. Atomic Transactions (ACID Compliance): 

    The update operation is wrapped in a database transaction block (e.g., with db.session.begin():).

        If the update succeeds, the transaction commits.
        If any part fails (e.g., database connection loss, validation error), the transaction automatically rolls back, ensuring the database is never left in a partial state.

    2. State Transition Validation: 
    
    Before updating, the function checks if the transition is logical.

        Example: An appointment already marked Completed cannot be changed to Scheduled.

        Example: A Cancelled appointment cannot be Confirmed without rescheduling.

        If an invalid transition is attempted, the Python function raises a custom StateTransitionError which GraphQL returns as a readable error message to the client.

    3. Concurrency Control (Race Condition Handling): 
    
    To handle scenarios where two receptionists try to update the same appointment simultaneously, we use Row-Level Locking (e.g., SELECT ... FOR UPDATE).

        When the function fetches the appointment to update, it locks that specific row.

        Any other process trying to modify that row must wait until the first transaction finishes. This guarantees that the status read by the function is the absolute latest version before the write occurs

# Vercel Link -> https://emr-appointment-management-idw5.vercel.app/