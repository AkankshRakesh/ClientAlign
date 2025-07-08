import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  goals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;
