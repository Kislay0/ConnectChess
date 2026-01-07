# ♟️ ChessConnect

**ChessConnect** is a strategic multiplayer board game that blends **chess-style piece movement** with a **connect-four–style win condition** on a compact 4×4 board.

The project focuses on **clean game architecture**, **real-time multiplayer**, and **polished UI/UX**, built entirely with modern frontend technologies.

---

## 🔗 Play Online

👉 **Live Demo:**
**[https://connect-chess.vercel.app/](https://connect-chess.vercel.app/)**

> Deployed on **Vercel** with a global CDN and HTTPS.

---

## 🎯 Game Objective

Be the first player to align **4 of your own pieces in a row**
(horizontally, vertically, or diagonally).

---

## 🕹️ How to Play

### Core Rules

1. **Possible Moves**

   * On your turn, you may:

     * Place a new piece from your inventory (if it isn't empty), **or**
     * Move an existing piece.

2. **Piece Movement (Chess-Inspired)**

   * **Pawn** – Moves forward, captures diagonally (direction flips at board edge instead of promotion)
   * **Rook** – Horizontal & vertical movement
   * **Knight** – L-shaped movement
   * **Bishop** – Diagonal movement

3. **Capturing**

   * Captured pieces return to the opponent’s inventory.

4. **Win Condition**

   * First player to connect **4 pieces** Vertically, Horizontally or Diagonally wins immediately.

---

## 🌐 Game Modes

### 🔵 Online Multiplayer (Real-Time)

* Create a **private room** and share a 6-character code
* Join a friend’s room instantly
* Real-time move synchronization using **Supabase Realtime**
* Automatic cleanup when players leave
* **Rematch system** with accept / reject flow
* Colors swap after rematch for fairness

### 🟢 Local Multiplayer

* Two players on the same device
* Turn-based play
* Ideal for quick offline matches

> 🤖 **AI Mode & Matchmaking**
> Planned future features. Architecture is designed to support them.

---

## ✨ Key Features

* ♞ Chess-style movement on a compact board
* 🎯 Connect-4-style win condition
* 🌐 Real-time online multiplayer
* 🔄 Rematch system with color swapping
* 🎨 Polished UI with clear turn indicators
* 🧠 Inventory-based gameplay (pieces are finite)
* 📱 Fully responsive (desktop & mobile)
* 🧹 Automatic room & data cleanup
* ⚡ No backend server required

---

## 🧩 Tech Stack

### Frontend

* **HTML5**
* **CSS3**
* **Vanilla JavaScript (ES Modules)**
* **HTML5 Canvas** (board rendering)

### Multiplayer / Backend

* **Supabase**

  * PostgreSQL database
  * Realtime subscriptions
  * Row Level Security (RLS)

### Hosting

* **Vercel**

  * Static deployment
  * Global CDN
  * HTTPS by default
  * GitHub CI/CD integration

---

## 🏗️ Architecture Overview

* **State-driven game logic**

  * Board, turn, inventory, win state are centralized
* **Pure rendering layer**

  * UI reacts to state changes
* **Event-driven multiplayer**

  * All actions are synchronized via Supabase
* **No trusted client**

  * All players receive the same action stream
* **Clean lifecycle handling**

  * Rooms and actions are deleted when games end

> Designed to scale cleanly to matchmaking and ranking systems.

---

## 🔐 Security Notes

* Supabase **anonymous public key** is intentionally exposed
* All security is enforced using **Row Level Security (RLS)**
* No sensitive credentials are stored on the client

---

## 🛠️ Local Development

```bash
git clone https://github.com/Kislay0/ConnectChess
cd ConnectChess
```

Open `index.html` in a browser
(or use a local server for best results).

To enable online multiplayer:

1. Create a Supabase project
2. Create `rooms` and `actions` tables
3. Enable Realtime + RLS
4. Replace Supabase keys in `supabase.js`

---

## 🚀 Future Enhancements

* 🤖 AI opponent
* 🎯 Skill-based matchmaking
* 👤 User accounts & ratings (ELO-style)
* 🔄 Board flipping for black player
* 🖱️ Drag-and-drop input
* 🎬 Match replays

---

## 📜 License

This project is open-source and intended for learning, experimentation, and portfolio use.

---

## 🙌 Acknowledgements

Inspired by chess, connect-four, and modern multiplayer web games.

---

### ♟️ ChessConnect

**Strategy. Simplicity. Real-Time Play.**

---
