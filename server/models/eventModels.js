const { Pool } = require('pg');

const connectionString = 'postgres://nxyiexut:Xc5Fa57uHaYDy2AhRGKWPKeFxNA3UWWt@isilo.db.elephantsql.com:5432/nxyiexut';

const pool = new Pool({
	connectionString: connectionString
});

module.exports = {
	pool: pool,
	query: (text, params, callback) => {
		console.log('executed query', text);
		return pool.query(text, params, callback);
	}
};