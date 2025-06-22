import { useEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const API_URL = 'http://localhost:8000/vulns'

function App() {
  const [vulns, setVulns] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [konamiCode, setKonamiCode] = useState([])
  const [showShamanicMessage, setShowShamanicMessage] = useState(false)
  const [formData, setFormData] = useState({
    site: '',
    title: '',
    risk: 'medium',
    description: '',
    recommendation: '',
    price: 0,
    tags: '',
    status: 'detected'
  })
  
  const siteInputRef = useRef(null)

  // Konami Code Easter Egg
  useEffect(() => {
    const handleKeyDown = (e) => {
      const newCode = [...konamiCode, e.key]
      if (newCode.length > 10) newCode.shift()
      setKonamiCode(newCode)
      
      const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']
      if (JSON.stringify(newCode) === JSON.stringify(konami)) {
        setShowShamanicMessage(true)
        setTimeout(() => setShowShamanicMessage(false), 5000)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [konamiCode])

  // Particle Effects
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = Math.random() * window.innerWidth + 'px'
      particle.style.animationDelay = Math.random() * 20 + 's'
      document.body.appendChild(particle)
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      }, 20000)
    }

    const interval = setInterval(createParticle, 2000)
    return () => clearInterval(interval)
  }, [])

  const fetchVulns = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setVulns(data)
    } catch (error) {
      console.error('Error fetching vulnerabilities:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchVulns()
    // Autofocus on site URL field
    if (siteInputRef.current) {
      siteInputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.site.trim() || !formData.title.trim()) return
    
    const vulnData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      price: parseFloat(formData.price) || 0
    }

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vulnData),
      })
      
      // Clear form and show success
      setFormData({
        site: '',
        title: '',
        risk: 'medium',
        description: '',
        recommendation: '',
        price: 0,
        tags: '',
        status: 'detected'
      })
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      fetchVulns()
      
      // Refocus on site input
      if (siteInputRef.current) {
        siteInputRef.current.focus()
      }
    } catch (error) {
      console.error('Error adding vulnerability:', error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && formData.site.trim() && formData.title.trim()) {
      handleSubmit(e)
    }
  }

  const deleteVuln = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      fetchVulns()
    } catch (error) {
      console.error('Error deleting vulnerability:', error)
    }
  }

  const updateStatus = async (id, newStatus) => {
    const vuln = vulns.find(v => v.id === id)
    if (!vuln) return
    
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...vuln, status: newStatus }),
      })
      fetchVulns()
    } catch (error) {
      console.error('Error updating vulnerability:', error)
    }
  }

  const generateProposal = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/proposal/${id}`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `proposal_${id.slice(0, 8)}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error generating proposal:', error)
    }
  }

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'critical': return 'bg-red-500 border-red-400 text-white'
      case 'high': return 'bg-orange border-orange text-white'
      case 'medium': return 'bg-yellow-500 border-yellow-400 text-black'
      case 'low': return 'bg-green border-green text-black'
      default: return 'bg-gray-500 border-gray-400 text-white'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'detected': return '🕵️'
      case 'contacted': return '📨'
      case 'closed': return '✅'
      default: return '📋'
    }
  }

  const getStatusGlow = (status) => {
    switch (status) {
      case 'detected': return 'shadow-glow-green'
      case 'contacted': return 'shadow-glow-orange'
      case 'closed': return 'shadow-glow-cyan'
      default: return 'shadow-glow-green'
    }
  }

  const isFormValid = formData.site.trim() && formData.title.trim()

  return (
    <div className="min-h-screen bg-black text-white py-8 relative">
      {/* Shamanic Message Modal */}
      {showShamanicMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
          <div className="relative glass-green p-8 rounded-2xl text-center animate-portal">
            <h3 className="text-2xl font-orbitron text-green mb-4 animate-flicker">
              🧘 SHAMANIC MESSAGE 🧘
            </h3>
            <p className="text-lg font-sora text-white">
              "This system is a ritual of sovereignty. Every vulnerability you track is a step toward digital enlightenment."
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Psychedelic Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-orbitron font-bold text-green mb-6 tracking-wider animate-glow">
            VULNTRACKER
          </h1>
          <div className="relative">
            <p className="text-xl text-gray-400 font-inter mb-2">
              Shamanic Security Intelligence
            </p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-green via-orange to-pink rounded-full animate-pulse-slow"></div>
          </div>
          <p className="text-sm text-gray-500 mt-4 font-mono">
            Press ↑↑↓↓←→←→BA for shamanic message
          </p>
        </div>
        
        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 right-4 glass-green px-6 py-3 rounded-lg z-50 animate-float">
            <span className="font-semibold text-green">✨ Vulnerability added successfully!</span>
          </div>
        )}
        
        {/* Psychedelic Form */}
        <div className="glass-green rounded-2xl p-8 mb-16 animate-glass-shift">
          <h2 className="text-3xl font-sora font-semibold mb-8 text-green text-center">
            Add New Vulnerability
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input
                ref={siteInputRef}
                value={formData.site}
                onChange={e => setFormData({...formData, site: e.target.value})}
                onKeyPress={handleKeyPress}
                placeholder="Site URL"
                className="glass input-focus rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none transition-all duration-300"
                required
              />
              <input
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                onKeyPress={handleKeyPress}
                placeholder="Vulnerability Title"
                className="glass input-focus rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none transition-all duration-300"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <select
                value={formData.risk}
                onChange={e => setFormData({...formData, risk: e.target.value})}
                className="glass input-focus rounded-xl px-6 py-4 text-white focus:outline-none transition-all duration-300"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <input
                type="number"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="Price ($)"
                className="glass input-focus rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none transition-all duration-300"
              />
              
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="glass input-focus rounded-xl px-6 py-4 text-white focus:outline-none transition-all duration-300"
              >
                <option value="detected">Detected</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <input
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              placeholder="Tags (comma-separated)"
              className="glass input-focus rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 w-full"
            />
            
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Description"
              rows="4"
              className="glass input-focus rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 w-full resize-none"
            />
            
            <textarea
              value={formData.recommendation}
              onChange={e => setFormData({...formData, recommendation: e.target.value})}
              placeholder="Recommendation"
              rows="4"
              className="glass input-focus rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 w-full resize-none"
            />
            
            <div className="text-center">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`btn-psychedelic px-12 py-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                  isFormValid 
                    ? 'bg-gradient-to-r from-green to-orange text-black shadow-glow-dual hover:shadow-glow-triple animate-neon-pulse' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Add Vulnerability
              </button>
            </div>
          </form>
        </div>

        {/* Psychedelic Vulnerability Cards */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-3xl font-sora font-semibold mb-10 text-green text-center">
            Vulnerabilities ({vulns.length})
          </h2>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="loading-spinner w-16 h-16 mx-auto mb-6"></div>
              <p className="text-gray-400 text-lg">Loading vulnerabilities...</p>
            </div>
          ) : vulns.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 animate-float">🔮</div>
              <p className="text-gray-400 text-xl mb-2">No vulnerabilities found.</p>
              <p className="text-gray-500">Add your first vulnerability above to begin the ritual</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {vulns.map((vuln, index) => (
                <div 
                  key={vuln.id} 
                  className="glass rounded-2xl p-8 hover:shadow-glow-dual transition-all duration-500 animate-float"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-sora font-bold text-white">{vuln.title}</h3>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getRiskColor(vuln.risk)}`}>
                          {vuln.risk}
                        </span>
                        <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm glass ${getStatusGlow(vuln.status)}`}>
                          {getStatusIcon(vuln.status)} {vuln.status}
                        </span>
                      </div>
                      <p className="text-green text-lg mb-4 font-mono">{vuln.site}</p>
                      {vuln.description && (
                        <p className="text-gray-300 mb-4 leading-relaxed text-lg">{vuln.description}</p>
                      )}
                      {vuln.recommendation && (
                        <div className="mb-4 p-4 glass-orange rounded-xl">
                          <p className="text-green font-bold text-lg mb-2">Recommendation:</p>
                          <p className="text-gray-300">{vuln.recommendation}</p>
                        </div>
                      )}
                      {vuln.tags.length > 0 && (
                        <div className="flex gap-3 mb-4 flex-wrap">
                          {vuln.tags.map((tag, i) => (
                            <span key={i} className="glass px-3 py-1 rounded-lg text-sm border border-green/30 text-green">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-green font-bold text-2xl">${vuln.price}</p>
                    </div>
                    
                    <div className="flex gap-4 ml-8">
                      <button
                        onClick={() => generateProposal(vuln.id)}
                        className="btn-psychedelic bg-gradient-to-r from-green to-cyan text-black px-6 py-3 rounded-xl text-sm font-bold hover:shadow-glow-dual transition-all duration-300"
                      >
                        📄 Generate Proposal
                      </button>
                      <select
                        value={vuln.status}
                        onChange={(e) => updateStatus(vuln.id, e.target.value)}
                        className="glass border border-green/30 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green"
                      >
                        <option value="detected">Detected</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button
                        onClick={() => deleteVuln(vuln.id)}
                        className="btn-psychedelic bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-3 rounded-xl text-sm hover:shadow-glow-pink transition-all duration-300"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* OSA Footer */}
        <div className="text-center mt-20 pb-8">
          <p className="osa-footer text-lg">
            Built with clarity, powered by <strong>Orange Sunshine Aviation</strong> ☀️
          </p>
          <p className="text-sm text-gray-500 mt-4 hover:text-green transition-colors cursor-pointer font-mono" 
             title="This system is a ritual of sovereignty.">
            This system is a ritual of sovereignty.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
