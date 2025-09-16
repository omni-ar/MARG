const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  }
});

const routeSchema = new mongoose.Schema({
  routeName: { type: String, required: true, unique: true },
  stops: [stopSchema],
  polyline: {
    type: { type: String, enum: ['LineString'], default: 'LineString' },
    coordinates: { type: [[Number]], required: true } // [[lng, lat], ...]
  }
});

routeSchema.index({ 'stops.location': '2dsphere' });
routeSchema.index({ polyline: '2dsphere' });

module.exports = mongoose.model('Route', routeSchema);
