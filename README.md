# VULNTRACKER - Cybersecurity Vulnerability Tracking SaaS

A professional vulnerability tracking and proposal generation tool for cybersecurity researchers and bug bounty hunters.

## 🚀 Features

- **Vulnerability Management**: Add, edit, and track security vulnerabilities
- **Professional PDF Proposals**: Generate client-ready security reports
- **Risk Assessment**: Categorize vulnerabilities by severity (Critical, High, Medium, Low)
- **Status Tracking**: Monitor progress (Detected → Contacted → Closed)
- **Pricing Integration**: Set and track service pricing for each vulnerability
- **Modern UI**: Clean, responsive interface built with React and TailwindCSS

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React + Vite + TailwindCSS
- **PDF Generation**: ReportLab
- **Data Storage**: JSON file (local persistence)

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/honestoygor/codex.git
cd codex
```

### 2. Backend Setup

```bash
cd vulntracker/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi 'uvicorn[standard]' reportlab

# Start the server
uvicorn main:app --reload
```

The backend will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
cd vulntracker/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📖 Usage

### Adding a Vulnerability

1. Fill out the form with:
   - **Site URL**: The target website
   - **Vulnerability Title**: Brief description of the issue
   - **Risk Level**: Critical, High, Medium, or Low
   - **Price**: Your service fee
   - **Description**: Detailed explanation
   - **Recommendation**: How to fix the issue
   - **Tags**: Comma-separated categories
   - **Status**: Current progress

2. Click "Add Vulnerability"

### Generating Proposals

1. Find the vulnerability in the list
2. Click "Generate Proposal" button
3. A professional PDF report will be downloaded automatically

### Managing Status

Use the status dropdown to track progress:
- **Detected**: Initial discovery
- **Contacted**: Client has been notified
- **Closed**: Issue resolved or service completed

## 📁 Project Structure

```
vulntracker/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── pdf_generator.py     # PDF proposal generator
│   └── vulns.json          # Data storage (auto-generated)
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   └── index.css       # TailwindCSS styles
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

- `GET /vulns` - List all vulnerabilities
- `POST /vulns` - Add new vulnerability
- `PUT /vulns/{id}` - Update vulnerability
- `DELETE /vulns/{id}` - Delete vulnerability
- `POST /proposal/{id}` - Generate PDF proposal

## 💡 Development

### Adding New Features

1. **Backend**: Add new endpoints in `main.py`
2. **Frontend**: Update `App.jsx` with new UI components
3. **PDF**: Modify `pdf_generator.py` for custom reports

### Data Persistence

Vulnerabilities are stored in `vulns.json` in the backend directory. The file is automatically created and managed by the application.

## 🎯 Next Steps

- [ ] Add authentication system
- [ ] Implement SQLite database
- [ ] Add vulnerability scanning integration
- [ ] Create client dashboard
- [ ] Add export features (JSON, Markdown)
- [ ] Implement message templates

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ for the cybersecurity community**
