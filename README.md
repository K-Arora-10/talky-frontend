# Talky 🎥

**Talky** is a real-time video calling web application built using **WebRTC**. It allows two users to join a shared room and have a secure peer-to-peer video meeting via their browsers.

## 🔗 Live Demo
https://talkyy.netlify.app/

## 🛠 Tech Stack

- **Frontend:** ReactJS
- **Real-time Communication:** WebRTC
- **Signaling Server:** Socket.io + Node.js
- **Backend:** Express.js (for room management & signaling)

## 📌 Features

- 👥 One-on-one video calling
- 🔗 Room-based call joining via unique room IDs
- 📹 High-quality WebRTC-based peer-to-peer video streaming

## 🚀 How It Works

1. A user opens the app and enters a room ID.
2. If they’re the first, they wait for someone to join.
3. The second user joins the same room ID.
4. Both browsers exchange WebRTC offer/answer using a signaling server (via Socket.io).
5. A direct peer-to-peer connection is established for the video call.


## 🧑‍💻 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/talky.git
   cd talky
