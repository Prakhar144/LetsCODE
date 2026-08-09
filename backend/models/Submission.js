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

submissionSchema.index({ user_id: 1, problem_id: 1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ created_at: -1 });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
