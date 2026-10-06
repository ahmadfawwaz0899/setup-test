import Dexie, { type Table } from 'dexie';

export interface Transaction {
  id?: number;
  amount: number;
  date: Date;
  merchant: string;
  categoryId: number;
  notes?: string;
  type: 'income' | 'expense';
}

export interface Category {
  id?: number;
  name: string;
  icon: string;
  color: string;
}

export class FinancialTrackerDB extends Dexie {
  transactions!: Table<Transaction>;
  categories!: Table<Category>;

  constructor() {
    super('FinancialTrackerDB');
    this.version(1).stores({
      transactions: '++id, amount, date, merchant, categoryId, type',
      categories: '++id, name'
    });
  }
}

export const db = new FinancialTrackerDB();

// Seed initial categories if empty
db.on('populate', () => {
  db.categories.bulkAdd([
    { name: 'Food & Dining', icon: 'utensils', color: '#ef4444' },
    { name: 'Transport', icon: 'car', color: '#3b82f6' },
    { name: 'Shopping', icon: 'shopping-cart', color: '#10b981' },
    { name: 'Salary', icon: 'banknote', color: '#8b5cf6' }
  ]);
});
