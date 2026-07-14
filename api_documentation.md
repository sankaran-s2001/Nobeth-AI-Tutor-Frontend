# Nobeth AI Tutor: Frontend-Friendly API Reference & Integration Guide

This guide is designed to help frontend developers (and AI assistants) build the interface for the Nobeth AI Tutor application. It maps the APIs to the 4 primary UI screens, defines the request/response payloads, outlines the required global state, and highlights frontend-specific rendering requirements (such as LaTeX math and SVG diagrams).

---

## 1. Global Authentication & Header Management

All endpoints under the **Authenticated** sections require the client to supply a JSON Web Token (JWT) in the request headers:

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Auth Flow & Token Storage Strategy:
1. **Login**: Collect credentials via the login form, make a `POST /api/auth/login` request, and receive the JWT token.
2. **Storage**: Save the token securely in the frontend client (e.g., `localStorage.setItem('auth_token', token)` or secure HTTP cookies).
3. **State Initialization**: Upon app launch, read the stored token. If it exists, call `GET /api/auth/me` to populate the user profile state. If it returns a `403 Forbidden` (token expired), clear storage and redirect the user to the login screen.
4. **Logout**: Call `POST /api/auth/logout` to notify the server, clear `auth_token` from local storage, and reset the application state.

---

## 2. Global State Mapping for Frontend Client

To manage the app state across screens, initialize the following states in your frontend store (e.g., Redux, Pinia, React Context, or Vue composition state):

| State Variable | Data Type | Populated By API | Modified By API | Screens Utilizing |
| :--- | :--- | :--- | :--- | :--- |
| `token` | String | `POST /api/auth/login` | `POST /api/auth/logout` | All (header injection) |
| `currentUser` | Object | `GET /api/auth/me` | `PUT /api/auth/me` | Sidebar, Settings, Dashboard |
| `currentClass` | String / Int | `GET /api/auth/me` | `PUT /api/auth/me` | Sidebar Header, All Screens |
| `dashboardStats` | Object | `GET /api/dashboard/stats` | `POST /api/dashboard/log-study` | Dashboard View |
| `chatSessions` | Array | `GET /api/chat/sessions` | `POST /api/chat/session/create`<br>`POST /api/chat/session/<id>/pin` | Sidebar Chat List, AI Chat View |
| `activeSessionId` | String | User list selection | `POST /api/chat/session/create` | AI Chat View, URL Routing |
| `activeChatHistory`| Array | `GET /api/chat/session/<id>`| `POST /api/chat/session/<id>/query` | AI Chat View Pane |

---

## 3. Screen-by-Screen API Specifications

### SCREEN 1: Authentication & Onboarding View
Contains the login page where users select their class and submit credentials.

#### 1. Login Endpoint
- **HTTP Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Request Payload**:
  ```json
  {
    "email": "sankaran@gmail.com",
    "password": "securepass",
    "grade": "8"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "fullName": "Sankaran S",
      "email": "sankaran@gmail.com",
      "role": "student",
      "studentClass": {
        "grade": "8"
      }
    }
  }
  ```
- **Common Errors**:
  - `400 Bad Request`: Email/password missing or not strings.
  - `401 Unauthorized`: Invalid email or password.

#### 2. Forgot Password (Request OTP)
- **HTTP Method**: `POST`
- **Endpoint**: `/api/auth/forgot-password`
- **Request Payload**:
  ```json
  {
    "email": "sankaran@gmail.com"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "If an account matches this email, a reset code has been sent."
  }
  ```
  *(Note: A generic response is returned to prevent email enumeration attacks).*

#### 3. Reset Password (Verify OTP)
- **HTTP Method**: `POST`
- **Endpoint**: `/api/auth/reset-password`
- **Request Payload**:
  ```json
  {
    "email": "sankaran@gmail.com",
    "code": "489201",
    "new_password": "newsecurepass123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Password has been reset successfully."
  }
  ```
- **Common Errors**:
  - `400 Bad Request`: Invalid or expired OTP verification code.

---

### SCREEN 2: Dashboard View
Displays progress stats, streak logs, target weekly goals progress, and last active chat sessions.

#### 1. Retrieve Dashboard Details
- **HTTP Method**: `GET`
- **Endpoint**: `/api/dashboard/stats`
- **Response (200 OK)**:
  ```json
  {
    "fullName": "Sankaran S",
    "classGrade": "8",
    "stats": {
      "totalChats": 24,
      "totalStudyTime": 332,
      "questionsAsked": 156,
      "accuracy": 96
    },
    "weeklyProgress": {
      "Mon": 42,
      "Tue": 38,
      "Wed": 51,
      "Thu": 45,
      "Fri": 47,
      "Sat": 32,
      "Sun": 0
    },
    "streak": {
      "currentStreak": 7
    },
    "goals": {
      "targetHours": 6,
      "completedMins": 255
    },
    "lastChat": {
      "sessionId": "5b36e18c-c0b5-4880-8c3b-c951535ea7ba",
      "title": "What is photosynthesis? Explain the process in detail.",
      "grade": "8",
      "subject": "Science",
      "updatedAt": "2026-07-09T10:13:25Z"
    }
  }
  ```
