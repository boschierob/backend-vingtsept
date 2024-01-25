const mongoose = require("mongoose");
const { customerSchema } = require('./schemas.js');
const MonthlySheet = require('./monthlySheetSchema'); 


const UserSchema = new mongoose.Schema({
    nom: String,
    email: { type: String, required: true, unique: true },
    telephone: String,
    motDePasse: { type: String, required: true },
    statut: { type: String, enum: ['Admin', 'Manager', 'Employee', 'External'] },
    customers: [customerSchema],
    monthlySheets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MonthlySheet',
    }],
  })
  
  const User = mongoose.model('User', UserSchema);

module.exports = User;
