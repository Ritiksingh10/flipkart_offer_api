import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  bank: {
    type: String,
    required: true,
    lowercase: true, // ensure it's stored in lowercase
    trim: true
  },
  offerText: {
    type: String,
    required: true,
    lowercase: true, // ensure it's stored in lowercase
    trim: true
  },
  offerDescription: {
    type: String,
    required: true,
    lowercase: true, // ensure it's stored in lowercase
    trim: true
  },
  paymentInstruments: {
    type: [String],
    enum: ['CREDIT', 'EMI_OPTIONS', 'DEBIT', 'UPI', 'NETBANKING', 'OTHERS'],
    default: [],
  }
}, { timestamps: true });

// Ensure uniqueness
offerSchema.index(
  { bank: 1, offerText: 1, offerDescription: 1 },
  { unique: true }
);

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;