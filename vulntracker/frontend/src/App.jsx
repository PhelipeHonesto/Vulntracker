import { useEffect, useState, useRef } from 'react'
import './App.css'

// Modal Component
const ProposalModal = ({ vuln, isOpen, onClose, onGenerate }) => {
  const [editedVuln, setEditedVuln] = useState(vuln)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    setEditedVuln(vuln)
  }, [vuln])

  if (!isOpen) return null

  const handleGenerateClick = async () => {
    setIsGenerating(true)
    await onGenerate(editedVuln)
    setIsGenerating(false)
    onClose()
  }

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content">
        <div className="scan-line"></div>
        <h2 className="text-3xl font-display font-bold mb-2 text-hacker-mint">Generate Report</h2>
        <p className="mb-6 text-silent-gray">Review and edit the details before deploying the proposal.</p>
        
        <div className="space-y-4 text-left">
          <div>
            <label className="text-sm font-semibold text-silent-gray">Vulnerability Title</label>
            <input 
              type="text"
              value={editedVuln.title}
              onChange={(e) => setEditedVuln({ ...editedVuln, title: e.target.value })}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-silent-gray">Description (Potential Impact)</label>
            <textarea
              value={editedVuln.description}
              onChange={(e) => setEditedVuln({ ...editedVuln, description: e.target.value })}
              rows="4"
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-silent-gray">Recommended Fix</label>
            <textarea
              value={editedVuln.recommendation}
              onChange={(e) => setEditedVuln({ ...editedVuln, recommendation: e.target.value })}
              rows="4"
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-silent-gray">Price ($)</label>
            <input
              type="number"
              value={editedVuln.price}
              onChange={(e) => setEditedVuln({ ...editedVuln, price: e.target.value })}
              className="input-field mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={() => alert('SIGMA AI assistant coming soon!')} className="btn btn-secondary" title="Coming Soon">
            🤖 SIGMA
          </button>
          <button onClick={handleGenerateClick} className="btn btn-primary" disabled={isGenerating}>
            {isGenerating ? 'Deploying...' : '⬇ Deploy Report'}
          </button>
        </div>
      </div>
    </div>
  )
}

const API_URL = 'http://localhost:8000'

