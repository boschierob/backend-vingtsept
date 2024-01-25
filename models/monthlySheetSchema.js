// MonthlySheet.js
const mongoose = require('mongoose');
const { customerSchema } = require('./Schemas');

const monthlySheetSchema = new mongoose.Schema({
  related_worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
  },
  month: String,
  customers: [customerSchema],
});

const MonthlySheet = mongoose.model('MonthlySheet', monthlySheetSchema);

module.exports = MonthlySheet;
