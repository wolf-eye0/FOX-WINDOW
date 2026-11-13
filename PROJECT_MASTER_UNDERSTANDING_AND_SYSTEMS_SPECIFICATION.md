# Real-World Multiplayer AR Survival Horror Game: Master Technical Specification & Project Architecture

**Document Type:** Master Systems Specification, Architectural Blueprint & Research Synthesis  
**Target Environment:** Unity 6 LTS / AR Foundation 6.x (Targeting Android ARCore & iOS ARKit)  
**Hardware Platforms:** Consumer Android / iOS Smartphones, Host Laptop Server, Optional ESP32 BLE Microcontrollers  
**Primary Deployment Target:** College Techfest Live Campus Multiplayer Event  
**Target Group Size:** 4-Player Synchronized Tactical Co-op  
**Authoritative References:** ChatGPT Conversations #1 & #2, Deep Research Whitepaper (16-Page Systems Engineering Document), Reddit XR/GameDev Expert Critique  

---

## Executive Summary & High-Level Architecture Overview

This document represents the complete, exhaustive synthesis and technical blueprint for the **Multiplayer Real-World Augmented Reality Survival Horror Game** planned for a college techfest. It consolidates every insight, design decision, mathematical formula, network topology, asset pipeline, safety protocol, and software architecture discussed across both ChatGPT development sessions (Chat 1 and Chat 2), the 16-page deep research whitepaper, and expert developer critiques gathered from Reddit communities (r/augmentedreality, r/Unity3D, r/gamedev).

### The Core Concept & Experience Premise
The project transforms an existing physical college building—specifically an indoor wing composed of intersecting corridors, pillars, closed doors, and empty classrooms—into an immersive, real-time multiplayer horror experience reminiscent of *Outlast*, *The Medium*, and *Phasmophobia*. 

A squad of **four participants**, equipped with their own smartphones and stereo headphones, enters a darkened corridor network. Unlike conventional AR games that suffer from the "Pokémon GO anti-pattern" (players walking blindly while glued to a screen), the core gameplay relies on the traditional Japanese folkloric concept of **Kitsune no Mado (狐の窓 — "The Fox Window")**:
- Players walk naturally through the physical environment with their **phones held downward**. 
- They navigate via auditory cues (binaural 3D footsteps, scraping metal, distant groans, raspy breathing), haptic device pulses, and subtle environmental shifts.
- Raising the smartphone to eye level acts as the *Fox Window*—an occult aperture that reveals the paranormal dimension. The phone's screen and camera feed become a spectral viewfinder exposing horrifying entities standing in actual physical doorways, stalking down the hallway, or lurking behind concrete pillars.
- The phone's physical LED camera flash functions diegetically as the player's primary flashlight. This serves a critical dual purpose: providing in-game survival horror tension while simultaneously illuminating dark campus corridors to feed optical feature points into the device's Visual-Inertial Odometry (VIO) SLAM tracking system, preventing tracking failure in low-light environments.

```
+-----------------------------------------------------------------------------------+
|                              PHYSICAL REAL-WORLD LAYER                             |
|  Darkened College Corridor | Physical Pillars & Doors | 4 Players Walking Naturally |
+-----------------------------------------------------------------------------------+
                                         |
                       [Audio Cues & Haptic Vibrations Alert]
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        KITSUNE NO MADO ("FOX WINDOW") LAYER                        |
|  Phone Raised to Eye Level | Camera Feed Active | Spectral Viewfinder Engaged     |
+-----------------------------------------------------------------------------------+
                                         |
               +-------------------------+-------------------------+
               |                                                   |
               v                                                   v
+-----------------------------+                     +-----------------------------+
|    AR TRACKING & OCCLUSION   |                     |   SYNCHRONIZED MULTIPLAYER  |
|  - ARFoundation / ARCore VIO|                     |  - Host Laptop (LAN / Tunnel)|
|  - AROcclusionManager 16-bit|                     |  - Server-Authoritative FSM |
|  - Diegetic Camera LED Flash|                     |  - Event-Driven State Sync  |
|  - Physical Pillar Masking  |                     |  - Spatial Anchor Alignment |
+-----------------------------+                     +-----------------------------+
               |                                                   |
               +-------------------------+-------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                         DYNAMIC SURVIVAL HORROR ENCOUNTER                         |
|  3D Monster Renders Behind Real Columns | Multi-Player Shared Visual Reaction      |
+-----------------------------------------------------------------------------------+
```

---

## 1. Project Conceptual Evolution & Scope Levels

### 1.1 The Genesis: From Ghostbusters to Psychological Survival Horror
The project originated as an idea for a college techfest event where teams of four would navigate campus corridors hunting ghosts, loosely styled after *Ghostbusters* or tabletop RPG / D&D mechanics. 

Through progressive analysis, the design shifted from an action-oriented scavenger hunt into an atmospheric, tension-driven psychological survival horror game inspired by *Outlast*:
1. **Action/Shooter vs. Vulnerability:** Rather than giving players weapons to shoot virtual entities (which quickly turns into an arcade tap-to-kill minigame), the game strips away offensive weaponry. Survival depends on stealth, positioning, team communication, flashlight discipline, and evasion.
2. **Eliminating the Screen-Staring Anti-Pattern:** In typical AR titles, users walk forward while staring constantly at a screen. In an indoor institutional environment, this ruins the horror atmosphere, causes high thermal throttling, rapidly depletes batteries, and presents severe safety hazards (tripping, bumping into pillars, falling down stairwells).
3. **The "Fox Window" Paradigm:** By establishing that virtual monsters are only visible when the smartphone is raised as an occult lens, the physical environment remains the primary sensory stage. Players experience dread *before* they see the creature, driven by spatial audio and haptic feedback.

### 1.2 The Three Scope Levels
During initial planning, three tiers of implementation complexity were formulated:

