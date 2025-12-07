import { PrismaClient } from '@prisma/client'
import { addSubscription, deleteSubscription } from './actions'
import { Trash2, Plus, CreditCard, Calendar, TrendingUp } from 'lucide-react'

const prisma = new PrismaClient()

export default async function Home() {
  const subs = await prisma.subscription.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Petite astuce TS : "acc: number" force le type pour éviter l'erreur de tout à l'heure
  const total = subs.reduce((acc: number, sub) => acc + sub.price, 0)

  // Petite fonction pour la couleur des badges
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Divertissement': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'Professionnel': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'Maison': return 'bg-green-500/20 text-green-300 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <main className="min-h-screen bg-[#0F172A] text-slate-200 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER & TOTAL */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-xl">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              SubFlow
            </h1>
            <p className="text-slate-400 text-sm mt-1">Gérez vos dépenses récurrentes</p>
          </div>
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-700/50 flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Total Mensuel</p>
              <p className="text-2xl font-bold text-white">{total.toFixed(2)} €</p>
            </div>
          </div>
        </header>

        {/* FORMULAIRE (Mobile Friendly) */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-indigo-400" /> Nouvel abonnement
          </h2>
          <form action={addSubscription} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400 ml-1">Nom</label>
              <input name="name" type="text" placeholder="Ex: Netflix" required 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400 ml-1">Prix (€)</label>
              <input name="price" type="number" step="0.01" placeholder="14.99" required 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <div className="space-y-1">
               <label className="text-xs font-medium text-slate-400 ml-1">Catégorie</label>
               <select name="category" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-300 appearance-none cursor-pointer">
                 <option value="Divertissement">Divertissement</option>
                 <option value="Professionnel">Professionnel</option>
                 <option value="Maison">Maison</option>
                 <option value="Autre">Autre</option>
               </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400 ml-1">Date</label>
              <input name="startDate" type="date" required 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-400" />
            </div>

            <button type="submit" className="md:col-span-4 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl font-medium transition-colors flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20 mt-2">
              <Plus size={18} /> Ajouter l'abonnement
            </button>
          </form>
        </div>

        {/* LISTE DES CARTES (Grid View) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subs.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
              <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
              <p>Aucun abonnement. Ajoutez-en un !</p>
            </div>
          ) : (
            subs.map((sub) => (
              <div key={sub.id} className="group bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 relative overflow-hidden">
                
                {/* Petit effet de gradient en fond */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 pointer-events-none" />

                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getCategoryColor(sub.category)}`}>
                    {sub.category.toUpperCase()}
                  </span>
                  <form action={deleteSubscription.bind(null, sub.id)}>
                    <button className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-400/10">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{sub.name}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                  <Calendar size={14} />
                  <span>Le {new Date(sub.startDate).getDate()} du mois</span>
                </div>

                <div className="flex items-end justify-between border-t border-slate-700/50 pt-4 mt-auto">
                   <span className="text-xs text-slate-500">Coût mensuel</span>
                   <span className="text-2xl font-bold text-white">{sub.price.toFixed(2)} €</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER - DISCLAIMER MODE DÉMO */}
        <footer className="mt-12 py-6 border-t border-slate-800 text-center">
          <p className="text-amber-400/80 text-sm font-medium mb-2">
            ⚠️ Mode Démo Publique
          </p>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Cette application est une démonstration technique. Toutes les données ajoutées sont visibles par tous les visiteurs et réinitialisées régulièrement.
          </p>
          
          <div className="mt-4">
             <a 
               href="https://github.com/kyliango/subflow-portfolio" 
               target="_blank" 
               className="text-indigo-400 hover:text-indigo-300 text-xs underline decoration-indigo-500/30 underline-offset-4 transition-colors"
             >
               Voir le code source sur GitHub
             </a>
          </div>
        </footer>

      </div>
    </main>
  )
}