import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { Home, Camera, Plus, Wallet, Settings, X, TrendingUp, TrendingDown, Receipt } from 'lucide-react';

function App() {
  const transactions = useLiveQuery(() => db.transactions.orderBy('date').reverse().toArray());
  const categories = useLiveQuery(() => db.categories.toArray());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  // Calculate totals
  const totalIncome = transactions?.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0) || 0;
  const totalExpense = transactions?.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0) || 0;
  const balance = totalIncome - totalExpense;

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !merchant || !categoryId) return;

    await db.transactions.add({
      amount: parseFloat(amount),
      date: new Date(),
      merchant,
      categoryId: parseInt(categoryId),
      type
    });

    setIsModalOpen(false);
    setAmount('');
    setMerchant('');
    setCategoryId('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* HEADER */}
      <header className="px-5 py-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm z-10 sticky top-0">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Wallet className="text-blue-500" /> FinTrack
        </h1>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Settings size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </header>

      {/* BODY (Scrollable Area) */}
      <main className="flex-1 overflow-y-auto p-5 space-y-6 pb-24">
        
        {/* Balance Card */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-blue-100 text-sm font-medium mb-1 opacity-80">Total Balance</p>
          <h2 className="text-4xl font-bold tracking-tight">${balance.toFixed(2)}</h2>
        </section>

        {/* Income & Expense Summary */}
        <section className="flex gap-4">
          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Income</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">${totalIncome.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full text-red-600 dark:text-red-400">
              <TrendingDown size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Expense</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">${totalExpense.toFixed(2)}</p>
            </div>
          </div>
        </section>

        {/* Recent Transactions List */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold">Recent Activity</h3>
            <button className="text-sm text-blue-500 font-medium">View All</button>
          </div>
          
          <div className="space-y-3">
            {transactions?.slice(0, 10).map((t) => {
              const cat = categories?.find(c => c.id === t.categoryId);
              return (
                <div key={t.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner" style={{ backgroundColor: cat?.color || '#9ca3af' }}>
                      {cat?.name.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{t.merchant}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cat?.name} • {t.date.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-lg ${t.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                    {t.type === 'expense' ? '-' : '+'}${t.amount.toFixed(2)}
                  </p>
                </div>
              );
            })}
            
            {(!transactions || transactions.length === 0) && (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <Receipt className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 font-medium">No transactions yet.</p>
                <p className="text-sm text-gray-400 mt-1">Add one manually or scan a receipt!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER (Bottom Navigation) */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe fixed bottom-0 w-full z-20">
        <div className="flex justify-around items-center px-6 py-3 max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 text-blue-600 dark:text-blue-400">
            <Home size={24} />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          
          {/* Center Scan Action */}
          <div className="relative -top-6">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl hover:scale-105 transition-all flex items-center justify-center ring-4 ring-gray-50 dark:ring-gray-900"
              title="Scan Receipt"
              onClick={() => alert('Receipt scanner opening soon!')}
            >
              <Camera size={28} />
            </button>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <Plus size={24} />
            <span className="text-[10px] font-medium">Manual</span>
          </button>
        </div>
      </footer>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 pb-8 sm:p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">New Transaction</h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-5">
              <div className="flex bg-gray-100 dark:bg-gray-700 p-1.5 rounded-xl">
                <button type="button" onClick={() => setType('expense')} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${type === 'expense' ? 'bg-white dark:bg-gray-600 shadow-sm text-red-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Expense</button>
                <button type="button" onClick={() => setType('income')} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${type === 'income' ? 'bg-white dark:bg-gray-600 shadow-sm text-green-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Income</button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full pl-8 p-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg font-semibold" placeholder="0.00" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Merchant / Title</label>
                <input required type="text" value={merchant} onChange={e => setMerchant(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium" placeholder="e.g. Walmart, Salary" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium appearance-none">
                  <option value="" disabled>Select a category</option>
                  {categories?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-2xl mt-6 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]">
                Save Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
