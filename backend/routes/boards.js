const express = require('express');
const Board = require('../models/Board');
const { protect } = require('../middleware/auth');

const router = express.Router();
const owned = async (id, userId) => Board.findOne({ _id: id, user: userId });

router.use(protect);

// GET /api/boards — summaries for the current user
router.get('/', async (req, res) => {
  const boards = await Board.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(
    boards.map((b) => ({
      _id: b._id, title: b.title, color: b.color,
      columns: b.columns.length,
      cards: b.columns.reduce((a, c) => a + c.cards.length, 0),
      updatedAt: b.updatedAt,
    }))
  );
});

// GET /api/boards/:id — full board
router.get('/:id', async (req, res) => {
  const board = await owned(req.params.id, req.user._id);
  if (!board) return res.status(404).json({ message: 'Board not found' });
  res.json(board);
});

// POST /api/boards — create with default columns
router.post('/', async (req, res) => {
  const board = await Board.create({
    user: req.user._id,
    title: req.body.title || 'Untitled board',
    color: req.body.color || 'indigo',
    columns: [
      { title: 'To Do', cards: [] },
      { title: 'In Progress', cards: [] },
      { title: 'Done', cards: [] },
    ],
  });
  res.status(201).json(board);
});

// PUT /api/boards/:id — save full board (title, color, columns, cards, order)
router.put('/:id', async (req, res) => {
  const board = await owned(req.params.id, req.user._id);
  if (!board) return res.status(404).json({ message: 'Board not found' });
  const { title, color, columns } = req.body;
  if (title !== undefined) board.title = title;
  if (color !== undefined) board.color = color;
  if (columns !== undefined) board.columns = columns;
  await board.save();
  res.json(board);
});

// DELETE /api/boards/:id
router.delete('/:id', async (req, res) => {
  const board = await owned(req.params.id, req.user._id);
  if (!board) return res.status(404).json({ message: 'Board not found' });
  await board.deleteOne();
  res.json({ message: 'Board deleted' });
});

module.exports = router;
