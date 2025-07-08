import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.ObjectId, Ref: 'Project'},
    name: String,
    description: String,
    status: { type: String, enum: ['alta', 'media', 'baja'], default: 'media'},
    assignedTo: { type: mongoose.Schema.ObjectId, Ref: 'User'},
    dueDate: Date,
    subTasks: [{ type: mongoose.Schema.ObjectId, Ref: 'Task'}],
    comments: [{
        user: { type: mongoose.Schema.ObjectId, Ref: 'User'},
        content: String,
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', taskSchema);

