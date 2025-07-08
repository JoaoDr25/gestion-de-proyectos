import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: { type: String, enum: ['activo', 'en progreso', 'completado'], default: 'activo'},
    visibility: { type: String, enum: ['privado', 'publico'], default: 'privado' },
    priority: {type: String, enum: ['alta', 'media', 'baja'], default: 'media'},
    owner: { type:mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [String],
    startDate: Date,
    endDate: Date,
    createAt: { type: Date, default: Date.now }
});

export default mongoose.model ('Project', projectSchema);