import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problem_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
