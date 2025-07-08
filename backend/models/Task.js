const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  status: { type: String, enum: ['To-do', 'In Progress', 'Done'], default: 'To-do' },
  deadline: Date,
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
