# DOXY - Advanced Telemedicine Platform

DOXY is a modern, secure, and feature-rich telemedicine application built with the MERN stack (MongoDB, Express, React, Node.js). It enables seamless video consultations, appointment management, and digital prescriptions between patients and doctors.

## 🚀 Features

### For Patients
-   **Find Doctors**: Browse doctors by specialization and view detailed profiles.
-   **Video Consultations**: Secure, high-quality HD video calls using WebRTC.
-   **Dashboard**: Track upcoming appointments and view history.
-   **Prescriptions**: Access digital prescriptions issued by doctors instantly.
-   **Profile Management**: Update personal health details and contact info.
-   **Real-time Updates**: Functionality to see live status changes of appointments.

### For Doctors
-   **Appointment Management**: Accept/Reject booking requests and view daily schedules.
-   **Video Consultations**: Built-in video interface for remote checkups.
-   **Digital Prescriptions**: Write and send prescriptions directly to patients.
-   **Schedule Management**: Set availability slots (Coming Soon).
-   **Analytics**: View patient statistics and upcoming load.

## 🛠️ Technology Stack

-   **Frontend**: React (Vite), Tailwind CSS, Framer Motion, ShadCN UI, Socket.io-client, Simple-Peer.
-   **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io.
-   **Authentication**: JWT (JSON Web Tokens) with secure HTTP-only cookies.
-   **Real-time Communication**: Socket.io for signaling, WebRTC for p2p video/audio.

## 📦 Installation & Setup

### Prerequisites
-   Node.js (v14+)
-   MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/doxy.git
cd doxy
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder and install dependencies:
```bash
cd frontend
npm install
```

Start the React development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🧪 Usage

1.  **Register**: Create a Patient account to book appointments or a Doctor account to manage patients.
2.  **Book**: Patients can browse the doctor list and click "Book Appointment".
3.  **Manage**: Doctors log in to their dashboard to "Accept" requests.
4.  **Connect**: At the scheduled time, the "Start Call" button appears for the doctor, and "Join Call" for the patient.

## 🛡️ Security

-   Password hashing with Bcrypt.
-   Protected routes for authenticated users.
-   Role-based access control (Patient vs Doctor).
-   Sanitized user inputs.

## 📄 License

This project is licensed under the MIT License.
