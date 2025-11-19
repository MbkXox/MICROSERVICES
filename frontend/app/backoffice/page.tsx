'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container, Server, Box } from 'lucide-react'

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const objectives = [
    {
      icon: <Server className="w-6 h-6" />,
      title: "Exécution locale"
    },
    {
      icon: <Container className="w-6 h-6" />,
      title: "Docker Compose"
    },
    {
      icon: <Box className="w-6 h-6" />,
      title: "Kubernetes"
    }
  ]

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-10 px-6">
        <motion.div
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          variants={containerVariants}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-6xl font-light text-black tracking-tight">
                Microservice
              </h1>
              <h2 className="text-6xl font-light text-black tracking-tight">
                DevOps
              </h2>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Badge variant="outline" className="border-black text-black px-4 py-1.5 rounded-none font-normal">
                M1 EFREI
              </Badge>
              <span className="text-gray-600">Matis M'barek</span>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div 
            variants={itemVariants}
            className="h-px bg-black"
          />

          {/* Objectif */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-light">
              Objectif
            </h3>
            <p className="text-xl font-light text-black leading-relaxed">
              Concevoir, développer, conteneuriser et déployer un nouveau micro-service dans l'architecture existante du cours.
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div 
            variants={itemVariants}
            className="h-px bg-black"
          />

          {/* Environnements */}
          <motion.div variants={itemVariants} className="space-y-8">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-light">
              Environnements
            </h3>
            
            <div className="grid grid-cols-3 gap-px bg-black">
              {objectives.map((obj, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white p-8 flex flex-col items-center justify-center space-y-4 min-h-[180px]"
                >
                  <div className="text-black">
                    {obj.icon}
                  </div>
                  <p className="text-center text-sm font-light text-black">
                    {obj.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div 
            variants={itemVariants}
            className="pt-8"
          >
            <p className="text-xs text-gray-400 font-light tracking-wider">
              REPOSITORY GITHUB · DOCUMENTATION COMPLÈTE
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}