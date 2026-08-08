import mongoose from 'mongoose';

const feedPostSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    default: ''
  },
  likes: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('FeedPost', feedPostSchema);
