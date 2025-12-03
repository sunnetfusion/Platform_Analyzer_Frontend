# Platform Legitimacy Analyzer

A comprehensive web application that analyzes websites for legitimacy, scam detection, and trustworthiness. Built with React (Frontend) and FastAPI (Backend).

## Features

- **Website Information Analysis**
  - WHOIS lookup (domain registration, owner, registrar)
  - SSL certificate validation
  - Domain age calculation
  - Server location detection
  - Website content scraping and analysis

- **People Discovery & Experience**
  - User testimonials detection
  - Social proof indicators
  - Customer support availability
  - User experience rating
  - Sentiment analysis

- **Scam Detection**
  - Ponzi scheme detection
  - Stock image detection
  - Suspicious keyword analysis
  - Financial viability calculations
  - Red flag identification

- **Social Media Analysis**
  - Reddit mentions tracking
  - Twitter mentions tracking
  - Trustpilot score (when API available)
  - ScamAdvisor score (when API available)

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (Icons)

### Backend
- FastAPI
- Python 3.8+
- BeautifulSoup4 (Web scraping)
- WHOIS (Domain lookup)
- TextBlob (Sentiment analysis)
- httpx (Async HTTP client)

## Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- pip

### Backend Setup

**Quick Setup (Recommended):**

On macOS/Linux:
```bash
cd Backend
./setup.sh
```

On Windows:
```bash
cd Backend
setup.bat
```

**Manual Setup:**

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Download NLTK data (for sentiment analysis):
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('brown')"
```

**Fixing IDE Import Errors:**

If your IDE (VS Code, PyCharm, etc.) shows "Import could not be resolved" errors:

1. **VS Code:**
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "Python: Select Interpreter"
   - Choose the interpreter from `Backend/venv/bin/python` (or `Backend\venv\Scripts\python.exe` on Windows)
   - The `.vscode/settings.json` file has been configured to help with this

2. **PyCharm:**
   - Go to Settings → Project → Python Interpreter
   - Click the gear icon → Add → Existing Environment
   - Select `Backend/venv/bin/python` (or `Backend\venv\Scripts\python.exe` on Windows)

3. **General:**
   - Make sure the virtual environment is activated before running the code
   - Restart your IDE after setting up the virtual environment

### Frontend Setup

1. Navigate to the Frontend directory (or root if package.json is at root):
```bash
cd Frontend  # or stay at root if package.json is there
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode

1. **Start the Backend Server:**
```bash
cd Backend
python main.py
```
The backend will run on `http://localhost:8000`

2. **Start the Frontend Dev Server:**
```bash
cd Frontend  # or root directory
npm run dev
```
The frontend will run on `http://localhost:5173`

### Production Mode

1. **Build the Frontend:**
```bash
cd Frontend
npm run build
```

2. **Start the Backend (it will serve the built frontend):**
```bash
cd Backend
python main.py
```

The application will be available at `http://localhost:8000`

## Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
# Backend API URL (for frontend)
VITE_API_URL=http://localhost:8000

# Optional: External API Keys
# TRUSTPILOT_API_KEY=your_key_here
# SCAMADVISOR_API_KEY=your_key_here
```

## API Endpoints

### `POST /api/analyze`
Analyze a website for legitimacy.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "trustScore": 72,
  "verdict": "Caution",
  "domainAge": "2.3 years",
  "domainRegistered": "2022-08-15",
  "sslStatus": "Valid (Let's Encrypt)",
  "serverLocation": "United States",
  "whoisData": { ... },
  "contentAnalysis": { ... },
  "socialData": { ... },
  "findings": [ ... ],
  "sentiment": { ... },
  "redFlags": [ ... ],
  "scamProbability": "Medium (38%)",
  "recommendation": "..."
}
```

### `GET /api/status`
Check API status.

### `GET /api/stats`
Get platform statistics.

## Project Structure

```
Platform Analyzer/
├── Backend/
│   ├── main.py           # FastAPI application
│   ├── analyzer.py       # Core analysis functions
│   ├── models.py         # Data models (if separate)
│   └── requirements.txt  # Python dependencies
├── Frontend/
│   ├── src/
│   │   ├── App.tsx       # Main React component
│   │   ├── main.tsx      # React entry point
│   │   └── index.css     # Styles
│   ├── package.json      # Node dependencies
│   └── vite.config.ts    # Vite configuration
└── README.md
```

## Features Implementation Status

✅ **Completed:**
- Frontend-Backend API integration
- Website content scraping
- WHOIS lookup
- SSL certificate checking
- Domain age calculation
- Basic scam detection
- Sentiment analysis
- People discovery & experience analysis
- Error handling
- Loading states

⚠️ **Partial/Needs Enhancement:**
- Social media mentions (basic implementation, needs API keys for full functionality)
- Stock image detection (basic pattern matching, could use image hashing)
- Trustpilot/ScamAdvisor integration (needs API keys)

## Troubleshooting

### Backend Issues

1. **Import errors / "Import could not be resolved":**
   - **Solution 1:** Run the setup script: `cd Backend && ./setup.sh` (or `setup.bat` on Windows)
   - **Solution 2:** Make sure virtual environment is activated: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
   - **Solution 3:** Install dependencies: `pip install -r requirements.txt`
   - **Solution 4:** Select the correct Python interpreter in your IDE (see "Fixing IDE Import Errors" above)
   - **Solution 5:** Restart your IDE after setting up the virtual environment

2. **WHOIS lookup fails:**
   - Some domains may have privacy protection
   - Try with different domains
   - Check internet connection

3. **SSL certificate check fails:**
   - Domain might not have SSL
   - Firewall might be blocking connections
   - Check if domain is accessible

4. **Module not found errors:**
   - Make sure all dependencies are installed: `pip install -r requirements.txt`
   - Check Python version (3.8+ required)
   - Verify virtual environment is activated

### Frontend Issues

1. **API connection fails:**
   - Make sure backend is running on port 8000
   - Check CORS settings in backend
   - Verify `VITE_API_URL` in environment variables

2. **Build errors:**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version (18+ required)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on the repository.