- **Frontend Mapping Tips**:
  - Convert `stats.totalStudyTime` to hours and minutes (e.g., `332` minutes $\rightarrow$ `5h 32m`) for display.
  - Draw the daily minutes on the streak checklist chart from `weeklyProgress`.
  - Encompass the weekly study progress percentage for the progress bar:
    $$\text{Progress \%} = \min\left(100, \frac{\text{goals.completedMins}}{\text{goals.targetHours} \times 60} \times 100\right)$$

#### 2. Log Study Time
- **HTTP Method**: `POST`
- **Endpoint**: `/api/dashboard/log-study`
- **Request Payload**:
  ```json
  {
    "duration_minutes": 20,
    "activity_type": "chat"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Successfully logged 20 minutes of study.",
    "todayMinutes": 71,
    "streak": 7
  }
  ```
  *(Note: This updates database records asynchronously using Celery to ensure high performance and prevent lock collisions).*

#### 3. Update Weekly Study Goal
- **HTTP Method**: `POST`
- **Endpoint**: `/api/dashboard/goals`
- **Request Payload**:
  ```json
  {
    "target_weekly_hours": 8
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Weekly target hours successfully updated.",
    "targetWeeklyHours": 8
  }
  ```
- **Common Errors**:
  - `400 Bad Request`: target value is negative, non-numeric, or exceeds 168 (total hours in a week).

---

### SCREEN 3: Settings View
Allows users to manage profiles, change passwords, select theme preferences, and logout.

#### 1. Get Settings Profile Data
- **HTTP Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Response (200 OK)**:
  ```json
  {
    "fullName": "Sankaran S",
    "email": "sankaran@gmail.com",
    "studentClass": {
      "grade": "8"
    }
  }
  ```

#### 2. Update Profile Settings
- **HTTP Method**: `PUT`
- **Endpoint**: `/api/auth/me`
- **Request Payload**:
  ```json
  {
    "fullName": "Sankaran Muthu",
    "grade": "8"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Profile updated successfully.",
    "user": {
      "fullName": "Sankaran Muthu",
      "email": "sankaran@gmail.com",
      "studentClass": {
        "grade": "8"
      }
    }
  }
  ```

#### 3. Change Account Password
- **HTTP Method**: `POST`
- **Endpoint**: `/api/auth/change-password`
- **Request Payload**:
  ```json
  {
    "current_password": "securepass",
    "new_password": "newsecurepass123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Password changed successfully."
  }
  ```
- **Common Errors**:
  - `400 Bad Request`: Wrong current password.

#### 4. Sign Out
- **HTTP Method**: `POST`
- **Endpoint**: `/api/auth/logout`
- **Response (200 OK)**:
  ```json
  {
    "message": "Successfully logged out. Please discard your authorization token."
  }
  ```

---

### SCREEN 4: AI Chat & Tutor Workspace
Houses the chat sidebar, past history list, query interface, diagram displays, and references.

#### 1. Create Session
- **HTTP Method**: `POST`
- **Endpoint**: `/api/chat/session/create`
- **Request Payload**:
  ```json
  {
    "title": "What is photosynthesis? Explain the process in detail."
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "Chat session created successfully.",
    "sessionId": "5b36e18c-c0b5-4880-8c3b-c951535ea7ba",
    "title": "What is photosynthesis? Explain the process in detail."
  }
  ```

#### 2. Fetch Session History Lists
- **HTTP Method**: `GET`
- **Endpoint**: `/api/chat/sessions`
- **Filters/Query Parameters**:
  - `q` (Optional string): Search query to filter session titles (case-insensitive).
- **Response (200 OK)**:
  ```json
  [
    {
      "sessionId": "5b36e18c-c0b5-4880-8c3b-c951535ea7ba",
      "title": "What is photosynthesis? Explain the process in detail.",
      "grade": "8",
      "subject": "Science",
      "pinned": true,
      "updatedAt": "2026-07-09T10:13:25Z"
    }
  ]
  ```
  *(Note: The server returns this list pre-sorted by pinned status first, then by updatedAt recency).*

#### 3. Toggle Session Pinned Status
- **HTTP Method**: `POST`
- **Endpoint**: `/api/chat/session/<id>/pin`
- **Response (200 OK)**:
  ```json
  {
    "message": "Session pinned successfully.",
    "pinned": true
  }
  ```

