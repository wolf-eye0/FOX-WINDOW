# Vibecoding & Systems Engineering Learning Log

Welcome to the live development and educational log for our **Real-World Multiplayer AR Survival Horror Game**. 

This document serves as your progressive learning companion. For every tool installed, system configured, and architectural pattern chosen, this log breaks down **what** happened, **why** it was chosen, **how** it works under the hood, and **key engineering takeaways** so you build real skills while vibecoding.

---

## Log Entry 01: Android Platform Tools & ADB Setup

### 1. What Was Installed
- **Tool:** Google Android SDK Platform-Tools (Linux release, version 37.0.1).
- **Location:** `tools/platform-tools/` (specifically `tools/platform-tools/adb`).
- **Binary Check:** Run `./tools/platform-tools/adb version` to verify.

### 2. Why We Need It
In mobile AR development, building an app on a laptop and getting it onto physical phones for playtesting is a continuous loop. 
- You need a direct bridge between your Linux laptop and your Android test phone.
- **ADB (Android Debug Bridge)** is the universal command-line utility that allows you to:
  1. Detect connected phones via USB or local Wi-Fi.
  2. Inspect whether the phone has Google Play Services for AR installed (`adb shell pm list packages | grep arcore`).
  3. Stream real-time Android system logs (`adb logcat -s Unity`) to debug crashes, tracking drops, and memory leaks.
  4. Silently install and launch compiled `.apk` packages directly onto test phones with a single command.

### 3. How It Works Under the Hood
ADB operates on a **client-server-daemon architecture**:
```
+-------------------------------------------------------------+
|                        LAPTOP                               |
|  [ ADB Client (CLI) ] <---> [ ADB Server (Background Daemon)|
+------------------------------------------|------------------+
                                           | (USB / TCP Port 5037)
+------------------------------------------v------------------+
|                     ANDROID PHONE                           |
|                  [ adbd (Device Daemon) ]                   |
+-------------------------------------------------------------+
```
1. **The Client (`./tools/platform-tools/adb`):** The terminal command you execute.
2. **The Server:** A background process on your laptop that manages communication between the client and connected devices on TCP port 5037.
3. **The Device Daemon (`adbd`):** A lightweight background service running on your Android phone that responds to commands once "USB Debugging" is enabled in Developer Options.

### 4. Hands-On Test Command (Try This on Your Phone)
1. Enable **Developer Options** on your Android phone: Go to *Settings > About Phone*, and tap *Build Number* 7 times.
2. Inside *Developer Options*, toggle **USB Debugging** to ON.
3. Plug your phone into your laptop via USB. A prompt will appear on your phone asking *"Allow USB debugging?"* — check "Always allow from this computer" and tap **Allow**.
4. In your terminal, run:
   ```bash
   ./tools/platform-tools/adb devices
   ```
   You will see your phone's unique device serial number listed with status `device`.

---

## Log Entry 02: Authoritative Local Multiplayer WebSocket Server

### 1. What Was Created
- **Directory:** `Server/`
- **Dependencies:** Node.js v24 + `ws` (WebSockets library) via `package.json`.
- **Server Entrypoint:** `Server/src/server.js`
- **Execution Test:**
  ```bash
  node Server/src/server.js
  ```

### 2. Why We Chose Node.js + WebSockets
In Section 6 of our master specification, we identified the **Client Isolation** trap of campus Wi-Fi and the battery-draining danger of 60 FPS position streaming.
- We do **not** need high-frequency tick streams (like CS:GO or Call of Duty) because the phone's local ARCore system handles fluid 60 FPS local movement.
- We only need to broadcast **discrete, timestamped game events**:
  - *"Player 2 crossed Checkpoint C01."*
  - *"Monster FSM switched to STALK mode; target is Player 3."*
  - *"Player 1 turned on flashlight."*
- WebSockets (`ws`) maintain a lightweight, persistent, bi-directional TCP connection. Packet sizes are negligible ($< 200\text{ bytes}$ per event), keeping network usage below 2 KB/s and saving battery.

### 3. How the Server Logic Works
Open `Server/src/server.js` and observe these key patterns:

