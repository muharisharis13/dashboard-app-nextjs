// db.js
import mysql from 'serverless-mysql';
const db = mysql({
  config: {
    host: 'localhost',
    port: 3306,
    database: 'db_toko_haris',
    user: 'root',
    password: ''
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