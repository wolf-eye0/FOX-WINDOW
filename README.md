# FOX-WINDOW (狐の窓) 🦊🪟

> **A Real-World 4-Player Augmented Reality Survival Horror Experience for Campus Corridors**

Inspired by *Outlast*, *The Medium*, and Japanese folklore, **FOX-WINDOW** turns physical college hallways into a synchronized multiplayer psychological survival horror game.

---

## 👁️ The Core Mechanic: Kitsune no Mado (狐の窓)

Unlike traditional AR games where players stare constantly at their screens (the "Pokémon GO anti-pattern"), FOX-WINDOW enforces an atmospheric, tension-driven loop:
1. **Traverse (Phones Down):** Players walk through dimmed corridors with their phones held downward, guided strictly by **binaural 3D spatial audio** (footsteps, dragging chains, breathing) and tactile haptic vibrations.
2. **The Spectral Aperture:** Raising the smartphone to eye level acts as the traditional *Fox Window*—an occult aperture revealing supernatural entities occupying real physical doorways and corridor corners.
3. **Diegetic Flashlight:** The phone's camera LED flash functions as the in-game flashlight, simultaneously supplying visual optical features to prevent ARCore Visual-Inertial Odometry (VIO) SLAM failure in dark environments.
4. **Real-World Depth Occlusion:** Creatures dynamically hide behind real concrete columns and door frames using ARCore's 16-bit depth buffer (`AROcclusionManager`).

---

## 🏗️ Technical Architecture

- **Client Engine:** Unity 6 LTS / AR Foundation 6.x (Universal Render Pipeline, ARCore / ARKit).
- **Backend Hub:** Lightweight Node.js authoritative WebSocket server (`Server/src/server.js`) broadcasting discrete game state events ($< 2\text{ KB/s}$).
- **Spatial Anchoring:** Dual-track architecture with abstract `IAnchorProvider` interface:
  - *Approach B (Foundation):* High-contrast optical image targets (ArUco / AprilTags) mounted at key doorways for sub-centimeter coordinate resets.
  - *Approach A (Upgrade):* ARCore Cloud Anchors for markerless shared coordinate spaces.
- **Physical Collision & AI NavMesh:** Pre-scanned 3D corridor mesh (via mobile photogrammetry) decimated in Blender and imported as invisible `DepthMask` static colliders with baked Unity NavMesh.

---

## 📁 Repository Structure

```
FOX-WINDOW/
├── Assets/
│   └── _Project/             # Isolated custom game code & assets
│       ├── Animations/       # Creature Mecanim rigs & mocap clips
│       ├── Audio/            # Binaural 3D spatial audio cues
│       ├── Materials/        # URP materials & DepthMask shaders
│       ├── Models/           # 3D corridor hulls & monster assets
│       ├── Prefabs/          # Player rigs & AR session components
│       ├── Scenes/Tests/     # Modular verification test scenes
│       ├── Scripts/          # Core C# systems (Anchors, Audio, Monster FSM)
│       └── Shaders/          # Invisible depth masks & glitch shaders
├── Server/
│   ├── src/server.js         # Authoritative 4-player WebSocket event server
│   └── package.json
├── Documentation/            # Hallway survey data & printable optical targets
├── LEARNING_LOG.md           # Progressive educational engineering & vibecoding log
└── PROJECT_MASTER_UNDERSTANDING_AND_SYSTEMS_SPECIFICATION.md # Comprehensive 16-page master spec
```

---

## 🚀 Development Roadmap

- [x] **Architecture & Research:** 16-page technical feasibility and systems specification.
- [x] **Project Scaffolding:** Modular directory architecture and authoritative event server.
- [ ] **Phase 0:** Hardware compatibility audit and baseline ARCore APK.
- [ ] **Phase 1:** Diegetic camera LED torch toggle and real-world depth occlusion.
- [ ] **Phase 2:** Two-phone shared spatial coordinate anchor proof.
- [ ] **Phase 3:** Corridor 3D scan and NavMesh stalker pilot.
- [ ] **Phase 4:** Multi-device server event synchronization.
- [ ] **Phase 5:** Playable horror encounter loop.
- [ ] **Phase 6:** Autonomous monster FSM AI navigation.
- [ ] **Phase 7:** 4-player co-op field polish and campus techfest deployment.

---

## 📜 License & Compliance
This project enforces strict compliance with intellectual property standards. 3D assets are sourced strictly under Creative Commons (CC BY 4.0) or royalty-free terms (Mixamo, Sketchfab, Unity Asset Store). Ripping assets from commercial video games is strictly prohibited.
