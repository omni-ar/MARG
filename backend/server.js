const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

require("dotenv").config({ path: "../.env" });

const app = express();
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Backend chal gya GAON WALON!");
});

// Routes
const userRoutes = require('./routes/userRoutes');
const busRoutes = require('./routes/busRoutes');
const routeRoutes = require('./routes/routeRoutes');
const tripRoutes = require('./routes/tripHistoryRoutes');

app.use('/users', userRoutes);
app.use('/buses', busRoutes);
app.use('/routes', routeRoutes);
app.use('/trips', tripRoutes);

// Create HTTP server for WebSockets
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend
    methods: ["GET", "POST"]
  }
});

// Bus model
const Bus = require('./models/bus.model');

// WebSocket connections
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  // Driver sends location update
  socket.on('updateLocation', async (data) => {
    const { busId, lat, lng } = data;
    console.log(`📍 Bus ${busId} at (${lat}, ${lng})`);

    // Save to DB
    await Bus.findByIdAndUpdate(busId, {
      currentLocation: { lat, lng }
    });

    // Broadcast to all commuters
    io.emit('busLocationUpdate', { busId, lat, lng });
  });

  // Trip start event
  socket.on('tripStarted', (data) => {
    io.emit('tripStatusUpdate', { ...data, status: "started" });
  });

  // Trip end event
  socket.on('tripEnded', (data) => {
    io.emit('tripStatusUpdate', { ...data, status: "ended" });
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error(err));