| Scope Tier | Technical Mechanics | Tracking & Spatial Pipeline | Cost & Setup Effort | Immersive Quality |
| :--- | :--- | :--- | :--- | :--- |
| **Level 1: Basic Scavenger Hunt** | Static QR code checkpoints on walls. Players scan a code; a stationary 3D ghost pops up; players tap the screen to dispel it. | Pure 2D image marker tracking. No persistent world coordinates; no cross-device sync. | ₹0 - ₹500 INR. Extremely low effort (1-2 weeks). | Low. Feels like a promotional museum tour or gimmick; zero psychological horror. |
| **Level 2: Audio-Guided Sensor Hunt** | Players wear headphones in dimmed corridors. Audio intensity and phone vibration indicate entity proximity. Scanning a marker triggers an encounter. | Coarse proximity via BLE beacons or step-counting (PDR). Optical marker at encounter site. Basic peer sync. | ₹2,000 - ₹5,000 INR. Moderate effort (3-4 weeks). | Moderate. Good audio tension, but monster placement is static and lacks environmental grounding. |
| **Level 3: Dynamic Multiplayer AR Survival Horror (The Target Vision)** | Synchronized 4-player real-time horror. Autonomous monster stalk/patrol behaviors on campus NavMesh. Real-world depth occlusion behind physical pillars and doorframes. Diegetic LED flashlight mechanics. Event-driven server-authoritative multiplayer. | Hybrid Localization: 3D corridor mesh colliders + Optical Image Anchor hard resets (upgradable to ARCore Cloud Anchors) + ARCore 6-DoF VIO SLAM. | ₹0 - ₹4,000 INR (Free on software; budget strictly for optional BLE hardware or cheap participant earphones). | Maximum. Outlast-level visceral terror; shared reality across multiple screens. |

---

## 2. Game Design Philosophy, Mechanics & Pacing

### 2.1 The Kitsune no Mado (Fox Window) Lore & Mechanics
In classical Japanese folklore, interweaving one's fingers into a specific diamond aperture—known as the *Kitsune no Mado* (Fox Window)—allows a mortal to peer into the spirit realm and unmask yōkai, shapeshifting foxes, and ghosts disguised as ordinary objects.

In this project, the smartphone's display and camera act as the modern technological *Kitsune no Mado*:
- **The Naked Eye:** The player sees an ordinary, dim college corridor. Empty doorways, flickering fluorescent tubes, bare concrete columns.
- **The Audio-Haptic Reality:** The player hears wet, dragging footsteps 5 meters behind them. The floor seems to vibrate. An eerie static builds in the left headphone ear cup.
- **The Aperture (Fox Window):** Raising the phone reveals the true horror. Through the camera feed, a twisted, emaciated creature is crouching in the doorway, staring directly at the squad.
- **Occlusion Grounding:** As the creature stalks forward, it passes behind a real, physical concrete column; its virtual body is cleanly masked by the column before re-emerging on the other side. This single perceptual cue bridges the boundary between the virtual and physical worlds.

### 2.2 The Atmospheric Pacing Cycle
Horror is created through the modulation of tension and release. Continuous monster presence leads to sensory desensitization. The experience follows a five-stage psychological loop:

```
    [ 1. SILENT TRAVERSAL ]  -->  Phones lowered; ambient building hum; binaural distance cues
             |
             v
    [ 2. SENSORY WARNING  ]  -->  Footsteps quicken; phone haptics pulse; stereo audio pans
             |
             v
    [ 3. THE REVEAL (WINDOW)] -->  Phone raised; camera LED illuminates hallway; entity spotted
             |
             v
    [ 4. CRISIS & ESCAPE  ]  -->  Creature lunges; flashlight flickers; players retreat to safety
             |
             v
    [ 5. DE-ESCALATION    ]  -->  Creature retreats into shadows; quiet returns; tension resets
```

### 2.3 Diegetic Gameplay Elements
To avoid immersion-breaking video game UI (floating health bars, mini-maps):
1. **The Diegetic Flashlight:** The phone's rear camera LED serves as the in-game flashlight. Toggling the flashlight is handled via an on-screen tactile thumb switch or device button. Flashlight beam battery levels are represented by intermittent flickering and color temperature shifts rather than a numeric percentage bar.
2. **Paranormal Static / Glitch Shader:** Entity proximity causes subtle chromatic aberration, scanlines, and electromagnetic noise on the camera feed. This diegetically warns players when an entity is nearby even before raising the phone.
3. **Movement Constraints (The Anti-Running Rule):** If players run or sprint (detected via phone accelerometer/IMU step frequency), the entity's perception radius spikes instantly, triggering an enraged sprint attack. This mechanically forces participants to walk slowly, simultaneously maintaining horror tension and eliminating physical tripping hazards in campus hallways.

---

## 3. Comparative Engine Evaluation: Unity AR Foundation vs. Three.js / WebXR

A fundamental engineering question addressed in the research was whether to build the application natively in **Unity 6 (AR Foundation)** or as a zero-install browser application using **Three.js + WebXR**.

While WebXR provides frictionless onboarding (scanning a QR code in mobile Chrome), deep technical analysis revealed **five critical architectural failure modes** that make WebXR non-viable for a real-world multiplayer AR horror game.

### 3.1 Exhaustive Engine Comparison Matrix

| Technical Capability | Unity 6 with AR Foundation 6.x | Three.js with WebXR (Chromium Android) | Project Impact & Verdict |
| :--- | :--- | :--- | :--- |
| **iOS / Cross-Platform Parity** | Native ARKit compilation via Xcode. Identical codebase runs on Android and iOS. | **Failure Mode 1:** Mobile Safari on iOS does not support WebXR AR sessions natively. Requires non-standard third-party wrapper apps (e.g., WebXR Viewer). | **Fatal for WebXR:** Breaks the premise of universal browser access if iOS users cannot participate. |
| **Background Execution & Throttling** | C# background worker threads, Android Foreground Services. Sensor processing, network WebSockets, and audio loops continue uninterrupted when phone is lowered. | **Failure Mode 2:** Chromium aggressively suspends WebGL contexts and throttles `requestAnimationFrame` to 1 Hz or 0 Hz when tabs lose focus, screen dims, or device orientation changes downward. | **Fatal for WebXR:** Players walking with phones down would experience disconnected networks, stalled audio, and broken tracking. |
| **Bluetooth Low Energy (BLE) Access** | Direct access to native Android Bluetooth LE APIs (`android.bluetooth.le`) via C# plugins. Enables silent background beacon scanning and RSSI distance sampling. | **Failure Mode 3:** MDN Web Bluetooth specification strictly forbids silent background scanning. `navigator.bluetooth.requestDevice` forces a modal system chooser requiring an explicit user screen tap. | **Fatal for WebXR:** Impossible to implement passive corridor beacon tracking without intrusive browser popups. |
| **Hardware Flashlight (Camera Torch)** | Direct programmatic control via `XRCameraSubsystem.requestedCameraTorchMode = true` (AR Foundation 6.x). | **Failure Mode 4:** WebXR `immersive-ar` session specification lacks standardized APIs to control the hardware camera LED flash. | **Fatal for WebXR:** Cannot implement the diegetic flashlight or artificially illuminate dark hallways for VIO SLAM stability. |
| **Depth Sensing & Real-Time Occlusion** | `AROcclusionManager` binds directly to ARCore/ARKit 16-bit depth buffer textures on GPU. Executes hardware single-pass depth testing against virtual geometry. | **Failure Mode 5:** Experimental WebXR Depth API serializes depth buffers across browser IPC boundaries, introducing 30–60ms latency, silhouette edge lag, and visible shimmering. | **Fatal for WebXR:** Virtual monsters would visibly lag and fail to occlude cleanly behind physical concrete columns. |
| **Asset Pipeline & Graphics Pipeline** | Universal Render Pipeline (URP). Shader Graph, custom stencil shaders, GPU instancing, Burst Compiler, IL2CPP native compilation. | WebGL 2.0 / Three.js. Client-side GLTF decompression, manual shader chunk injection, single-threaded JS event loop garbage collection stalls. | **Unity Advantage:** Predictable frame pacing at 30/60 FPS without garbage collection stutter during heavy monster animation. |

