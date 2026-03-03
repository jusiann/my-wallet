// Database schema definition
const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  // fields
});

module.exports = mongoose.model('Example', exampleSchema);
