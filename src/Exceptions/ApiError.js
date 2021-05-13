class ApiError extends Error {
  constructor(status, content) {
    super(content);
    this.type = "ApiError";
    this.status = status;
    this.content = content;
  }
}

export default ApiError;