**Final Architectural Decision:** Native compilation using **Unity 6 LTS and AR Foundation 6.x** is the only viable production path.

---

## 4. Indoor Localization, Spatial Tracking & Anchor Architecture

Navigating long campus corridors without continuous camera activation presents severe mathematical and physical constraints:
- Pointing a camera at featureless linoleum floors or swinging the phone causes optical feature starvation and motion blur, corrupting SLAM feature vectors and causing catastrophic coordinate drift.
- Continuous camera, GPU, and SLAM computation overheats mobile devices within 15–20 minutes.

To solve this, the architecture separates navigation into **Macro-Positioning (Coarse Navigation)** and **Micro-Positioning (Tactical AR Interaction)**.

```
+-----------------------------------------------------------------------------+
|                           MACRO-POSITIONING LAYER                           |
|  - Phone held downward; camera stream & depth processing idle.              |
|  - Zone detection via Corridor Image Checkpoints or ESP32 BLE Beacons.      |
|  - Triggers ambient spatial audio cues, floor vibrations, and squad state.  |
+-----------------------------------------------------------------------------+
                                       |
                   [Approaching Registered Encounter Zone]
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                           MICRO-POSITIONING LAYER                           |
|  - Player raises phone into "Fox Window" orientation.                       |
|  - Camera LED Torch fires diegetically; ARCore 6-DoF VIO SLAM engages.      |
|  - Hard Coordinate Alignment: Optical Image Anchor / ARCore Cloud Anchor.   |
|  - Real-time Depth Occlusion: AROcclusionManager masks creature behind walls.|
+-----------------------------------------------------------------------------+
```

### 4.1 Evaluation of Indoor Tracking Modalities

#### A. Wi-Fi RTT (IEEE 802.11mc Fine Timing Measurement)
- **Concept:** Measures Time of Flight (ToF) of radio packets between the device and Wi-Fi Access Points to achieve 1–2 meter sub-meter indoor positioning without connecting to the network.
- **Analysis:** While theoretically ideal, Wi-Fi RTT requires hardware support on both the client smartphone and the physical campus Access Points. Enterprise college networks rarely have 802.11mc enabled or calibrated.
- **Verdict:** Ruled out ("Wi-Fi RTT is a no-go").

#### B. Bluetooth Low Energy (BLE) Beacons (ESP32 Nodes)
- **Mathematical Model:** Signal strength follows the Log-Distance Path Loss Model:
  $$RSSI(d) = RSSI_0 - 10 \cdot n \cdot \log_{10}(d) + X_\sigma$$
  where $RSSI_0$ is signal strength at 1 meter, $n$ is the path loss exponent (2.0 in free space, 3.0 to 4.5 in institutional concrete corridors), and $X_\sigma$ represents zero-mean Gaussian shadow fading noise.
