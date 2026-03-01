'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Node {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  connections: number[]
}

export default function BlockchainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const nodesRef = useRef<Node[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Initialize nodes
    const nodeCount = Math.min(40, Math.floor((dimensions.width * dimensions.height) / 30000))
    const nodes: Node[] = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        connections: []
      })
    }

    // Create connections (blockchain-like network)
    nodes.forEach((node, i) => {
      const connectionCount = 2 + Math.floor(Math.random() * 2)
      const distances: { index: number; dist: number }[] = []
      
      nodes.forEach((other, j) => {
        if (i !== j) {
          const dist = Math.sqrt(Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2))
          distances.push({ index: j, dist })
        }
      })
      
      distances.sort((a, b) => a.dist - b.dist)
      node.connections = distances.slice(0, connectionCount).map(d => d.index)
    })

    nodesRef.current = nodes

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Update node positions
      nodes.forEach(node => {
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > dimensions.width) node.vx *= -1
        if (node.y < 0 || node.y > dimensions.height) node.vy *= -1

        // Keep within bounds
        node.x = Math.max(0, Math.min(dimensions.width, node.x))
        node.y = Math.max(0, Math.min(dimensions.height, node.y))
      })

      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(connIndex => {
          const other = nodes[connIndex]
          const dist = Math.sqrt(Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2))
          const maxDist = 300
          
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.15
            
            const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y)
            gradient.addColorStop(0, `rgba(255, 215, 0, ${opacity})`)
            gradient.addColorStop(0.5, `rgba(247, 147, 26, ${opacity * 0.7})`)
            gradient.addColorStop(1, `rgba(255, 165, 0, ${opacity})`)
            
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      // Draw nodes
      nodes.forEach(node => {
        // Outer glow
        const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 20)
        glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)')
        glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)')
        
        ctx.beginPath()
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2)
        ctx.fillStyle = glowGradient
        ctx.fill()

        // Inner node
        const nodeGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 4)
        nodeGradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)')
        nodeGradient.addColorStop(1, 'rgba(247, 147, 26, 0.6)')
        
        ctx.beginPath()
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = nodeGradient
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Canvas for blockchain network */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.6 }}
      />
      
      {/* Additional floating hexagons */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          >
            <svg
              width={60 + i * 10}
              height={60 + i * 10}
              viewBox="0 0 100 100"
              className="opacity-20"
            >
              <polygon
                points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="1"
              />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#F7931A" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Animated circles */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.03) 0%, transparent 70%)',
          left: '10%',
          top: '20%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(247, 147, 26, 0.02) 0%, transparent 70%)',
          right: '-10%',
          bottom: '-20%',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 215, 0, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  )
}
