'use client'

import { use, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface Order {
  id: number
  user: string
  item: string
  createdAt: string
}

export default function Order() {
  const [orders, setOrders] = useState<Order[]>([])
  const [newItem, setNewItem] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      if (!res.ok) throw new Error('fetch failed')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
      setLoading(false)
    } catch {
      setError('Impossible de charger les commandes')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const createOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.trim()) return

    setCreating(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: newItem }),
    })
    setCreating(false)

    if (res.ok) {
      setNewItem('')
      loadOrders()
    } else {
      alert('Erreur lors de la création')
    }
  }

  const deleteOrder = async (id: number) => {
    setDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    const res = await fetch(`/api/orders/${deleteId}`, { method: 'DELETE' })
    if (res.ok) loadOrders()
    else alert('Erreur de suppression')
    setIsDeleteDialogOpen(false)
    setDeleteId(null)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    },
    exit: {
      x: -50,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-400 tracking-wider"
        >
          CHARGEMENT...
        </motion.p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-black">{error}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-10 px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h1 className="text-5xl font-light text-black tracking-tight">
                Commandes
              </h1>
            </div>
            <div className="h-px bg-black" />
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={createOrder}
            className="space-y-6"
          >
            <div className="flex items-stretch gap-0 border border-black">
              <input
                type="text"
                placeholder="Nom du produit"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="flex-1 px-6 py-4 text-black placeholder-gray-400 focus:outline-none font-light"
                disabled={creating}
              />
              <button
                type="submit"
                disabled={creating}
                className="px-8 bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 font-light"
              >
                <Plus className="w-4 h-4" />
                {creating ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </motion.form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="h-px bg-black" />

          {/* Orders count */}
          <motion.div variants={itemVariants}>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-light">
              {orders.length} {orders.length === 1 ? 'Commande' : 'Commandes'}
            </p>
          </motion.div>

          {/* Orders list */}
          <motion.div variants={itemVariants} className="space-y-0">
            {orders.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 font-light py-12 text-center"
              >
                Aucune commande
              </motion.p>
            ) : (
              <AnimatePresence mode="popLayout">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="group"
                  >
                    <div className="flex items-center justify-between py-6 border-b border-gray-200 hover:border-black transition-colors">
                      <div className="flex-1 space-y-1">
                        <p className="text-lg font-light text-black">
                          {order.item}
                        </p>
                        <p className="text-xs text-gray-400 tracking-wider">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteOrder(order.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-full"
                          >
                            <X className="w-4 h-4 text-black" />
                          </motion.button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}