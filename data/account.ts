import { randomBytes, randomUUID } from 'node:crypto';

export interface Account {
  name: string;
  email: string;
  password: string;
  title: 'Mr';
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}

export function newAccount(): Account {
  const id = randomUUID().replaceAll('-', '');
  return {
    name: `QA ${id.slice(0, 8)}`,
    email: `qa-${id}@example.com`,
    password: `Qa!${randomBytes(18).toString('hex')}`,
    title: 'Mr',
    birth_date: '15',
    birth_month: '6',
    birth_year: '1995',
    firstname: 'Alex',
    lastname: 'Tester',
    company: 'QA Practice',
    address1: '100 Test Street',
    address2: 'Suite 2',
    country: 'Singapore',
    zipcode: '123456',
    state: 'Central',
    city: 'Singapore',
    mobile_number: '0000000000',
  };
}

// Dummy payment values belong only to this practice checkout; never use real cards.
export const practicePayment = {
  name: 'Alex Tester',
  number: '4242424242424242',
  cvc: '123',
  month: '12',
  year: String(new Date().getFullYear() + 2),
};
