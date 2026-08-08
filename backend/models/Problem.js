import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  test_cases: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: []
  }
});

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
