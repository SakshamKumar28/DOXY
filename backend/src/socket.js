const { Server } = require('socket.io');

const socketHandler = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [process.env.CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.id}`);

        // Join a specific appointment room
        socket.on('join-room', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
            
            // Notify others in the room
            socket.to(roomId).emit('user-joined', socket.id);
        });

        // Handle WebRTC signaling data (offer, answer, candidate)
        socket.on('signal', (data) => {
            const { roomId, signalData, target } = data;
            // Send signal to specific target or broadcast to room (depending on mesh/sfu architecture, usually mesh for simple 1:1)
            // For 1:1, we can just broadcast to the room excluding sender
            socket.to(roomId).emit('signal', { signalData, sender: socket.id });
        });

        socket.on('disconnect', () => {
            console.log('User Disconnected', socket.id);
            // Optionally emit user-left event to rooms
        });
    });
};

module.exports = socketHandler;
