import database from '../../../../infra/database.js'

async function statusHandler(req, res) {
  console.log('Database connection test result:', await database.query('SELECT 1'));
  res.status(200).json({ status: 'ok' });
}

export default statusHandler;