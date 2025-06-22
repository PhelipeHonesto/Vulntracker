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
      case 'critical': return 'text-red-400 border-red-400'
      case 'high': return 'text-orange-400 border-orange-400'
      case 'medium': return 'text-yellow-400 border-yellow-400'
      case 'low': return 'text-green-400 border-green-400'
      default: return 'text-gray-400 border-gray-400'
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
    <div className="min-h-screen bg-osa-dark-blue text-light-text font-sans p-8">
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

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold tracking-wide">
            VULN<span className="text-shamanic-green">TRACKER</span>
          </h1>
          <p className="font-signature text-3xl text-shamanic-green/80 mt-2">
            Sunshine Aviation Security
          </p>
        </header>
        
        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-5 right-5 card bg-shamanic-green text-dark-text px-6 py-3 rounded-lg z-50 animate-slide-up">
            <span className="font-semibold">Vulnerability added!</span>
          </div>
        )}
        
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <section className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="card p-8 sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Add Vulnerability</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  ref={siteInputRef}
                  value={formData.site}
                  onChange={e => setFormData({...formData, site: e.target.value})}
                  placeholder="Site URL"
                  className="input-field"
                  required
                />
                <input
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="Vulnerability Title"
                  className="input-field"
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={formData.risk}
                    onChange={e => setFormData({...formData, risk: e.target.value})}
                    className="input-field"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="input-field"
                  >
                    <option value="detected">Detected</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="Price ($)"
                  className="input-field"
                />
                
                <input
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  placeholder="Tags (comma-separated)"
                  className="input-field"
                />
                
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Description"
                  rows="3"
                  className="input-field"
                />
                
                <textarea
                  value={formData.recommendation}
                  onChange={e => setFormData({...formData, recommendation: e.target.value})}
                  placeholder="Recommendation"
                  rows="3"
                  className="input-field"
                />
                
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full btn btn-primary py-3 disabled:bg-gray-500 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  Add Vulnerability
                </button>
              </form>
            </div>
          </section>

          {/* Vulnerabilities List */}
          <section className="lg:col-span-2">
            {loading ? (
              <div className="text-center p-16">
                <div className="loading-spinner w-12 h-12 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading vulnerabilities...</p>
              </div>
            ) : vulns.length === 0 ? (
              <div className="card text-center p-16">
                <p className="text-gray-400 text-lg">No vulnerabilities found.</p>
                <p className="text-gray-500">Add one to get started.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {vulns.map((vuln, index) => (
                  <div 
                    key={vuln.id} 
                    className="card p-6 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(vuln.risk)}`}>
                            {vuln.risk}
                          </span>
                          <h3 className="text-xl font-bold text-white">{vuln.title}</h3>
                        </div>
                        <p className="text-osa-blue text-sm mb-3">{vuln.site}</p>
                        
                        {vuln.description && (
                          <p className="text-gray-300 mb-3 text-sm leading-relaxed">{vuln.description}</p>
                        )}
                        
                        {vuln.tags.length > 0 && (
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {vuln.tags.map((tag, i) => (
                              <span key={i} className="bg-white/10 text-gray-300 px-2 py-1 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-shamanic-green font-bold text-lg">${vuln.price}</p>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => generateProposal(vuln.id)}
                          className="btn btn-primary text-sm"
                        >
                          Proposal
                        </button>
                        <select
                          value={vuln.status}
                          onChange={(e) => updateStatus(vuln.id, e.target.value)}
                          className="input-field text-sm"
                        >
                          <option value="detected">Detected</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          onClick={() => deleteVuln(vuln.id)}
                          className="btn btn-danger text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
