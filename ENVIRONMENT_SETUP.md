# Environment Variables Setup

Create these files in your project root:

## .env
```bash
# MongoDB Configuration (Azure Cosmos DB)
MONGO_USERNAME=your-mongodb-username
MONGO_PASSWORD=your-mongodb-password
DATABASE_URL="mongodb+srv://username:password@cluster.cosmos.azure.com/database?retryWrites=true&w=majority&appName=cluster"
```

## .env.local
```bash
# NextAuth.js Configuration
NEXTAUTH_SECRET=your-secret-key-here-generate-a-random-32-char-string
NEXTAUTH_URL=http://localhost:3000

# Backend API Configuration
# For local backend: use your public IP address
# For Azure deployed backend: use Azure backend URL
NEXT_PUBLIC_BACKEND_URL=http://YOUR_PUBLIC_IP:5000

# Google Gemini AI Configuration (for Risk Assessment Agent)
GEMINI_API_KEY=your-gemini-api-key-here

# Email Configuration (Optional - for production)
EMAIL_SERVER_HOST=your-email-server
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email-user
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM=noreply@yourcompany.com
```

## 🏠 For Local Backend Connection

### Find Your Public IP Address:
```bash
# Visit these websites to get your public IP:
# https://whatismyipaddress.com/
# https://ipinfo.io/ip

# Or use command line:
curl ifconfig.me
```

### Set Your Backend URL:
```bash
# Replace with your actual public IP
NEXT_PUBLIC_BACKEND_URL=http://123.456.789.123:5000
```

### Backend Configuration Required:
Your local Python backend needs to allow connections from Azure:

```python
# In risk_assessment_bot.py, update CORS configuration:
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",  # Local development
    "https://your-app.azurestaticapps.net"  # Your Azure domain
])
```

### Router/Firewall Setup:
1. **Port Forward**: Configure your router to forward port 5000 to your computer
2. **Firewall**: Allow incoming connections on port 5000
3. **Keep Running**: Your computer must stay on and connected

## How to Generate NEXTAUTH_SECRET
```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Option 3: Online generator
# Visit https://generate-secret.vercel.app/32
```

## Getting API Keys

1. **Google Gemini API**: Visit https://aistudio.google.com/app/apikey
2. **MongoDB Atlas**: Visit https://cloud.mongodb.com/ for free tier
3. **Azure Cosmos DB**: Visit https://portal.azure.com/ for MongoDB API

## ⚠️ Production Considerations

**For production use, consider deploying backend to Azure Container Apps instead of local hosting for better reliability and security.** 