- **Physical Reality:** Radio signals in concrete corridors suffer from severe multipath reflections, wave cancellation off metal lockers, and 2.4 GHz signal absorption by human water mass (players' bodies).
- **Implementation Strategy:** Raw RSSI is too erratic for fine positioning. If deployed, BLE is used strictly for **coarse zone triggering** (e.g., detecting when the team enters "Corridor Wing C") using a moving average or 1D Kalman filter.
- **Hardware Sourcing:** ESP32 microcontrollers configured as battery-powered iBeacons (see BOM section).

#### C. Optical Image Markers (ARTrackedImageManager) — The Core Foundation
- **Mechanism:** Laminated high-contrast visual markers (ArUco codes, AprilTags, or styled in-universe posters such as "Emergency Evacuation Maps" or "Biohazard Warnings") mounted at corridor junctions and doorways.
- **Performance:** Sub-centimeter spatial accuracy ($< 2	ext{ cm}$) and sub-degree rotational precision ($< 1^\circ$).
- **Role:** Instantaneous, zero-drift coordinate hard-reset. When a player scans marker `M03`, their local AR coordinate frame snaps to the exact global coordinate of Doorway 3.
- **Advantages:** Zero infrastructure cost, zero external radio interference, 100% offline reliability.

#### D. ARCore Cloud Anchors — The Seamless Target Upgrade
- **Mechanism:** Google ARCore Cloud Anchors API maps visual feature point clouds of an environment, hosts them in Google Cloud, and allows multiple devices to resolve the identical coordinate space without physical markers.
- **Constraints:** Requires active internet access, an authenticated Google Cloud project, and sufficient ambient visual texture.

### 4.2 The Dual-Track Anchor Strategy: Approach B Foundation to Approach A Upgrade
To de-risk development, the project employs an abstract interface pattern:

```csharp
public interface IAnchorProvider 
{
    event Action<string, Pose> OnAnchorResolved;
    void Initialize();
    void ResolveAnchor(string anchorId);
}
```

- **Phase 1 Deployment (Approach B):** Implement `MarkerAnchorProvider` using `ARTrackedImageManager`. Every player synchronizes their world origin by looking at a physical poster at the corridor entrance. This guarantees a working, playable game from day one.
- **Phase 2 Upgrade (Approach A):** Implement `CloudAnchorProvider` using ARCore Cloud Anchors. Once multi-device visual mapping is calibrated, the game resolves anchors via the cloud.
- **Automatic Fallback:** If Cloud Anchor resolution times out (e.g., due to low network bandwidth or poor lighting), the system seamlessly falls back to optical image marker detection without disrupting gameplay logic.

---

## 5. College Campus 3D Mapping & Spatial Reconstruction Pipeline

### 5.1 The Decision: 3D Geometric Reconstruction vs. Street View Walkthrough
The user explored whether to create a Google Street View-style 360-degree photographic walkthrough or a true 3D spatial scan.

```
STREET VIEW / 360 PANORAMA                     TRUE 3D PHOTOGRAMMETRIC MESH
+-------------------------------+             +-------------------------------+
|  Spherical 2D Photo Nodes     |             |  Geometric Vertices & Faces   |
|  - Zero depth information     |             |  - Accurate physical dimensions|
|  - Cannot bake NavMesh        |             |  - Bakes static Unity NavMesh |
|  - Cannot compute collisions  |             |  - Provides physics colliders |
|  - No physical occlusion      |             |  - Acts as invisible occluder |
+-------------------------------+             +-------------------------------+
         [ REJECTED ]                                  [ SELECTED ]
```

**Why 3D Reconstruction Wins:**
1. **NavMesh Generation:** Unity's NavMesh agent requires real polygon surfaces to calculate walkable corridors, doorway widths, and patrol paths for monster AI.
2. **Invisible Collision Mesh:** The real-world geometry is imported into Unity, textured with an invisible `DepthMask` shader, and assigned a Mesh Collider. Virtual monsters cannot walk through real walls.
3. **Backup Occlusion:** In low-light areas where ARCore's real-time monocular depth buffer is noisy, the pre-scanned geometric mesh serves as a static occluder.

### 5.2 Scanning Workflow & Tools
- **Capture Software:** Consumer mobile photogrammetry / LiDAR apps such as **Polycam**, **Scaniverse (Niantic)**, or **Luma AI**. On supported Android devices, ARCore depth sensing is utilized directly.
- **The Pilot Survey Experiment (Crucial Step):** Do *not* attempt to scan the entire college building initially. Scan a single **15–20 meter corridor section** containing:
  - Exactly one 90-degree turn or T-junction.
  - At least one doorway.
  - Exactly one protruding architectural feature (pillar, water cooler, or fire extinguisher cabinet).
- **Survey Data Points to Record:**
  - Physical tape measurements of corridor width, height, and length (for scale calibration).
  - High-contrast visual features and surface reflectivity (matte concrete tracks better than glossy tile).
  - Lighting levels (lux) along the corridor strip.
  - Identifier nomenclature: Hallway segments labeled `C01`, `C02`; junctions labeled `J01`, `J02`; doors labeled `D01`, `D02`.

### 5.3 Post-Processing in Blender to Unity URP
1. **Export:** Export raw photogrammetry scan as `.obj` or `.fbx` with textures.
2. **Blender Cleanup:**
   - Align the physical entrance doorway to `(0, 0, 0)` world origin with zero rotation.
   - Decimate raw high-poly mesh (often 500,000+ polygons) down to a clean, lightweight collision proxy under 5,000 polygons.
   - Ensure floors are planar and wall normals point inward.
3. **Unity Import:**
   - Mark mesh as `Static Navigation`.
   - Bake Unity NavMesh with agent parameters: `Radius = 0.4m`, `Height = 1.8m`, `Max Slope = 10°`.
   - Assign layer `Occlusion` with an unlit, color-mask-disabled shader (`ColorMask 0`, `ZWrite On`).

---

## 6. Multiplayer Networking & Infrastructure Engineering

### 6.1 The Institutional Wi-Fi Trap: Client Isolation (AP Isolation)
Most university and enterprise Wi-Fi networks enable **Client Isolation (Access Point Isolation)** as a security policy. This configuration blocks wireless devices connected to the same SSID from communicating with one another via local IP addresses. Peer-to-peer UDP, local LAN broadcasts, and local WebSocket discovery will silently fail.

```
ENTERPRISE WI-FI FAILURE MODE (CLIENT ISOLATION)
[ Phone 1 ] --X--> [ Campus AP Router ] <--X-- [ Phone 2 ]
              (Direct LAN peer packets dropped by AP firewall)

SOLUTION 1: DEDICATED HARDWARE LAN HOTSPOT
[ Phone 1 ] ------> [ Student Laptop / 5GHz Router ] <------ [ Phone 2 ]
                   (Local Subnet 192.168.4.x - No isolation)

SOLUTION 2: INTERNET RELAY TUNNEL (CELLULAR / GUEST WI-FI)
[ Phone 1 (4G) ] ----> [ Cloudflare / ngrok Tunnel ] ----> [ Host Laptop Server ]
```

### 6.2 Solved Network Topologies

#### Topology 1: Dedicated Offline Local Hotspot (Recommended for Reliability)
- An inexpensive 5 GHz dual-band travel router (or the host student laptop configured as a Wi-Fi Hotspot) creates an isolated local network (e.g., `192.168.4.0/24`).
- All four player smartphones and the host server laptop connect to this dedicated SSID.
- No campus internet connection is required; latency is $< 10	ext{ ms}$; zero risk of institutional firewall interference.

#### Topology 2: Internet Tunnel Relay (Cloudflare Tunnel / ngrok / zrok)
- If players must use mobile data (4G/5G) or college guest Wi-Fi, the host laptop runs the authoritative game server and exposes port 8080 through a secure reverse tunnel:
  `cloudflared tunnel --url http://localhost:8080` or `ngrok http 8080`.
- Each smartphone connects to the public HTTPS/WSS URL (`wss://game.example.com`).
- Eliminates client isolation entirely, as all traffic appears as standard outbound internet traffic.

### 6.3 Server-Authoritative Event-Driven Architecture
In mobile AR, attempting to synchronize 60 Hz transform positions of every player across the network is an architectural anti-pattern:
- SLAM coordinate drift creates visual stutter and player rubber-banding.
- Massive network packet volume rapidly drains phone batteries and congests the radio channel.

**The Solution:** The server synchronizes **Discrete High-Level Events and State Changes**, not raw transforms:

```json
// Example: Server Event Payload (Lightweight JSON or Protobuf)
{
  "timestamp": 1731475200123,
  "eventType": "ENTITY_STATE_TRANSITION",
  "entityId": "MONSTER_01",
  "currentState": "STALK",
  "targetPlayerId": "PLAYER_3",
  "originNode": "J01",
  "targetNode": "C02_D04",
  "moveSpeed": 1.2
}
```

- Each client runs its own local simulation of the monster moving along the shared NavMesh.
- Because all devices share the identical baked corridor geometry and synchronized start timestamps, the monster appears in the exact same physical doorway across all four screens.
- Total network bandwidth remains under **2 KB per second per client**.

---

## 7. Monster AI Systems, Finite State Machines & Procedural Encounters

### 7.1 Finite State Machine (FSM) Architecture
The virtual entity's behavioral logic is driven by a deterministic hierarchical FSM:

```
                           +-------------------+
                           |     DORMANT       |  (Waiting invisible at spawn node)
                           +-------------------+
                                     |
                         [Squad Enters Wing Trigger]
                                     |
                                     v
                           +-------------------+
            +------------> |     PATROL        | <-----------+
            |              +-------------------+             |
            |                        |                       |
    [Lost Target /             [Player Audio /         [Flashlight Stun
     Timer Elapsed]            Torch Detected]         Cooldown Done]
            |                        |                       |
            |                        v                       |
            |              +-------------------+             |
            +------------- |      STALK        |             |
                           +-------------------+             |
                                     |                       |
                              [Proximity < 3m /              |
                               Corner Ambush]                |
                                     |                       |
                                     v                       |
+-------------------+      +-------------------+             |
|     FLEE          | <--- |    ENCOUNTER      | ------------+
| (Retreat to Vents)|      |  (Scream / Lunge) |
+-------------------+      +-------------------+
```

1. **DORMANT:** Entity is unrendered and stationary at an off-limits corridor waypoint (e.g., inside an unmapped utility closet).
2. **PATROL:** Entity traverses predetermined hallway waypoints at walking speed ($0.8	ext{ m/s}$). Footstep audio emits from its NavMesh position.
3. **STALK:** Entity locks onto a specific player (e.g., the player lagging furthest behind the squad). It follows at matching speed, keeping a distance of 4–6 meters, staying deliberately outside the direct cone of the camera torch.
4. **ENCOUNTER:** Triggered when players turn around or corner the entity. The creature shrieks, lunges forward at $2.5	ext{ m/s}$, and triggers heavy screen chromatic aberration and haptic shudder.
5. **FLEE:** If illuminated continuously by two or more player flashlights for 3 seconds, the creature recoils, breaks line of sight, and vanishes through a pre-designated boundary door.

### 7.2 Tactical AR Spawning Tricks (Veteran XR Insights)
As validated by developer discussions:
- **Never spawn monsters in plain view on empty floor planes.** Spawning an entity from thin air breaks immersion immediately.
- **Occluded Spawning:** Spawn monsters strictly behind physical geometry: around a 90-degree corridor corner, behind a physical closed door, or just beyond the edge of the player's peripheral vision.
- **Relative Offset Placement:** Rather than relying purely on absolute world coordinates, entities can be dynamically positioned relative to the squad's leading player transform (e.g., `Vector3 spawnPos = playerTransform.position + playerTransform.forward * 8.0f + playerTransform.right * 1.5f`), snapping to the nearest NavMesh point.

---

## 8. 3D Creature Asset Pipeline, Rigging & Legal Compliance

### 8.1 Legal and Intellectual Property Frameworks
During planning, the user inquired whether 3D monster assets could be extracted directly from commercial video games such as *Outlast* or *Resident Evil*.

**Legal & Institutional Verdict:**
- Extracting proprietary assets from commercial game archives (`.upk`, `.pak`, `.bundle`) constitutes copyright infringement and violates the game's End User License Agreement (EULA).
- Demonstrating a project with ripped assets at a public, university-sponsored techfest introduces severe risks of event disqualification, DMCA takedowns, and legal liability.
- **Policy:** The project strictly utilizes **legitimately licensed, royalty-free, or Creative Commons (CC BY 4.0)** 3D assets.

### 8.2 Verified Legitimate Horror Creature Assets

| Creature Designation | Sourcing Channel & Asset Name | Licensing Terms | Model Specifications & Optimization |
| :--- | :--- | :--- | :--- |
| **Organic Flesh Stalker** | Sketchfab: *Organic Monster - Game Ready* by artist Ra_zi_el | Creative Commons Attribution (CC BY 4.0). Requires visible in-app credit screen. | Low-poly ($\sim 8,500$ triangles). Pre-rigged with idle, walk, and attack animation clips. |
| **Shadow Quadruped** | Sketchfab: *Shadow Stalker – Horror Creature* by artist DevPoly3D | Creative Commons Attribution (CC BY 4.0). | Elongated crawler ($\sim 6,200$ triangles). Requires humanoid or quad-limb IK rig. |
| **Emaciated Ghoul** | Sketchfab: *Pale Horror Skeleton Creature* by artist Pigcraft | Creative Commons Attribution (CC BY 4.0). | Emaciated humanoid. Requires Blender polygon decimation from high-poly sculpt down to $< 8,000$ tris. |
| **Mixamo Horror Base** | Adobe Mixamo Library: *Mutant*, *Vampire*, *Zombie* base meshes | Adobe Mixamo Royalty-Free License (Free with registered Adobe ID). | Fully rigged standard humanoid bone hierarchies. Seamlessly accepts hundreds of free mocap horror animations. |
| **The Watcher** | Unity Asset Store: *01_Monster: Watcher* by HATOGAME | Standard Unity Asset Store Free License. | Native Unity package. Pre-configured for Universal Render Pipeline (URP). |

### 8.3 Mobile AR Asset Optimization Standards
To prevent thermal throttling and maintain 30–60 FPS rendering on mobile GPUs:
- **Polygon Budget:** Maximum 5,000–10,000 triangles per creature.
- **Bone Limit:** Maximum 30–45 bones per skeleton. Limit vertex skin weights to **2 bones per vertex** in Unity Quality Settings.
- **Texture Packing:** Combine Albedo, Normal, and Packed Metallic/Smoothness/Ambient Occlusion maps into a single 2048x2048 texture atlas per character, resulting in exactly **1 Draw Call per creature**.

---

## 9. Audio Engineering, Pacing & Spatialization

In survival horror, **audio delivers 80% of the terror; the AR camera reveal is merely the visual payoff.**

### 9.1 Binaural Spatial Audio Architecture
- **Plugin:** Unity Audio Spatializer SDK (or Google Resonance Audio / Steam Audio for Unity).
- **Acoustic Simulation:**
  - Ambient hallway reverberation profile matching enclosed concrete corridors.
  - Sound occlusion curves: Audio sources positioned behind virtual collision walls attenuate high frequencies (low-pass filtering) to simulate sound transmission through physical concrete doors.
- **Audio Cue Layering:**
  1. *Sub-Bass Drone (30–60 Hz):* Continually active at subliminal volume to induce physiological unease.
  2. *Point-Source Environmental Clues:* Metal pipes creaking, distant fluorescent light buzzing, water droplets falling at specific coordinate nodes.
  3. *Dynamic Stalker Audio:* Wet footfalls and raspy breathing attached directly to the monster's NavMesh agent transform. As the monster stalks behind players, the sound pans realistically across their stereo ear cups.

### 9.2 Equipment Protocol
- All participants must wear wired (3.5mm / USB-C) or low-latency Bluetooth stereo headphones.
- Because some participants will forget or lack compatible headphones, the organizers should maintain a pool of inexpensive wired in-ear headphones (see BOM).

---

## 10. Thermal Management, Battery Optimization & Physical Campus Safety

### 10.1 The Mobile AR Thermal Triad
Mobile augmented reality is among the most resource-intensive workloads possible on consumer devices:
1. **Camera Sensor Pipeline:** Continuous 1080p/720p 30 FPS video streaming from camera sensor to system RAM.
2. **Computer Vision & SLAM:** Real-time visual feature extraction, corner detection, and 6-DoF matrix estimation on CPU/NPU.
3. **Graphics & Depth Rendering:** Unity URP rendering 3D geometry and processing 16-bit depth buffer textures on mobile GPU.

**Consequence:** Without aggressive power management, mobile devices experience significant battery drain (up to 1% per minute) and trigger thermal throttling within 15–20 minutes, dropping frame rates to unplayable levels.

### 10.2 Engineering Mitigations
- **Target Frame Rate:** Explicitly lock application frame rate to 30 FPS via `Application.targetFrameRate = 30`. 60 FPS provides negligible immersion benefits in AR while doubling GPU power draw.
- **Display Blanking in Traverse Mode:** When device pitch angle indicates the phone is pointed downward ($> 45^\circ$ below horizon), dim the screen by 80% and pause non-essential depth texture calculations.
- **Dynamic Resolution Scaling (DRS):** Automatically scale URP render resolution down to $0.7	imes$ if device thermal status (`SystemInfo.batteryLevel` or frame time spikes) indicates overheating.

### 10.3 Physical Safety Protocol for Campus Corridors
Survival horror experiences can trigger instinctive fight-or-flight panic responses. A running player in a dark corridor is an acute liability:
- **Hazard Identification:** Fire stairs, glass doors, emergency exit signs, and protruding wall fixtures.
- **Physical Safety Marshals:** Two student volunteers stationed at opposite corridor ends equipped with high-visibility armbands and flashlights.
- **Safety Zone Boundaries:** All stairwells and restricted doors are physically taped off with hazard tape and marked as non-navigable boundary walls in the game's NavMesh.
- **In-Game Speed Enforcement:** As noted in Section 2.3, running triggers instant monster retaliation, naturally pacing the squad.

---

## 11. Bill of Materials (BOM), Budgeting & Sourcing Analysis

### 11.1 Sourcing Analysis & Cost Tiers (Indian Rupees / USD)
The project can be executed across two distinct financial models:

#### Model A: The Full Hardware Implementation (ESP32 BLE Grid + Accessories)

| Component Infrastructure | Detailed Hardware Specification & Sourcing Channel | Unit Cost (INR) | Qty | Total Cost (INR) | Total Cost (USD) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Corridor BLE Nodes** | ESP32 DOIT DevKit V1 (30-Pin Microcontroller) via Indian distributors (Robu.in, QuartzComponents) | ₹360 | 6 units | ₹2,160 | ~$26.00 |
| **Autonomous Power** | 9V heavy-duty batteries with snap connectors and LM7805 5V regulators | ₹85 | 6 sets | ₹510 | ~$6.15 |
| **Optical Image Targets** | 350 GSM matte laminated cardstock prints ($20	ext{cm} 	imes 20	ext{cm}$) via local digital print shop | ₹40 | 8 units | ₹320 | ~$3.85 |
| **Local Network Router** | Repurposed dual-band 802.11ac Wi-Fi router (or student laptop hotspot) | ₹0 | 1 unit | ₹0 | $0.00 |
| **Authoritative Server** | Existing student laptop (Intel i5/Ryzen 5, 16GB RAM) running Node.js / C# | ₹0 | 1 unit | ₹0 | $0.00 |
| **Participant Test Phones**| Personal Android devices supporting ARCore (Android 11+) | ₹0 | 4 units | ₹0 | $0.00 |
| **Mounting Hardware** | Heavy-duty double-sided foam tape, zip ties, plastic mounting enclosures | ₹350 | 1 kit | ₹350 | ~$4.20 |
| **Contingency Pool** | Spare electronics, passive fuses, backup batteries | ₹660 | 1 pool | ₹660 | ~$7.95 |
| **TOTAL OUTLAY** |  |  |  | **₹4,000 INR** | **~$48.15 USD** |

#### Model B: The Pure Zero-Cost / Software Foundation
If funding is strictly zero:
- Eliminate ESP32 BLE beacons entirely. Rely 100% on **Optical Image Targets** and ARCore SLAM VIO.
- Host the local server on a student laptop broadcasting an open Wi-Fi hotspot.
- Participants use their own smartphones and personal earphones.
- **Total Financial Outlay: ₹0 to ₹320 INR (cost of printing 8 cardstock markers).**

---

## 12. Phased Development Roadmap & Milestone Verification

The project is structured into eight rigorous, sequential milestones. Each milestone requires passing a defined **Verification Test** before advancing.

```
PHASE 0: Compatibility & Tools Audit
   |
PHASE 1: Core Single-Phone AR & Depth Occlusion
   |
PHASE 2: Two-Phone Shared Spatial Coordinate Anchor
   |
PHASE 3: Campus Corridor 3D Capture & NavMesh Pilot
   |
PHASE 4: Server-Authoritative Multiplayer State Sync
   |
PHASE 5: First Playable Horror Encounter Loop (Audio + Torch + Fox Window)
   |
PHASE 6: Autonomous Monster Navigation & FSM AI Behaviors
   |
PHASE 7: 4-Player Co-op Field Polish, Stress Testing & Techfest Deployment
```

### Phase 0: Environment & Hardware Compatibility Audit
- **Goal:** Verify that team development machines, Unity configurations, and target test phones support required AR APIs.
- **Action:** Install Unity 6 LTS with Android Build Support. Install AR Foundation 6.x and Google ARCore XR Plugin 6.x. Verify test Android phones support Google Play Services for AR and Depth API.
- **Verification Test:** Build an empty AR Foundation sample scene to an Android test phone. Confirm camera feed renders at 30 FPS and planes detect on floor surfaces.

### Phase 1: Core Single-Phone AR & Real-World Occlusion
- **Goal:** Validate hardware LED torch toggling and real-time physical depth occlusion on a single device.
- **Action:** Configure `AROcclusionManager` with `Environment Depth` mode. Implement a diegetic UI switch calling `XRCameraSubsystem.requestedCameraTorchMode = true`. Place a primitive virtual cube 3 meters away behind a physical pillar or doorway.
- **Verification Test:** The player walks sideways. The virtual cube cleanly disappears behind the physical pillar on the camera screen without silhouette edge tearing or flickering.

### Phase 2: Two-Phone Shared Spatial Coordinate Proof
- **Goal:** Prove that two independent smartphones can agree on the exact same physical point in space.
- **Action:** Implement `MarkerAnchorProvider` using `ARTrackedImageManager`. Mount a test image target on a doorway. Both devices scan the marker; each instantiates a virtual marker object at local `(0, 0, 0)`.
- **Verification Test:** Two users look at the physical doorway from different angles. Both see the virtual marker resting on the exact same physical door handle. Position discrepancy must be $< 3	ext{ cm}$.

### Phase 3: Campus Corridor 3D Capture & NavMesh Pilot
- **Goal:** Convert real campus hallway geometry into an authoritative Unity navigation grid.
- **Action:** Capture a 15-meter test strip of the college corridor using Polycam. Clean and decimate the mesh in Blender. Import into Unity as an invisible static collider and bake a Unity NavMesh.
- **Verification Test:** A basic Unity NavMeshAgent traverses the digital corridor between hallway nodes `C01` and `C02`, accurately turning corners and avoiding physical pillars.

### Phase 4: Server-Authoritative Multiplayer State Sync
- **Goal:** Synchronize game state across multiple devices over an isolated local network.
- **Action:** Set up a lightweight WebSocket server on the host laptop (Node.js with `ws` library or Unity Netcode). Connect two client phones via the laptop's Wi-Fi hotspot.
- **Verification Test:** Client 1 presses a button; Client 2 receives the event in $< 20	ext{ ms}$. Disconnecting and reconnecting Client 2 cleanly restores current game state without crash or desync.

### Phase 5: First Playable Horror Encounter Loop
- **Goal:** Integrate audio spatialization, phone orientation detection, and the "Fox Window" mechanic into a cohesive horror beat.
- **Action:** Implement orientation detection: phone held down = dark screen + loud 3D footstep audio behind player; phone raised = screen brightens, camera feed activates, LED torch fires, and creature mesh appears.
- **Verification Test:** A playtester wearing headphones walks down the dark corridor. Hearing footsteps behind them, they turn and raise their phone; the creature is revealed in the doorway. Playtester exhibits genuine startle response.

### Phase 6: Autonomous Monster Navigation & FSM AI Behaviors
- **Goal:** Connect creature animation, pathfinding, and behavioral logic to the campus NavMesh.
- **Action:** Implement the FSM (`PATROL`, `STALK`, `ENCOUNTER`, `FLEE`). Rig a Mixamo/Sketchfab creature with walking, screaming, and stalking animation states. Synchronize entity state transitions across both test phones via server events.
- **Verification Test:** Two players stand in the corridor. Both see the identical monster stalk out of a real classroom doorway, halt at the corridor midpoint, scream, and charge toward Player 1. Both screens match within $50	ext{ ms}$.

### Phase 7: 4-Player Co-op Field Polish, Stress Testing & Techfest Deployment
- **Goal:** Execute full 4-player playtests in the actual college corridor under techfest conditions.
- **Action:** Deploy all 8 optical image markers across the designated corridor wing. Mount safety signage. Run full 15-minute sessions with external student groups.
- **Verification Test:** Continuous 15-minute 4-player session with zero application crashes, zero network disconnects, battery consumption $< 15\%$, and average device temperature remaining below thermal throttle limits.

---

## 13. Guidance for the Antigravity / Gemini Coding Agent

When continuing development of this project inside Google Antigravity using Gemini or Claude, the agent must adhere to strict architectural and engineering discipline:

### 13.1 Technical Working Discipline
1. **Never Propose WebXR or Three.js:** The evaluation is settled; all engineering must target Unity 6 LTS and AR Foundation 6.x.
2. **Minimal Reproducible Test Scenes:** Never build monolithic systems directly into the main production scene. Every track must have an isolated verification scene:
   - `Assets/Scenes/Tests/Test_TorchAndOcclusion.unity`
   - `Assets/Scenes/Tests/Test_MarkerAlignment.unity`
   - `Assets/Scenes/Tests/Test_NavMeshTraversal.unity`
   - `Assets/Scenes/Tests/Test_NetworkEventSync.unity`
3. **Decouple Spatial Anchors from Game Logic:** Always reference spatial coordinates through the `IAnchorProvider` interface. Never hardcode direct dependencies on ARCore Cloud Anchors or specific image marker components inside gameplay scripts.
4. **Bandwidth Economy:** Never propose streaming continuous player transform coordinates over WebSockets. Transmit only discrete, timestamped state events.

### 13.2 Recommended Project Directory Structure

```
AR_Horror_Game/
├── Assets/
│   ├── _Project/
│   │   ├── Animations/          # Creature animation controllers & Mecanim clips
│   │   ├── Audio/               # 3D spatialized binaural clips (footsteps, stingers, drone)
│   │   ├── Materials/           # URP materials, DepthMask occluder, glitch shaders
│   │   ├── Models/              # Decimated corridor mesh, CC BY 4.0 creature FBX models
│   │   ├── Prefabs/             # Player rig, AR session, monster agents, optical targets
│   │   ├── Scenes/
│   │   │   ├── Main_Experience.unity
│   │   │   └── Tests/          # Track verification scenes (Torch, Marker, Network)
│   │   ├── Scripts/
│   │   │   ├── Anchors/         # IAnchorProvider, MarkerAnchorProvider, CloudAnchorProvider
│   │   │   ├── Audio/           # DynamicAudioController, ProximitySoundEmitter
│   │   │   ├── Gameplay/        # FoxWindowController, TorchManager, PlayerHaptics
│   │   │   ├── Monster/         # MonsterFSM, NavMeshStalker, EncounterDirector
│   │   │   └── Networking/      # NetworkManager, EventPayloads, WebSocketClient
│   │   └── Shaders/             # DepthMask.shader, ParanormalGlitch.shadergraph
├── Server/
│   ├── src/
│   │   ├── server.js            # Node.js authoritative WebSocket event hub
│   │   ├── gameState.js         # Room management, squad state, encounter triggers
│   │   └── nodes.json           # Topological map graph (C01, J01, D01 definitions)
│   ├── package.json
│   └── README.md
├── Documentation/
│   ├── Campus_Survey_Data.md    # Physical hallway dimensions, node IDs, lux readings
│   └── Marker_Assets/           # Printable 350 GSM PDF optical image targets
└── README.md
```

---

## 14. Comprehensive Risk Matrix & Field Mitigation Protocols

| Risk Category | Specific Failure Mode | Severity | Probability | Engineering Mitigation Protocol |
| :--- | :--- | :--- | :--- | :--- |
| **Environmental** | Hallway lighting is too dark; optical SLAM loses tracking and features freeze. | High | High | Diegetic camera LED torch automatically engages via `XRCameraTorchMode.On`. Physical corridor maintains minimal ambient safety lighting. |
| **Network** | Campus Wi-Fi blocks peer communication via Client Isolation. | High | High | Host laptop broadcasts an independent 5 GHz Wi-Fi Hotspot. Fallback: Cloudflare Reverse Tunnel over mobile 4G/5G data. |
| **Spatial Drift** | Players walking for 10 minutes accumulate significant VIO drift ($> 1	ext{ meter}$). | High | Medium | Laminated optical image targets placed at every corridor junction (`J01`, `J02`) automatically hard-reset the device's local origin. |
| **Hardware** | Test smartphones overheat and throttle frame rates after 15 minutes of AR. | High | Medium | Target framerate capped at 30 FPS. Camera stream and depth passes paused when phone is pointed downward. Decimated meshes ($< 10	ext{k}$ tris). |
| **Gameplay** | In-experience panic causes a participant to run and collide with a pillar or glass door. | Critical | Low | Mechanical speed penalty (running triggers monster attack). Physical safety marshals at corridor ends. Designated wide, obstacle-free zones. |
| **Legal / IP** | Techfest organizers flag commercial creature assets as copyright violations. | High | Medium | Strict zero-tolerance policy on ripped commercial assets. 100% legitimate sourcing via Sketchfab CC BY 4.0, Mixamo, and Asset Store. |
| **Cloud Services** | Google Cloud Anchor API exceeds quota or fails due to network latency. | Medium | Medium | System architecture isolates anchor logic behind `IAnchorProvider`. Game automatically falls back to local Optical Image Targets. |

---

## 15. Technical Appendices, Formulations & Works Cited

### 15.1 Mathematical Formulations
1. **Radio Frequency Path Loss (BLE RSSI):**
   $$RSSI(d) = RSSI_0 - 10 \cdot n \cdot \log_{10}(d) + X_\sigma$$
   - $d$: Distance in meters between transmitter and smartphone receiver.
   - $n$: Environmental path loss exponent ($n pprox 3.2$ for institutional concrete hallways).
   - $X_\sigma$: Shadow fading Gaussian random variable ($\sigma pprox 4	ext{ dB}$).
2. **Camera Torch Integration in AR Foundation 6.x (C#):**
   ```csharp
   if (cameraManager.subsystem is XRCameraSubsystem cameraSubsystem && cameraSubsystem.subsystemDescriptor.supportsCameraTorch) 
   {
       cameraSubsystem.requestedCameraTorchMode = isTorchActive ? XRCameraTorchMode.On : XRCameraTorchMode.Off;
   }
   ```
3. **Invisible Depth Mask Shader (Pass through to Real World Depth):**
   ```hlsl
   Shader "AR/DepthMask" 
   {
       SubShader 
       {
           Tags { "Queue" = "Geometry-1" }
           ColorMask 0
           ZWrite On
           Pass {}
       }
   }
   ```

### 15.2 Key Works Cited & Reference Documentation
1. Unity Technologies. *AR Foundation 6.x Documentation & Manual.* https://docs.unity3d.com/Packages/com.unity.xr.arfoundation@6.1/
2. Google Developers. *ARCore Depth API Developer Guide for Unity AR Foundation.* https://developers.google.com/ar/develop/unity-arf/depth/developer-guide
3. Google Developers. *Cloud Anchors Overview & Multi-User Shared AR.* https://developers.google.com/ar/develop/cloud-anchors
4. Unity Technologies. *AR Occlusion Manager Component Reference.* https://docs.unity3d.com/Packages/com.unity.xr.arfoundation@6.1/manual/features/occlusion/occlusion-manager.html
5. Mozilla Developer Network (MDN). *Web Bluetooth API Specification & Security Restrictions.* https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API
6. World Wide Web Consortium (W3C). *WebXR Device API & Depth Sensing Module.* https://www.w3.org/TR/webxr-depth-sensing-1/
7. Adobe Systems. *Adobe Mixamo Character & Animation Repository.* https://www.mixamo.com/
8. Sketchfab. *Ra_zi_el: Organic Monster (CC BY 4.0).* https://sketchfab.com/models/
9. Hatogame. *01_Monster: Watcher - Free Unity Asset Package.* Unity Asset Store.
10. Conor Bronsdon. *Avoid AI Writing Patterns & Plain Language Reference.* https://github.com/conorbronsdon/avoid-ai-writing

---

## Conclusion & Immediate Next Action
The vision for this AR survival horror game is fully validated, thoroughly researched, and technically sound. By adhering to the **Kitsune no Mado** gameplay loop, building upon **Unity 6 + AR Foundation**, starting with **Optical Image Markers** before upgrading to **Cloud Anchors**, and utilizing an **isolated laptop hotspot with server-authoritative event sync**, the project sidesteps every common trap of mobile AR.

The immediate next step is **Track A / Phase 0 & Phase 1**: Setting up the minimal Unity AR Foundation test harness to verify camera torch activation and depth occlusion on an Android test phone.
