import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { Plus, Camera, Wallet } from 'lucide-react';

function App() {
  const transactions = useLiveQuery(() => db.transactions.toArray());
  const categories = useLiveQuery(() => db.categories.toArray());

  const addDummyTransaction = async () => {
    if (!categories || categories.length === 0) return;
    await db.transactions.add({
      amount: Math.floor(Math.random() * 50) + 10,
      date: new Date(),
      merchant: 'Coffee Shop',
      categoryId: categories[0].id!,
      type: 'expense'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 pb-24">
      <header className="flex justify-between items-center py-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="text-blue-500" /> FinTracker
        </h1>
      </header>

      <main className="space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-blue-100 text-sm font-medium mb-1">Total Balance</p>
          <h2 className="text-4xl font-bold">$1,240.00</h2>
        </div>

        {/* Transactions List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions?.map((t) => (
              <div key={t.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-medium">{t.merchant}</p>
                  <p className="text-sm text-gray-500">{t.date.toLocaleDateString()}</p>
                </div>
                <p className={`font-bold ${t.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                  {t.type === 'expense' ? '-' : '+'}${t.amount.toFixed(2)}
                </p>
              </div>
            ))}
            {(!transactions || transactions.length === 0) && (
              <p className="text-gray-500 text-center py-8">No transactions yet.</p>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4">
        <button 
          className="bg-gray-800 dark:bg-gray-700 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
          title="Scan Receipt"
        >
          <Camera size={24} />
        </button>
        <button 
          onClick={addDummyTransaction}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
          title="Add Transaction"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}

export default App;
