export class HistoryUserDto {
  constructor(historyUser = {}) {
    this.id = historyUser.id;
    this.user_id = historyUser.user_id;
    this.action_type = historyUser.action_type;
    this.status_code = historyUser.status_code;
    this.url = historyUser.url;
    this.created_at = historyUser.created_at;
  }

  get data() {
    return {
      id: this.id,
      user_id: this.user_id,
      action_type: this.action_type,
      status_code: this.status_code,
      url: this.url,
      created_at: this.created_at
    };
  }

  static fromArray(rows = []) {
    return rows.map(item => new HistoryUserDto(item).data);
  }
}