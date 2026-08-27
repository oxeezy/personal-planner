# Personal Planner

A full-stack personal productivity web application for managing tasks, daily schedules, goals, and job applications.

## Features

- User registration and login
- Session-based authentication
- User-specific data isolation
- Protected application pages
- Task management
- Daily Planner
- Goal management
- Goal milestones
- Job Application Tracker
- Application status and priority tracking
- Automatic email reminders
- Upcoming task notifications
- Due-today task notifications
- Overdue task notifications
- Job interview reminders
- Job follow-up reminders
- User settings and theme preferences

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express.js
- Express Session
- MySQL

### Automation

- n8n
- Gmail

## Project Structure

```text
personal-planner/
│
├── backend/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── dailyPlanController.js
│   │   ├── goalController.js
│   │   ├── goalMilestoneController.js
│   │   ├── jobApplicationController.js
│   │   ├── settingsController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── DailyPlan.js
│   │   ├── Goal.js
│   │   ├── GoalMilestone.js
│   │   ├── JobApplication.js
│   │   ├── Task.js
│   │   ├── User.js
│   │   └── UserSettings.js
│   │
│   ├── routes/
│   │   ├── dailyPlanRoutes.js
│   │   ├── goalMilestoneRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── jobApplicationRoutes.js
│   │   ├── settingsRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── css/
│   │   ├── auth.css
│   │   ├── dailyplanner.css
│   │   ├── dashboard.css
│   │   ├── goals.css
│   │   ├── jobtracker.css
│   │   ├── planner.css
│   │   ├── settings.css
│   │   └── theme.css
│   │
│   └── js/
│       ├── authGuard.js
│       ├── dailyplanner.js
│       ├── dashboard.js
│       ├── goals.js
│       ├── jobtracker.js
│       ├── login.js
│       ├── navigation.js
│       ├── planner.js
│       ├── register.js
│       ├── settings.js
│       └── theme.js
│
├── dailyplanner.html
├── dashboard.html
├── goals.html
├── jobtracker.html
├── login.html
├── planner.html
├── register.html
├── settings.html
└── .gitignore