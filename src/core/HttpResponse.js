class HttpResponse extends Error {
  constructor(status, content) {
    super(content);
    this.type = "HttpResponse";
    this.status = status;
    this.content = content;
  }
}

export default HttpResponse;
