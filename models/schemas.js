// schemas.js
const mongoose = require('mongoose');

const interventionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  description: String,
});

const customerSchema = new mongoose.Schema({
  nom: String,
  email: String,
  telephone: String,
  interventions: [interventionSchema],
});

module.exports = { interventionSchema, customerSchema };