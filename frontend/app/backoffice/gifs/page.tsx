'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, Copy, X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Gif {
  id: string
  url: string
  title: string
}

interface FavoriteWithGif {
  id: number
  gifId: string
  createdAt: string
  gif: Gif
}

export default function GifsPage() {
  const [query, setQuery] = useState('')
  const [gifs, setGifs] = useState<Gif[]>([])
  const [favorites, setFavorites] = useState<FavoriteWithGif[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingFavorites, setLoadingFavorites] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [notification, setNotification] = useState<{ message: string; show: boolean }>({ message: '', show: false })

  useEffect(() => {
    loadFavorites()
  }, [])

  const showNotification = (message: string) => {
    setNotification({ message, show: true })
    setTimeout(() => setNotification({ message: '', show: false }), 2000)
  }

  const searchGifs = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/gifs/search?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        setGifs(data)
      } else {
        showNotification('Erreur lors de la recherche')
      }
    } catch (error) {
      showNotification('Erreur réseau')
    }
    setLoading(false)
  }

  const loadFavorites = async () => {
    try {
      const res = await fetch('/api/gifs/favorites')
      if (res.ok) {
        const data = await res.json()
        setFavorites(data)
      }
      setLoadingFavorites(false)
    } catch (error) {
      console.error('Erreur chargement favoris', error)
      setLoadingFavorites(false)
    }
  }

  const addToFavorites = async (gif: Gif) => {
    try {
      const res = await fetch('/api/gifs/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gifId: gif.id }),
      })
      if (res.ok) {
        showNotification('Ajouté aux favoris')
        loadFavorites()
      } else {
        showNotification('Erreur ajout favori')
      }
    } catch (error) {
      showNotification('Erreur réseau')
    }
  }

  const deleteFavorite = (id: number) => {
    setDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/gifs/favorites/${deleteId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        showNotification('Favori supprimé')
        loadFavorites()
      } else {
        showNotification('Erreur suppression')
      }
    } catch (error) {
      showNotification('Erreur réseau')
    }
    setIsDeleteDialogOpen(false)
    setDeleteId(null)
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    showNotification('URL copiée')
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

  if (loadingFavorites) {
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

  return (
    <main className="min-h-screen bg-white">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 text-sm tracking-wider z-50"
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto py-10 px-6">
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
                Recherche de GIFs
              </h1>
            </div>
            <div className="h-px bg-black" />
          </motion.div>

          {/* Search Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={searchGifs}
            className="space-y-6"
          >
            <div className="flex items-stretch gap-0 border border-black">
              <input
                type="text"
                placeholder="Rechercher des GIFs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-6 py-4 text-black placeholder-gray-400 focus:outline-none font-light"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 font-light"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>
          </motion.form>

          {/* Search Results */}
          {gifs.length > 0 && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
            >
              <div className="h-px bg-black" />
              <p className="text-xs uppercase tracking-widest text-gray-500 font-light">
                {gifs.length} {gifs.length === 1 ? 'Résultat' : 'Résultats'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {gifs.map((gif) => (
                    <motion.div
                      key={gif.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group border border-gray-200 hover:border-black transition-colors"
                    >
                      <div className="aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={gif.url}
                          alt={gif.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-3">
                        <p className="text-sm font-light text-black line-clamp-2">
                          {gif.title}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToFavorites(gif)}
                            className="flex-1 py-2 border border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 font-light text-sm"
                          >
                            <Heart className="w-4 h-4" />
                            Favori
                          </button>
                          <button
                            onClick={() => copyUrl(gif.url)}
                            className="py-2 px-3 border border-gray-300 hover:border-black transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Favorites Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="h-px bg-black" />
            <div>
              <h2 className="text-3xl font-light text-black tracking-tight">
                Mes Favoris
              </h2>
            </div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-light">
              {favorites.length} {favorites.length === 1 ? 'Favori' : 'Favoris'}
            </p>

            {favorites.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 font-light py-12 text-center"
              >
                Aucun favori
              </motion.p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {favorites.map((fav) => (
                    <motion.div
                      key={fav.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="group border border-gray-200 hover:border-black transition-colors"
                    >
                      {fav.gif ? (
                        <>
                          <div className="aspect-video overflow-hidden bg-gray-100 relative">
                            <img
                              src={fav.gif.url}
                              alt={fav.gif.title}
                              className="w-full h-full object-cover"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteFavorite(fav.id)}
                              className="absolute top-2 right-2 opacity- group-hover:opacity-100 transition-opacity p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg"
                            >
                              <X className="w-4 h-4 text-black" />
                            </motion.button>
                          </div>
                          <div className="p-4 space-y-3">
                            <p className="text-sm font-light text-black line-clamp-2">
                              {fav.gif.title}
                            </p>
                            <p className="text-xs text-gray-400 tracking-wider">
                              {new Date(fav.createdAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </p>
                            <button
                              onClick={() => copyUrl(fav.gif.url)}
                              className="w-full py-2 border border-gray-300 hover:border-black transition-colors flex items-center justify-center gap-2 font-light text-sm"
                            >
                              <Copy className="w-4 h-4" />
                              Copier URL
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="p-4">
                          <p className="text-sm text-gray-400">GIF non trouvé</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce favori ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}