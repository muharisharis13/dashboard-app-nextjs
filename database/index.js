// db.js
import mysql from 'serverless-mysql';
const db = mysql({
  config: {
    host: 'sql12.freesqldatabase.com',
    port: 3306,
    database: 'sql12593375',
    user: 'sql12593375',
    password: 'RSu79laP9H'
  }
});
export default async function excuteQuery({ query }) {
  try {
    const results = await db.query(query);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}