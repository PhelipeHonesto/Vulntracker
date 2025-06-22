import { useEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const API_URL = 'http://localhost:8000/vulns'

function App() {
  const [vulns, setVulns] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
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
      case 'critical': return 'bg-red-500 border-red-400'
      case 'high': return 'bg-orange border-orange'
      case 'medium': return 'bg-yellow-500 border-yellow-400'
      case 'low': return 'bg-green border-green'
      default: return 'bg-gray-500 border-gray-400'
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

  const isFormValid = formData.site.trim() && formData.title.trim()

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-orbitron font-bold text-green mb-4 tracking-wider">
            VULNTRACKER
          </h1>
          <p className="text-lg text-gray-400 font-inter">
            Shamanic Security Intelligence
          </p>
        </div>
        
        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green text-black px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse-slow">
            <span className="font-semibold">✨ Vulnerability added successfully!</span>
          </div>
        )}
        
        {/* Add Vulnerability Form */}
        <div className="bg-darkGray border border-borderGreen rounded-xl p-8 mb-12 glow-green">
          <h2 className="text-2xl font-sora font-semibold mb-6 text-green">
            Add New Vulnerability
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                ref={siteInputRef}
                value={formData.site}
                onChange={e => setFormData({...formData, site: e.target.value})}
                onKeyPress={handleKeyPress}
                placeholder="Site URL"
                className="bg-lightGray border border-borderGreen rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all"
                required
              />
              <input
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                onKeyPress={handleKeyPress}
                placeholder="Vulnerability Title"
                className="bg-lightGray border border-borderGreen rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <select
                value={formData.risk}
                onChange={e => setFormData({...formData, risk: e.target.value})}
                className="bg-lightGray border border-borderGreen rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all"
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
                className="bg-lightGray border border-borderGreen rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all"
              />
              
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="bg-lightGray border border-borderGreen rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all"
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
              className="bg-lightGray border border-borderGreen rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all w-full"
            />
            
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Description"
              rows="3"
              className="bg-lightGray border border-borderGreen rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all w-full resize-none"
            />
            
            <textarea
              value={formData.recommendation}
              onChange={e => setFormData({...formData, recommendation: e.target.value})}
              placeholder="Recommendation"
              rows="3"
              className="bg-lightGray border border-borderGreen rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all w-full resize-none"
            />
            
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-8 py-4 rounded-lg font-semibold transition-all ${
                isFormValid 
                  ? 'bg-green text-black hover:bg-green/90 animate-glow' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Add Vulnerability
            </button>
          </form>
        </div>

        {/* Vulnerabilities Cards */}
        <div className="bg-darkGray border border-borderGreen rounded-xl p-8">
          <h2 className="text-2xl font-sora font-semibold mb-8 text-green">
            Vulnerabilities ({vulns.length})
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading vulnerabilities...</p>
            </div>
          ) : vulns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No vulnerabilities found.</p>
              <p className="text-gray-500 text-sm mt-2">Add your first vulnerability above</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {vulns.map((vuln) => (
                <div key={vuln.id} className="bg-lightGray border border-borderGreen rounded-lg p-6 hover:shadow-lg transition-all hover:border-green/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-sora font-semibold text-white">{vuln.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(vuln.risk)}`}>
                          {vuln.risk}
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-gray-600 text-white">
                          {getStatusIcon(vuln.status)} {vuln.status}
                        </span>
                      </div>
                      <p className="text-green text-sm mb-3 font-mono">{vuln.site}</p>
                      {vuln.description && (
                        <p className="text-gray-300 mb-3 leading-relaxed">{vuln.description}</p>
                      )}
                      {vuln.recommendation && (
                        <div className="mb-3">
                          <p className="text-green font-semibold text-sm mb-1">Recommendation:</p>
                          <p className="text-gray-300 text-sm">{vuln.recommendation}</p>
                        </div>
                      )}
                      {vuln.tags.length > 0 && (
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {vuln.tags.map((tag, i) => (
                            <span key={i} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs border border-gray-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-green font-bold text-lg">${vuln.price}</p>
                    </div>
                    
                    <div className="flex gap-3 ml-6">
                      <button
                        onClick={() => generateProposal(vuln.id)}
                        className="bg-green text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green/90 transition-colors"
                      >
                        📄 Generate Proposal
                      </button>
                      <select
                        value={vuln.status}
                        onChange={(e) => updateStatus(vuln.id, e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green"
                      >
                        <option value="detected">Detected</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button
                        onClick={() => deleteVuln(vuln.id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
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
        <div className="text-center mt-12 pb-8">
          <p className="osa-footer">
            Built with intention. Powered by <strong>Orange Sunshine Aviation</strong> ☀️
          </p>
          <p className="text-xs text-gray-500 mt-2 hover:text-green transition-colors cursor-pointer" title="This system is a ritual of clarity.">
            This system is a ritual of clarity.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
