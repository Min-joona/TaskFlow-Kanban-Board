/** Seed the kanban database. Usage: npm run seed */
require('dotenv').config();
const mongoose = require('mongoose');
const runSeed = require('./seedRunner');

runSeed()
  .then((r) => {
    console.log(`✓ Seeded ${r.users} user and ${r.boards} boards.`);
    console.log('  Login: amar@taskflow.io / demo123');
    return mongoose.connection.close();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exit(1);
  });
