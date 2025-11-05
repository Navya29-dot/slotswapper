# 🕓 SlotSwapper  
### *Peer-to-Peer Time-Slot Swapping App*

---

## 🚀 Overview

**SlotSwapper** is a peer-to-peer scheduling app where users can mark their events as **swappable** and exchange them with others.  
It helps people coordinate meetings or focus blocks easily.

### 🎯 Key Features
- User authentication (JWT)
- Create / Update / Delete events
- Mark events as “Swappable”
- Request, Accept, or Reject swaps
- Simple HTML + JS frontend
- Node.js + Express backend

---

## 🧩 Design Choices

| Layer | Technology | Why |
|-------|-------------|-----|
| Frontend | HTML, CSS, JS | Light, quick to demo |
| Backend | Node.js + Express | Easy, fast API setup |
| Auth | JWT | Stateless auth |
| Storage | In-memory JS | Simplicity for prototype |

---

## 🏗️ Project Structure


---

## ⚙️ Setup & Run Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/slotswapper.git
cd slotswapper
2️⃣ Setup Backend
cd server
npm install
node server.js
3️⃣ Setup Frontend
cd web
npx serve .

Login Flow

Sign up → enter name, email, password

You’ll see: Signed in as <Your Name>

Create and make events swappable

Request swaps or accept others

🧩 API Endpoints
Method	Endpoint	Description
POST	/api/auth/signup	Create account
POST	/api/auth/login	Log in & get token
GET	/api/events	List my events
POST	/api/events	Create new event
POST	/api/events/:id/make-swappable	Mark event swappable
GET	/api/swappable-slots	List other users’ swappables
POST	/api/swap-request	Request swap
GET	/api/requests	View all requests
POST	/api/swap-response/:requestId	Accept/Reject request

---

### 🧩 Step 4: Save the file

Press **Ctrl + S** (or **Cmd + S** on Mac).

---

### 🧩 Step 5: Add it to Git and push to GitHub

Now in VS Code Terminal, run these commands:

```bash
git add README.md
git commit -m "Added README with project details"
git push
