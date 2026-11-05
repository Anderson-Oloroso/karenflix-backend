export default class HistoryUserModel {
  #db;

  constructor(db) {
    this.#db = db;
  }

  async createHistory(history, connection = this.#db) {
    const [result] = await connection.execute(
      `INSERT INTO history_users (
        user_id, action_type, status_code, url
      )
      VALUES (?, ?, ?, ?)`,
      [
        history.user_id,
        history.action_type,
        history.status_code,
        history.url
      ]
    );
    return result;
  }

  async getUserById(userId, filters = {}) {
    const { action_type, start_date, end_date } = filters;
    let query = `SELECT * FROM history_users WHERE user_id = ?`;
    const params = [userId];

    if (action_type) {
      query += ` AND action_type = ?`;
      params.push(action_type);
    }

    if (start_date) {
      query += ` AND created_at >= ?`;
      params.push(start_date);
    }

    if (end_date) {
      query += ` AND created_at <= ?`;
      params.push(end_date);
    }

    query += ` ORDER BY created_at DESC`;   

    const [rows] = await this.#db.execute(query, params);
    return rows;
  }
}
