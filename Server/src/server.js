/**
 * AR Horror Game Authoritative WebSocket Server
 * 
 * Purpose:
 * Connects up to 4 mobile AR players and acts as the central event coordinator.
 * Instead of streaming heavy 60 FPS transform coordinates, this server syncs
 * lightweight, discrete game events (FSM state changes, trigger zones, encounter stages).
 */

const { WebSocketServer, WebSocket } = require('ws');

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`\n==================================================`);
console.log(`👻 AR Survival Horror Event Server`);
console.log(`🚀 Running on port: ${PORT}`);
console.log(`🌐 Local address: ws://localhost:${PORT}`);
console.log(`==================================================\n`);

// Connected players registry
const players = new Map();
let nextPlayerIndex = 1;

// Current game world state
const gameState = {
    sessionActive: false,
    currentEncounterZone: 'NONE',
    monsterState: 'DORMANT', // DORMANT, PATROL, STALK, ENCOUNTER, FLEE
    monsterTargetPlayer: null
};

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    
    // Assign player slot (1 to 4)
    let assignedRole = `PLAYER_${nextPlayerIndex++}`;
    if (nextPlayerIndex > 4) nextPlayerIndex = 1; // cycle or limit
    
    players.set(ws, { role: assignedRole, ip });
    console.log(`[CONNECT] New device connected from ${ip}. Assigned: ${assignedRole}`);

    // Send Welcome & Current State to the newly connected player
    ws.send(JSON.stringify({
        type: 'SERVER_HELLO',
        assignedRole,
        gameState,
        timestamp: Date.now()
    }));

    // Broadcast updated player roster to all clients
    broadcastRoster();

    // Handle incoming client messages
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            handleClientMessage(ws, message);
        } catch (err) {
            console.error(`[ERROR] Malformed packet from ${assignedRole}:`, err.message);
        }
    });

    ws.on('close', () => {
        console.log(`[DISCONNECT] ${assignedRole} disconnected.`);
        players.delete(ws);
        broadcastRoster();
    });

    ws.on('error', (err) => {
        console.error(`[SOCKET ERROR] ${assignedRole}:`, err.message);
    });
});

/**
 * Handle incoming events from AR clients
 */
function handleClientMessage(senderWs, msg) {
    const sender = players.get(senderWs);
    const senderRole = sender ? sender.role : 'UNKNOWN';

    switch (msg.type) {
        case 'CHECKPOINT_REACHED':
            console.log(`[EVENT] ${senderRole} reached optical checkpoint: ${msg.nodeId}`);
            // Check if this triggers an encounter
            if (msg.nodeId === 'J01' && gameState.monsterState === 'DORMANT') {
                triggerMonsterState('STALK', senderRole);
            }
            broadcast({
                type: 'PLAYER_CHECKPOINT',
                senderRole,
                nodeId: msg.nodeId,
                timestamp: Date.now()
            });
            break;

        case 'FLASHLIGHT_STATE':
            // Broadcast to other players so their ambient light adjustments reflect teammate's torch
            broadcast({
                type: 'TEAM_FLASHLIGHT',
                senderRole,
                isActive: msg.isActive,
                timestamp: Date.now()
            }, senderWs);
            break;

        case 'FOX_WINDOW_STATE':
            console.log(`[SPECTRAL] ${senderRole} ${msg.isRaised ? 'RAISED' : 'LOWERED'} phone (Fox Window).`);
            broadcast({
                type: 'TEAM_FOX_WINDOW',
                senderRole,
                isRaised: msg.isRaised,
                timestamp: Date.now()
            }, senderWs);
            break;

        default:
            console.log(`[GENERIC EVENT] From ${senderRole}:`, msg);
            broadcast(msg, senderWs);
            break;
    }
}

function triggerMonsterState(newState, targetPlayer = null) {
    gameState.monsterState = newState;
    gameState.monsterTargetPlayer = targetPlayer;
    console.log(`⚠️ [MONSTER FSM] Transitioning to -> ${newState} (Target: ${targetPlayer || 'ALL'})`);
    
    broadcast({
        type: 'MONSTER_STATE_CHANGE',
        state: newState,
        targetPlayer,
        timestamp: Date.now()
    });
}

function broadcastRoster() {
    const roster = Array.from(players.values()).map(p => p.role);
    broadcast({
        type: 'ROSTER_UPDATE',
        players: roster,
        timestamp: Date.now()
    });
}

/**
 * Broadcast payload to all connected clients
 * @param {object} payload 
 * @param {WebSocket} [excludeWs] - Optional socket to skip (e.g. sender)
 */
function broadcast(payload, excludeWs = null) {
    const json = JSON.stringify(payload);
    for (const [client] of players.entries()) {
        if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
            client.send(json);
        }
    }
}
