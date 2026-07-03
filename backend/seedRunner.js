/** Core seed logic, reused by the CLI (seed.js) and the guarded /api/seed route. */
const connectDB = require('./config/db');
const User = require('./models/User');
const Board = require('./models/Board');

async function runSeed() {
  await connectDB();
  await Promise.all([User.deleteMany(), Board.deleteMany()]);

  const user = await User.create({ name: 'Amar Hassen', email: 'amar@taskflow.io', password: 'demo123' });

  await Board.create({
    user: user._id,
    title: 'Portfolio Launch',
    color: 'indigo',
    columns: [
      { title: 'Backlog', cards: [
        { title: 'Buy custom domain', label: 'blue' },
        { title: 'Write case studies', description: 'One per project — problem, solution, result.', label: 'yellow' },
      ] },
      { title: 'To Do', cards: [
        { title: 'Deploy e-commerce API', label: 'red' },
        { title: 'Record demo videos', label: 'purple' },
        { title: 'Set up MongoDB Atlas', label: 'blue' },
      ] },
      { title: 'In Progress', cards: [
        { title: 'Polish Prime Pair mascots', description: 'Tweak Ghefi & Lethe colors.', label: 'green' },
      ] },
      { title: 'Done', cards: [
        { title: 'Build 6 portfolio projects', label: 'green' },
        { title: 'Set up GitHub repos', label: 'green' },
      ] },
    ],
  });

  await Board.create({
    user: user._id,
    title: 'Personal Goals 2026',
    color: 'emerald',
    columns: [
      { title: 'This Week', cards: [{ title: 'Apply to 3 jobs', label: 'red' }, { title: 'Read 30 pages/day', label: 'yellow' }] },
      { title: 'This Month', cards: [{ title: 'Finish React course', label: 'blue' }] },
      { title: 'Done', cards: [{ title: 'Launch portfolio', label: 'green' }] },
    ],
  });

  return { users: 1, boards: 2 };
}

module.exports = runSeed;