#### 4. Get Conversation Logs
- **HTTP Method**: `GET`
- **Endpoint**: `/api/chat/session/<id>`
- **Response (200 OK)**:
  ```json
  {
    "sessionId": "5b36e18c-c0b5-4880-8c3b-c951535ea7ba",
    "title": "What is photosynthesis? Explain the process in detail.",
    "grade": "8",
    "subject": "Science",
    "pinned": true,
    "messages": [
      {
        "query": "What is photosynthesis? Explain the process in detail.",
        "response": "Photosynthesis is the process used by green plants...",
        "sources": [
          {
            "subject": "Science",
            "chapter": "Crop Production and Management",
            "pageNumber": "29",
            "snippet": "Chlorophyll in the leaves absorbs sunlight..."
          }
        ],
        "diagram": null,
        "timestamp": "2026-07-09T10:13:25Z"
      }
    ]
  }
  ```

#### 5. Submit Query to AI Tutor (RAG Pipeline)
- **HTTP Method**: `POST`
- **Endpoint**: `/api/chat/session/<id>/query`
- **Request Payload**:
  ```json
  {
    "query": "What is photosynthesis? Explain the process in detail."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "response": "Photosynthesis is the process used by green plants to make their own food. It uses sunlight, carbon dioxide, and water to produce glucose (food) and oxygen.\n\nProcess of Photosynthesis:\n1. Absorption of Light: Chlorophyll in the leaves absorbs sunlight.\n2. Absorption of Water: Roots absorb water from the soil and transport it to the leaves.\n3. Absorption of Carbon Dioxide: Plants take in carbon dioxide from the air through small pores called stomata on the leaves.\n4. Food Formation: In the presence of sunlight and chlorophyll, water and carbon dioxide are converted into glucose (food).\n5. Release of Oxygen: Oxygen is released into the air through the stomata.\n\nThe overall equation for photosynthesis is:\n\n$$6CO_2 + 6H_2O \\xrightarrow{\\text{sunlight/chlorophyll}} C_6H_{12}O_6 + 6O_2$$",
    "sources": [
      {
        "subject": "Science",
        "chapter": "Crop Production and Management",
        "pageNumber": "29",
        "snippet": "Photosynthesis is the process used by green plants..."
      }
    ],
    "diagram": {
      "type": "svg",
      "title": "Photosynthesis process",
      "content": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 200\"><rect width=\"100%\" height=\"100%\" fill=\"#f9f9f9\"/><circle cx=\"200\" cy=\"100\" r=\"80\" fill=\"#85e3b2\"/><text x=\"200\" y=\"105\" font-family=\"sans-serif\" font-size=\"14\" text-anchor=\"middle\" fill=\"#1e293b\">Photosynthesis Process</text></svg>"
    }
  }
  ```

---

## 4. Frontend Rendering Rules & Guidelines

### A. Math & LaTeX Equation Rendering
The LLM response contains LaTeX notation for math equations:
- **Inline Equations**: Wrapped in single dollar signs, e.g. `$x^2 + y^2 = z^2$`.
- **Block Equations**: Wrapped in double dollar signs, e.g. `$$6CO_2 + 6H_2O \rightarrow C_6H_{12}O_6 + 6O_2$$`.

* **Frontend Guideline**: Integrate **KaTeX** or **MathJax** in the markdown rendering pipeline. If using React, use `react-markdown` with `remark-math` and `rehype-katex` plugins. If using Vue, apply a custom directive that parses text nodes and runs `katex.render()`.

### B. Diagram Rendering Pipeline
When `diagram` object is present in a response payload (not null):
- **SVG rendering**:
  - If `diagram.type === "svg"`, render the content dynamically inside the DOM.
  - *React Example*: `<div dangerouslySetInnerHTML={{ __html: diagram.content }} />`.
  - *Vue Example*: `<div v-html="diagram.content"></div>`.
- **Image rendering**:
  - If `diagram.type === "image"` (e.g. Cloudinary assets), render a standard image tag using the content URL: `<img src={diagram.content} alt={diagram.title} />`.

### C. Prompt Injection Safeguards
If a student inputs a prompt injection query, the server immediately returns a standard helpful response (`"I am a school AI tutor, and I can only help you..."`) in `< 0.1ms`. The frontend should display this response in the dialogue pane normally.

### D. Optimizing Input Query Actions
- **Debounce Searches**: Apply a `300ms` debounce to search query actions on the sidebar chat filter to prevent overloading server queries.
- **Immediate State Injection (Optimistic Updates)**: When the user logs study time or submits a query, update the local UI chat history array with the user message immediately before the network response completes.
