const mongoose = require('mongoose');

// Cards and columns are embedded so the whole board saves atomically —
// which makes drag-and-drop reordering a single, simple update.
const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  label: { type: String, default: '' }, // color name: none/red/yellow/green/blue/purple
  due: { type: Date, default: null },
});

const columnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cards: [cardSchema],
});

const boardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    color: { type: String, default: 'indigo' },
    columns: [columnSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Board || mongoose.model('Board', boardSchema);
