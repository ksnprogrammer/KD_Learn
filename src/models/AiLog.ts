import mongoose from 'mongoose';

const AiLogSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const AiLog = mongoose.models.AiLog || mongoose.model('AiLog', AiLogSchema);

export default AiLog;
