// MonthlySheetSchema.js
const mongoose = require('mongoose');

const interventionSchema = new mongoose.Schema({
  related_worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
  },
  date_intervention: {
    type: String,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  description:String,
  declared_at: {
    type: String,
    required: true,
  }
});

const Intervention = mongoose.model('Intervention', interventionSchema);

module.exports = Intervention;
