const mongoose = require('mongoose');

const tripHistorySchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date }
});

module.exports = mongoose.model('TripHistory', tripHistorySchema);
