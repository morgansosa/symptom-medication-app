# Symptom & Medication Tracker

A small full-stack app for logging symptoms, managing medications, and (eventually) generating a summary to bring to a doctor's appointment. Built as a personal project to learn how authentication, document databases, and third-party API integration actually work end to end.

**Stack:** Node.js, Express, MongoDB (Mongoose), JSON Web Tokens, bcrypt, React, Axios. Medication lookup uses the [openFDA drug label API](https://open.fda.gov/apis/drug/label/).

## What's built

**API** (`src/`)

- **Auth:** register and login with bcrypt-hashed passwords; JWT issued on success and verified by middleware on every protected route (`x-auth-token` header).
- **Users:** get and update the current user's profile; duplicate-email checks on register and update.
- **Symptoms:** create, list, update, delete. Every record is scoped to the owning user, and update/delete verify ownership.
- **Medications:** create, list, update, delete, plus set a reminder time and "mark as taken" (logs a timestamp and decrements remaining quantity). Scoped to the owning user like symptoms.
- **Medication search:** `GET /api/medications/suggestions?query=...` proxies openFDA with wildcard and fuzzy (`~`) matching, so users can find a medication without spelling it exactly. On create, the entered name is normalized against openFDA's brand/generic name.

**Client** (`client/`)

React app with register/login, protected routes, a profile page, symptom log and list, medication add/list with inline editing, reminders, and a notification bar.

## Not built (and probably won't be)

- The analytics layer this was originally for: grouping free-text symptoms into clusters with an LLM and producing a plain-language summary ("X occurred N times in the last 3 months, correlated with Y").
- Drug-interaction checks.
- Tests.
- Deployment. It runs locally against a MongoDB instance.

Last touched summer 2024. The API is in a usable state; the client works against it; the interesting part was never started.

## Running it

Requires Node.js and a MongoDB instance (local or Atlas).

```sh
git clone https://github.com/morgansosa/symptom-medication-app.git
cd symptom-medication-app
npm install
```

Create `.env` in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
PORT=5000
```

```sh
npm start                 # API on http://localhost:5000
cd client && npm install && npm start   # client on http://localhost:3000
```

## API summary

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/users/register` | no | create account, returns JWT |
| POST | `/api/users/login` | no | returns JWT |
| GET / PUT | `/api/users/me` | yes | read / update profile |
| GET / POST | `/api/symptoms` | yes | list / log a symptom |
| PUT / DELETE | `/api/symptoms/:id` | yes | update / delete (owner only) |
| GET | `/api/medications/suggestions?query=` | yes | fuzzy name lookup via openFDA |
| GET / POST | `/api/medications` | yes | list / add a medication |
| PUT / DELETE | `/api/medications/:id` | yes | update / delete (owner only) |
| PUT | `/api/medications/set-reminder/:id` | yes | set reminder time |
| PUT | `/api/medications/taken/:id` | yes | log a dose |

## Layout

```
src/
  server.js
  middleware/auth.js        JWT verification
  models/                   User, Symptom, Medication
  routes/                   users, symptoms, medications
client/src/
  components/               Login, Register, Profile, ProtectedRoute,
                            LogSymptom, SymptomList, EditSymptom,
                            AddMedication, MedicationList, Navbar, Notification
  utils/axiosConfig.js
```

## License

MIT. See [LICENSE](LICENSE).
