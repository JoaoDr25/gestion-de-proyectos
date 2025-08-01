import mongoose from 'mongoose';

const subTaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['pendiente', 'en progreso', 'completada'],
    default: 'pendiente'
  },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now }
}, { _id: false }); 

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['alta', 'media', 'baja'],
    default: 'media'
  },
  assignedTo: { type: mongoose.Schema.ObjectId, ref: 'User' },
  dueDate: Date,
  subTasks: [subTaskSchema],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', taskSchema);