```javascript
// 1. Dynamic Role Assignment:
// Automatically assigns connecting devices to slots PLAYER_1 through PLAYER_4
let assignedRole = `PLAYER_${nextPlayerIndex++}`;
players.set(ws, { role: assignedRole, ip });

// 2. Event-Driven Dispatch:
// When one player raises their phone into "Fox Window" view:
case 'FOX_WINDOW_STATE':
    broadcast({
        type: 'TEAM_FOX_WINDOW',
        senderRole,
        isRaised: msg.isRaised,
        timestamp: Date.now()
    }, senderWs); // exclude sender so they don't echo their own event
```

### 4. Key Takeaways
- **Server-Authoritative:** The server decides game state transitions (e.g. when the monster moves from `DORMANT` to `STALK`), preventing multiple phones from disagreeing on what the monster is doing.
- **Offline / Hotspot Ready:** This server runs on your laptop with zero internet required. When your laptop hosts a Wi-Fi hotspot, all 4 player phones connect to `ws://192.168.4.1:8080`.

---

## Log Entry 03: Unity Project Architecture & Folder Standards

### 1. Folder Structure Initialized
We created the standard modular structure under `Assets/_Project/`:
```
Assets/
└── _Project/
    ├── Animations/       # Creature Mecanim state machines & clips
    ├── Audio/            # Binaural 3D horror audio assets
    ├── Materials/        # URP materials, DepthMask occluders, glitch shaders
    ├── Models/           # Decimated corridor mesh, creature FBX assets
    ├── Prefabs/          # Reusable entities (Player rig, AR Camera, Monster)
    ├── Scenes/
    │   └── Tests/        # Verification test scenes for each track
    ├── Scripts/
    │   ├── Anchors/      # IAnchorProvider interface, MarkerAnchorProvider
    │   ├── Audio/        # Positional audio emitters & spatial controls
    │   ├── Gameplay/     # FoxWindowController, TorchManager, Haptics
    │   ├── Monster/      # MonsterFSM, NavMeshStalker
    │   └── Networking/   # WebSocketClient & EventPayloads
    └── Shaders/          # Invisible depth mask & post-process glitch
```

### 2. Why the `_Project` Subfolder Matters
When importing third-party Unity packages (AR Foundation, Mixamo assets, DOTween, etc.), they dump their own assets into the root `Assets/` directory. By keeping all our custom game code inside `Assets/_Project/`, our code never gets mixed up with library files.

---

## Log Entry 04: Professional Git Strategy, .gitignore & Milestone Commits

### 1. What Was Set Up
- **Remote Git Repository:** Bound to `https://github.com/wolf-eye0/FOX-WINDOW.git`.
- **Primary Branch:** `main`.
- **Targeted `.gitignore`:** Strict ignore rules for Unity cache directories, Node dependencies, local binaries, and transient scrape files.
- **Root `README.md`:** Project introduction, architectural diagrams, and roadmap overview.

### 2. Why Git in Game Development is Different from Web Dev
In web development, code consists primarily of lightweight text files (JS, HTML, CSS). In game development:
1. **The Giant Cache Trap (`Library/`):** When Unity opens a project, it imports all textures, audio, and models, compiling them into internal binary caches inside a `Library/` folder. This folder frequently grows to **5 to 20 Gigabytes**. If you commit `Library/` to Git:
   - Your repository clone time explodes.
   - Every teammate's machine re-generates different binary hashes, causing endless, unresolvable merge conflicts.
   - **Rule:** `Library/`, `Temp/`, and `Obj/` must ALWAYS be ignored via `.gitignore`.
2. **Milestone-Based Commits:**
   - Instead of committing every single character change (which makes git history unreadable), professional game teams commit at **logical milestones**:
     - Completed a new system scaffold.
     - Verified an isolated test scene.
     - Fixed a specific tracking bug.
3. **Phase-Based Branching:**
   - Keeping `main` pristine ensures you always have a working demo.
   - Experimental work (e.g., trying a new occlusion shader or testing ARCore Cloud Anchors) happens in dedicated branches (`phase1-torch-occlusion`). If an experiment fails, you simply switch back to `main` without corrupting your project.

### 3. How to Work with Branches (Hands-On Commands)
```bash
# Check current branch and modified files:
git status

# Create and switch to a new feature branch for Phase 0:
git checkout -b phase0-audit

# Stage all tracked changes:
git add .

# Create a conventional, descriptive commit:
git commit -m "feat(phase0): verify adb connection and baseline ar scene"

# Push the branch to GitHub:
git push -u origin phase0-audit
```

---

*(This log updates continually with each new milestone and installation).*
