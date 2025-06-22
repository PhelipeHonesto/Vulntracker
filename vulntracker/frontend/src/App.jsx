import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const API_URL = 'http://localhost:8000/vulns'

function App() {
  const [vulns, setVulns] = useState([])
  const [loading, setLoading] = useState(false)
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
      fetchVulns()
    } catch (error) {
      console.error('Error adding vulnerability:', error)
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
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'detected': return 'bg-blue-500'
      case 'contacted': return 'bg-yellow-500'
      case 'closed': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">VULNTRACKER</h1>
        
        {/* Add Vulnerability Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Vulnerability</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={formData.site}
                onChange={e => setFormData({...formData, site: e.target.value})}
                placeholder="Site URL"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Vulnerability Title"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={formData.risk}
                onChange={e => setFormData({...formData, risk: e.target.value})}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Description"
              rows="3"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            
            <textarea
              value={formData.recommendation}
              onChange={e => setFormData({...formData, recommendation: e.target.value})}
              placeholder="Recommendation"
              rows="3"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Vulnerability
            </button>
          </form>
        </div>

        {/* Vulnerabilities List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Vulnerabilities ({vulns.length})</h2>
          
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : vulns.length === 0 ? (
            <p className="text-gray-500">No vulnerabilities found.</p>
          ) : (
            <div className="space-y-4">
              {vulns.map((vuln) => (
                <div key={vuln.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg">{vuln.title}</span>
                        <span className={`px-2 py-1 rounded-full text-white text-xs ${getRiskColor(vuln.risk)}`}>
                          {vuln.risk}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-white text-xs ${getStatusColor(vuln.status)}`}>
                          {vuln.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{vuln.site}</p>
                      {vuln.description && (
                        <p className="text-gray-700 mb-2">{vuln.description}</p>
                      )}
                      {vuln.recommendation && (
                        <p className="text-gray-700 mb-2"><strong>Recommendation:</strong> {vuln.recommendation}</p>
                      )}
                      {vuln.tags.length > 0 && (
                        <div className="flex gap-1 mb-2">
                          {vuln.tags.map((tag, i) => (
                            <span key={i} className="bg-gray-200 px-2 py-1 rounded text-xs">{tag}</span>
                          ))}
                        </div>
                      )}
                      <p className="text-green-600 font-semibold">${vuln.price}</p>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => generateProposal(vuln.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                      >
                        Generate Proposal
                      </button>
                      <select
                        value={vuln.status}
                        onChange={(e) => updateStatus(vuln.id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="detected">Detected</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button
                        onClick={() => deleteVuln(vuln.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
