# Student Management Web App

**Live Demo:** [https://kba-project.vercel.app/](https://kba-project.vercel.app/)

This is a simple React and Express web application built to manage student records. It allows you to add new students, edit their profiles, delete them, and search/filter through your database records.

We connect the backend server to MongoDB Atlas (a cloud database) to store all the student data securely.

---

## What this app does:
* **Add Students**: Enter a student's ID, Name, Department, Year, Email, and CGPA. The form validates your inputs (e.g., checking for valid email formats and making sure the CGPA is between 0 and 10).
* **View & Search**: View all students in a clean list. You can search by name, email, or ID, filter by department or year, and sort them.
* **Edit Profiles**: Edit a student's name, department, year, email, or CGPA. The Student ID is treated as a unique primary key and cannot be edited.
* **Delete Profiles**: Safely remove a student profile from the database.
* **Themes**: Easily switch between light and dark modes.

---

## How to Set It Up and Run It

To run this project on your machine, you need **Node.js** and a **MongoDB** database. Since we configured it to connect to your MongoDB Atlas cloud database, you just need to follow these steps:

### 1. Run the Backend API

The backend server is built using Node.js and Express. It connects to your MongoDB cloud cluster and runs on port `5001`.

1. Open your terminal and go to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the server dependencies:
   ```bash
   npm install
   ```
3. Set your MongoDB connection:
   * We already saved your remote Atlas connection string inside the `backend/.env` file. You can check it or update it anytime:
     ```env
     PORT=5001
     MONGO_URI=mongodb+srv://geethask:geethask@cluster0.4ntqd0u.mongodb.net/student_db?retryWrites=true&w=majority&appName=Cluster0
     ```
4. Start the backend:
   ```bash
   npm run dev
   ```
   *You should see a message saying:* `Server started on port 5001` and `MongoDB Connected`.

---

### 2. Run the React Frontend

The frontend is a React application built with Vite.

1. Open a **new terminal tab or window** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the React packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the link displayed in your terminal (usually `http://localhost:5173`) in your web browser. You can now use the interface to manage your student database.

---

## Project Folder Structure

Here is a quick look at how the code is organized:

```
kba-project/
├── backend/                  # Express server and database logic
│   ├── config/
│   │   └── db.js             # Connects to MongoDB
│   ├── models/
│   │   └── Student.js        # Defines what a student record looks like
│   ├── routes/
│   │   └── students.js       # All API routes (add, edit, delete, view)
│   ├── .env                  # Your secret config (MongoDB URL, port)
│   ├── server.js             # Main server file, starts everything up
│   └── package.json
│
├── frontend/                 # React web interface
│   ├── src/
│   │   ├── components/
│   │   │   ├── StudentForm.jsx    # The form for adding/editing a student
│   │   │   ├── StudentList.jsx    # Table view showing all students
│   │   │   └── ThemeToggle.jsx    # Light/dark mode button
│   │   ├── App.jsx               # Main app that ties everything together
│   │   ├── config.js             # Points frontend to the backend API
│   │   └── index.css             # All the styling
│   └── package.json
│
└── README.md                 # This file
```

---

## API Endpoints (for reference)

These are the routes that the frontend uses to talk to the backend:

| Method | Endpoint | What it does |
|--------|----------|--------------|
| GET | `/api/students` | Fetch all students |
| GET | `/api/students/:id` | Get one student by their ID |
| POST | `/api/students` | Add a new student |
| PUT | `/api/students/:id` | Update a student's details |
| DELETE | `/api/students/:id` | Remove a student |

---

## Submitting to GitHub

To push this project to your GitHub repository, follow these steps:

1. Go to [github.com](https://github.com) and create a new repository called `kba-project`.

2. In your terminal, go to the project root folder and run these commands one by one:
   ```bash
   cd /Users/sanjeys/Desktop/kba-project
   git init
   git add .
   git commit -m "Initial commit - Student Management Web App"
   git branch -M main
   git remote add origin https://github.com/<your-username>/kba-project.git
   git push -u origin main
   ```
   *(Replace `<your-username>` with your actual GitHub username.)*

3. Make sure the `.env` file is **not pushed to GitHub** as it contains your database password. A `.gitignore` file should be added to prevent this. Create a file called `.gitignore` in the `backend/` folder with this content:
   ```
   node_modules/
   .env
   ```
   And another `.gitignore` in the `frontend/` folder:
   ```
   node_modules/
   dist/
   ```
# kba-project
# kba-project
