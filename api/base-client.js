export class BaseClient {
  constructor(request) {
    this.request = request;
  }
  async send(method, path, form) {
    const response = await this.request.fetch(path, { method, form, maxRedirects: 0 });
    try {
      const contentType = response.headers()['content-type'] ?? '';
      const text = await response.text();
      // This API labels its JSON responses as text/html.
      if (contentType.includes('json') || /^[\s]*[\[{]/.test(text)) {
        try {
          return { httpStatus: response.status(), body: JSON.parse(text) };
        } catch {
          throw new Error(`${method} ${path}: HTTP ${response.status()} returned invalid JSON`);
        }
      }
      const preview = text
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 200);
      throw new Error(
        `${method} ${path}: HTTP ${response.status()} returned ${contentType || 'unknown content type'}: ${preview || '(empty response)'}`,
      );
    } finally {
      await response.dispose();
    }
  }
}
