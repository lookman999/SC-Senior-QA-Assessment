export class BaseClient {
  constructor(request) {
    this.request = request;
  }
  async send(method, path, form) {
    const response = await this.request.fetch(path, { method, form, maxRedirects: 0 });
    try {
      return { httpStatus: response.status(), body: await response.json() };
    } finally {
      await response.dispose();
    }
  }
}
