![CityStories Logo](https://github.com/DianaHutuleac/MSA-Project/blob/main/city-stories-logo.png)

# CityStories - Pin your memories

## Overview

CityStories is a unique mobile application that lets users capture and share their personal memories, stories, and experiences by placing pins on a digital map of Timișoara. Users can anonymously mark locations where meaningful moments happened, leave personal notes and even reply to others’ pins. The app encourages community interaction through shared memories while allowing users to remain private.

## Initial Features

- Pin Your Memories: Add memory pins to specific locations on the map, along with personal notes or stories that highlight your experiences in the city.
- Anonymous Sharing: Users can post memories and stories without revealing their identity, fostering an environment of openness while maintaining privacy.
- Explore the City’s Stories: Discover new and hidden stories as you explore Timișoara’s digital map, populated with pins shared by others in the community.
- Likes and Comments: Show your appreciation for a memory by liking a pin or engage in conversation by leaving comments.
- Pin of the Week: Each week, the pin with the most likes will be featured on the map, giving it special recognition and allowing everyone to revisit the story that has captivated the community.
- Customize Pin Visibility: Choose how long your memory stays on the map – from 24 hours to permanent visibility.
- Community Challenges: Participate in fun and engaging challenges by sharing pins that follow a theme, like "My First Visit" or "Hidden Gems of Timișoara."
- Track Your Pins: Keep track of your contributions, view how many likes and replies your pins have received, and check out your personal collection of memories.
- Moderation Tools: Users can report or flag inappropriate content to ensure that CityStories remains a safe and welcoming space for everyone.

### Database Structure

![Database Schema](https://github.com/DianaHutuleac/MSA-Project/blob/main/citystories_db.png)


# CityStories API Endpoints V1
## Authentication

### User Registration
- **POST** `/users/register`
    - **Request Body:**
      ```json
      {
        "email": "user@example.com",
        "password": "yourPassword"
      }
      ```
    - **Responses:**
        - `201 Created`: User successfully registered.
        - `400 Bad Request`: Validation errors.

### User Login
- **POST** `/users/login`
    - **Request Body:**
      ```json
      {
        "email": "user@example.com",
        "password": "yourPassword"
      }
      ```
    - **Responses:**
        - `200 OK`: Login successful.
        - `401 Unauthorized`: Invalid credentials.

### Get User Details
- **GET** `/users/{id}`
    - **Responses:**
        - `200 OK`: User details retrieved.
        - `404 Not Found`: User not found.

---

## Pins

### Create a Pin
- **POST** `/pins`
    - **Request Body:**
      ```json
      {
        "story": "Your story here...",
        "visibility_duration": "24 hours",
        "user_id": 1
      }
      ```
    - **Responses:**
        - `201 Created`: Pin successfully created.
        - `400 Bad Request`: Validation errors.

### Get All Pins
- **GET** `/pins`
    - **Responses:**
        - `200 OK`: List of all pins.

### Get Pin by ID
- **GET** `/pins/{id}`
    - **Responses:**
        - `200 OK`: Pin details retrieved.
        - `404 Not Found`: Pin not found.

### Get Pin of the Week
- **GET** `/pins/pinoftheweek`
    - **Responses:**
        - `200 OK`: Pin of the week retrieved.

---

## Comments

### Create a Comment For a Pin.
- **POST** `/comments`
    - **Request Body:**
      ```json
      {
        "content": "Your comment here...",
        "pin_id": 1
      }
      ```
    - **Responses:**
        - `201 Created`: Comment successfully created.
        - `400 Bad Request`: Validation errors.

### Get Comments For a Specific Pin by its ID.
- **GET** `/comments?pinId={pinId}`
    - **Responses:**
        - `200 OK`: List of comments for the specified pin.
---

