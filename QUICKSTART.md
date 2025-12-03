# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Python 3.8 or higher (`python --version`)
- ✅ Node.js 18 or higher (`node --version`)
- ✅ npm (`npm --version`)

## Step 1: Backend Setup (5 minutes)

```bash
# Navigate to backend directory
cd Backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data for sentiment analysis
python -c "import nltk; nltk.download('punkt'); nltk.download('brown')"
```

## Step 2: Frontend Setup (3 minutes)

```bash
# Navigate to frontend directory (or root if package.json is there)
cd ../Frontend  # or stay at root

# Install dependencies
npm install
```

## Step 3: Run the Application

### Option A: Development Mode (Recommended for testing)

**Terminal 1 - Backend:**
```bash
cd Backend
python main.py
```
Backend will run on: `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd Frontend  # or root directory
npm run dev
```
Frontend will run on: `http://localhost:5173`

Open `http://localhost:5173` in your browser.

### Option B: Production Mode

**Terminal 1 - Build Frontend:**
```bash
cd Frontend
npm run build
```

**Terminal 2 - Run Backend (serves frontend):**
```bash
cd Backend
python main.py
```

Open `http://localhost:8000` in your browser.

## Testing the Application

1. Open the application in your browser
2. Enter a website URL (e.g., `https://example.com`)
3. Click "Analyze"
4. Wait for the analysis to complete (usually 10-30 seconds)
5. Review the results:
   - Trust Score
   - Domain Information
   - Security Status
   - Scam Detection
   - People Experience Analysis
   - Recommendations

## Common Issues & Solutions

### Issue: "Module not found" errors
**Solution:** Make sure you activated the virtual environment and installed all requirements:
```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Issue: Frontend can't connect to backend
**Solution:** 
1. Check backend is running on port 8000
2. Check CORS settings in `Backend/main.py`
3. Verify `VITE_API_URL` in environment (defaults to `http://localhost:8000`)

### Issue: WHOIS lookup fails
**Solution:** This is normal for some domains with privacy protection. Try a different domain.

### Issue: SSL check fails
**Solution:** Domain might not have SSL or firewall is blocking. Try a well-known domain like `google.com`.

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize analysis parameters in `Backend/analyzer.py`
- Add API keys for enhanced social media analysis (see README)
- Deploy to production (see deployment section in README)

## Need Help?

Check the [README.md](README.md) for:
- Detailed feature documentation
- API endpoint documentation
- Troubleshooting guide
- Project structure

