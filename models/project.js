import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  status: {
    type: String,
    enum: ['activo', 'en progreso', 'completado'],
    default: 'activo'
  },
  visibility: {
    type: String,
    enum: ['privado', 'publico'],
    default: 'privado'
  },
  priority: {
    type: String,
    enum: ['alta', 'media', 'baja'],
    default: 'media'
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  tags: { type: [String], default: [] },
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now }
});


projectSchema.pre('save', function (next) {
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    return next(new Error('La fecha de finalización no puede ser anterior a la de inicio.'));
  }
  next();
});

export default mongoose.model('Project', projectSchema);
