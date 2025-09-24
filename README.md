# Event Management System

A full-stack event management application built with Next.js and FastAPI that allows users to create events and manage attendees.

## Features

- Create and manage events with location, date/time, and capacity
- Add and remove attendees for events
- Real-time filtering of events and attendees
- Responsive UI with dark mode support
- Pagination for attendee lists
- Input validation and error handling
- Time zone aware date/time handling

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- ShadCN UI
- Axios for API calls

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- Pydantic for validation
- Postgres DB

## Database Schema

```sql
-- Events Table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    max_capacity INTEGER NOT NULL
);

-- Attendees Table
CREATE TABLE attendees (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE (event_id, email)
);
```

## Setup Instructions

### Backend Setup
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings python-dotenv psycopg2-binary
```

3. Create `.env` file:
```
DATABASE_URL=postgresql://username:password@localhost:5432/events_db
```

4. Start the server:
```bash
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1/events
```

4. Start the development server:
```bash
npm run dev
```

## API Documentation

### Events

#### List Events
```bash
curl -X GET http://localhost:8000/api/v1/events
```

#### Create Event
```bash
curl -X POST http://localhost:8000/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Conference",
    "location": "Convention Center",
    "start_time": "2024-03-01T09:00:00Z",
    "end_time": "2024-03-01T17:00:00Z",
    "max_capacity": 100
  }'
```

#### Delete Event
```bash
curl -X DELETE http://localhost:8000/api/v1/events/{event_id}
```

### Attendees

#### List Event Attendees
```bash
curl -X GET http://localhost:8000/api/v1/events/{event_id}/attendees
```

#### Register Attendee
```bash
curl -X POST http://localhost:8000/api/v1/events/{event_id}/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

#### Remove Attendee
```bash
curl -X DELETE http://localhost:8000/api/v1/events/{event_id}/attendees/{attendee_id}
```


## Development

- Frontend runs on http://localhost:3000
- Backend API runs on http://localhost:8000
- API Swagger documentation available at http://localhost:8000/docs