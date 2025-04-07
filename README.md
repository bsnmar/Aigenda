# AIgenda: AI-Powered Task Management

AIgenda is an intelligent task management app that helps users efficiently organize, track, and complete their tasks. The goal is to combine clean UI with powerful task management to streamline productivity. The current version focuses on core task management features with upcoming releases introducing AI capabilities such as intelligent priorisation, smart scheduling and natural language task input.

## Features
### Core Features (First Phase)

+ Task Creation & Management
  + Create, edit, delete and mark tasks as completed
  + Set task description, due date and priority level
+ Task Organization
  + Categorize tasks into predefined categories like "Inbox", "Anytime", and "Someday"
  + Create custom areas and projects
  + Group project by area
  + Add recurring tasks and get reminders
+ Task Dashboard
  + A clean and simple dashboard displaying all active tasks
  + Visual indicators for project progress
+ Task filtering options by priority, due date, or category

### AI Features (Planned)
+ AI-powered task prioritisation based on urgency and deadlines
+ Smart task recommendations using historical data and patterns
+ Intelligent scheduling based on user productivity trends
+ Automatic breakdown of larger tasks into smaller tasks
+ Natural language task input

## Tech Stack
### Backend

+ Flask
+ Flask-SQLAlchemy
+ SQLite
+ Flask-CORS

### Frontend

+ React
+ Vite
+ TypeScript
+ Tailwind CSS
+ Fetch API/Axios

## Project Structure

```
/aigenda
  ├── /backend
  │     ├── /instance
  │     |     ├── tasks.db
  │     ├── app.py
  │     └── requirements.txt
  ├── /frontend
  │     ├── /src
  │     │     ├── /components
  │     │     ├── /pages
  │     │     ├── App.tsx
  │     │     └── main.tsx
  │     ├── index.html
  │     ├── tailwind.config.js
  │     └── package.json
```

## Design Decisions
+ Decided to build the core functionality first to make sure the foundations are strong and then implement AI to compliment workflows rather than build workflows around AI
+ Multiple database tables help scale better than a single table

## Progress
### Completed
+ API and database
+ Core data models: Areas, Projects, Tasks, Subtasks
+ Area and project creation, editing and deletion
+ Task creation, editing, scheduling and categorisation
+ Frontend setup with Vite, React + TypeScript + Tailwind
+ Basic UI for managing tasks

### In progress/upcoming
+ Add and manage tasks from frontend
+ Add and manage areas and projects from frontend
+ Recurring tasks and reminders
+ Mobile friendly design
+ AI integration

### Known issues
+ All tasks are automatically categorised as Inbox
  + Should only go in inbox if it doesn't belong to a project
+ Frontend is communicating with backend/database directly and is exposing the api calls
  + Malicious actor could gain access to sensitive information
+ When updating areas, projects, tasks or subtasks the entire row in the table updates
  + Should only update fields that have changed
+ TypeScript errors
+ Having to delete and remake database anytime a database model changes
+ Project progress indicator not working on project page
