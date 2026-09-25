import { BaseClient } from './base-client.js';
export class CatalogClient extends BaseClient {
  products() {
    return this.send('GET', '/api/productsList');
  }
  brands() {
    return this.send('GET', '/api/brandsList');
  }
  search(term) {
    return this.send('POST', '/api/searchProduct', { search_product: term });
  }
}
