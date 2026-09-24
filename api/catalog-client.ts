import { BaseClient } from './base-client';

export class CatalogClient extends BaseClient {
  products() {
    return this.send('GET', '/api/productsList');
  }
  brands() {
    return this.send('GET', '/api/brandsList');
  }
  search(term: string) {
    return this.send('POST', '/api/searchProduct', { search_product: term });
  }
  searchWithoutParameter() {
    return this.send('POST', '/api/searchProduct', {});
  }
}