function App() {
  const [vulns, setVulns] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVuln, setSelectedVuln] = useState(null)
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
      const res = await fetch(`${API_URL}/vulns`)
      const data = await res.json()
      setVulns(data)
    } catch (error) {
      console.error('Error fetching vulnerabilities:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchVulns()
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
      await fetch(`${API_URL}/vulns`, {
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
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      fetchVulns()
      
      if (siteInputRef.current) {
        siteInputRef.current.focus()
      }
    } catch (error) {
      console.error('Error adding vulnerability:', error)
    }
  }

  const deleteVuln = async (id) => {
    try {
      await fetch(`${API_URL}/vulns/${id}`, { method: 'DELETE' })
      fetchVulns()
    } catch (error) {
      console.error('Error deleting vulnerability:', error)
    }
  }

  const updateStatus = async (id, newStatus) => {
    const vuln = vulns.find(v => v.id === id)
    if (!vuln) return
    
    try {
      await fetch(`${API_URL}/vulns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...vuln, status: newStatus }),
      })
      fetchVulns()
    } catch (error) {
      console.error('Error updating vulnerability:', error)
    }
  }

  const handleOpenProposalModal = (vuln) => {
    setSelectedVuln(vuln)
    setIsModalOpen(true)
  }

  const generateProposal = async (vulnData) => {
    try {
      const response = await fetch(`${API_URL}/generate-proposal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vulnData),
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ghostsignal_report_${vulnData.id.slice(0, 8)}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error('Failed to generate PDF')
      }
    } catch (error) {
      console.error('Error generating proposal:', error)
    }
  }

  const generateTestPDF = async () => {
    const testVuln = {
      id: "test-12345",
      site: "https://example.com",
      title: "SQL Injection Vulnerability",
      risk: "critical",
      description: "A critical SQL injection vulnerability was detected in the login form that could allow unauthorized access to the database and potentially compromise user data.",
      recommendation: "Implement parameterized queries, add input validation, and use prepared statements to prevent SQL injection attacks. Consider implementing a Web Application Firewall (WAF) for additional protection.",
      price: 299.99,
      tags: ["sql-injection", "authentication", "database"],
      status: "detected"
    }
    
    await generateProposal(testVuln)
  }

  const getRiskClass = (risk) => {
    switch (risk.toLowerCase()) {
      case 'critical': return 'risk-critical'
      case 'high': return 'risk-high'
      case 'medium': return 'risk-medium'
      case 'low': return 'risk-low'
      default: return 'risk-medium'
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'detected': return 'status-detected'
      case 'contacted': return 'status-contacted'
      case 'closed': return 'status-closed'
      default: return 'status-detected'
    }
  }

  const isFormValid = formData.site.trim() && formData.title.trim()

  return (
    <div className="min-h-screen bg-phantom-navy text-fog-white font-body">
      <ProposalModal 
        vuln={selectedVuln}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={generateProposal}
      />
      
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="scan-line"></div>
          <h1 className="text-6xl font-display font-bold tracking-tight mb-4">
            <span className="text-fog-white">GHOST</span>
            <span className="text-hacker-mint glow-text">SIGNAL</span>
          </h1>
          <p className="text-xl text-silent-gray font-body mb-2">
            We see the cracks before they break.
          </p>
          <p className="text-sm text-silent-gray/70 font-code mb-6">
            Powered by DonatelusInc
          </p>
          
          {/* Test PDF Button */}
          <button
            onClick={generateTestPDF}
            className="btn btn-secondary text-sm"
            title="Download a sample PDF proposal for testing"
          >
            📄 Test PDF Template
          </button>
        </header>
        
        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-5 right-5 card bg-hacker-mint/20 border-hacker-mint/30 text-hacker-mint px-6 py-3 rounded-lg z-50 animate-slide-up">
            <span className="font-semibold">System flag raised.</span>
          </div>
        )}
        
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <section className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="card p-8 sticky top-8">
              <div className="scan-line"></div>
              <h2 className="text-2xl font-display font-bold mb-6 text-hacker-mint">Track Exploit</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  ref={siteInputRef}
                  value={formData.site}
                  onChange={e => setFormData({...formData, site: e.target.value})}
                  placeholder="Target URL"
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
                  className="w-full btn btn-primary py-3 disabled:bg-ghost-300 disabled:text-silent-gray disabled:shadow-none disabled:cursor-not-allowed"
                >
                  Deploy
                </button>
              </form>
            </div>
          </section>

          {/* Vulnerabilities List */}
          <section className="lg:col-span-2">
            {loading ? (
              <div className="text-center p-16">
                <div className="loading-spinner w-12 h-12 mx-auto"></div>
                <p className="text-silent-gray mt-4">Scanning for signals...</p>
              </div>
            ) : vulns.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👻</div>
                <h3 className="empty-state-title">No signals detected.</h3>
                <p className="empty-state-description">Stay alert.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {vulns.map((vuln, index) => (
                  <div 
                    key={vuln.id} 
                    className="floating-card p-6 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="scan-line"></div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`status-badge ${getRiskClass(vuln.risk)}`}>
                            {vuln.risk.toUpperCase()}
                          </span>
                          <h3 className="text-xl font-display font-bold text-fog-white">{vuln.title}</h3>
                        </div>
                        <p className="text-cortex-blue text-sm mb-3 font-code">{vuln.site}</p>
                        
                        {vuln.description && (
                          <p className="text-silent-gray mb-3 text-sm leading-relaxed">{vuln.description}</p>
                        )}
                        
                        {vuln.tags.length > 0 && (
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {vuln.tags.map((tag, i) => (
                              <span key={i} className="tag-pill">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-hacker-mint font-bold text-lg">${vuln.price}</p>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handleOpenProposalModal(vuln)}
                          className="btn btn-primary text-sm"
                        >
                          Deploy Report
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
                          Quarantine
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
        
        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-ghost-200">
          <p className="text-silent-gray/70 text-sm">
            <strong className="text-hacker-mint">GhostSignal</strong> — We see the cracks before they break.
          </p>
          <p className="text-silent-gray/50 text-xs mt-2 font-code">
            Built with clarity. Offered with honesty.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
