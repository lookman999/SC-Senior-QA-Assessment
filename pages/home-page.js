export class HomePage {
  constructor(page) {
    this.logo = page.getByRole('img', { name: 'Website for automation practice' });
    this.featuresHeading = page.getByRole('heading', { name: 'Features Items', exact: true });
  }
}
