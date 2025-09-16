# 🚖 Cromwell Cars AI Dispatcher

A professional AI-powered phone dispatcher for Cromwell Cars taxi service. Built with Ultravox AI, Twilio, and real API integrations.

## 🌟 Features

- **🤖 AI Dispatcher**: Professional AI agent "Alex" handles customer calls
- **📍 Address Validation**: Real-time UK address validation with Cromwell API
- **💰 Dynamic Pricing**: Real pricing through Make.com workflow integration
- **📅 Real Bookings**: Complete booking management with Cabee API
- **📊 Comprehensive Logging**: Detailed call tracking and monitoring
- **☎️ Phone Integration**: Seamless Twilio phone system integration
- **🔧 Production Ready**: No mock data - all real API integrations

## 🏗️ Architecture

```
Phone Call → Twilio → ngrok → Node.js Server → Ultravox AI
                                    ↓
            Real APIs: Address Validation, Pricing, Bookings
```

## 🛠️ Tech Stack

- **AI Platform**: Ultravox AI for conversational AI
- **Phone System**: Twilio for telephony
- **Backend**: Node.js with Express
- **APIs**: Cromwell Cars APIs, Make.com webhooks
- **Tunneling**: ngrok for local development

## 📋 Prerequisites

- Node.js 18+ installed
- Twilio account with phone number
- Ultravox AI account and API key
- Cromwell Cars API access (JWT token)
- ngrok account (for webhook tunneling)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd cromwell-cars-ai-dispatcher
npm install
```

### 2. Environment Setup

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your actual credentials
nano .env
```

### 3. Required Environment Variables

```env
# Get from https://dashboard.ultravox.ai
ULTRAVOX_API_KEY=your_ultravox_api_key

# Get from https://console.twilio.com
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Your Cromwell Cars JWT token
CABEE_JWT_TOKEN=your_jwt_token
```

### 4. Start the Application

```bash
# Start ngrok (in separate terminal)
ngrok http 3000

# Start the server
npm start
```

### 5. Configure Twilio Webhook

```bash
# Use the provided script (update with your ngrok URL)
./setup-twilio-webhook.sh
```

## 📞 Usage

### Making a Test Call

1. **Call your Twilio number**
2. **AI Greeting**: "Thank you for calling Cromwell Cars. This is Alex. How can I help you today?"
3. **Example Request**: "I need a taxi from 10 Downing Street to Heathrow Airport"

### AI Conversation Flow

1. **Address Validation**: AI validates pickup and destination addresses
2. **Pricing Check**: AI gets pricing through Make.com workflow
3. **Booking Details**: AI collects passenger information
4. **Confirmation**: AI creates real booking and provides job number

## 🔧 API Integrations

### Address Validation
- **Endpoint**: `https://online.ontimechauffeurs.co.uk/api/address/validate`
- **Purpose**: Validates UK addresses and postcodes
- **Response**: Formatted addresses with confidence levels

### Pricing Service
- **Endpoint**: `https://hook.eu2.make.com/7k8jjdhuqbuyywi3mkuwmm9rd6t1fpzi`
- **Purpose**: Gets dynamic pricing for taxi routes
- **Company ID**: Always uses 99 for Cromwell Cars

### Booking Management
- **Base URL**: `https://capi.cabee-est.com/api/Job/`
- **Operations**: Create, Read, Update, Cancel bookings
- **Authentication**: JWT Bearer token required

## 📊 Monitoring and Logs

The system provides comprehensive logging for:

- **📞 Call Setup**: Complete Twilio webhook data
- **🔍 Address Validation**: API requests and responses
- **💰 Pricing Requests**: Make.com webhook interactions
- **🚖 Booking Operations**: Full CRUD operations with Cabee API
- **❌ Error Handling**: Detailed error tracking

### Log Format Example

```
📞 ===== INCOMING CALL RECEIVED =====
📅 Timestamp: 2025-01-15T10:30:00.000Z
🆔 Call ID: call_1234567890_abc123
📋 CALL DETAILS:
   From: +447911123456
   To: +17624000454
🤖 AI CALL INITIATED - Customer connected to Alex
```

## 🔨 Development

### Project Structure

```
├── routes/
│   ├── cromwell.js      # Cromwell Cars API integrations
│   ├── twilio.js        # Twilio webhook handling
│   ├── cal.js           # Calendar integration (optional)
│   └── rag.js           # Knowledge base (optional)
├── ultravox-config.js   # AI agent configuration
├── ultravox-utils.js    # Ultravox API utilities
├── index.js             # Main server file
└── test-*.js            # Test utilities
```

### Key Components

- **AI Agent**: Configured in `ultravox-config.js`
- **API Routes**: All integrations in `routes/cromwell.js`
- **Webhook Handler**: Twilio integration in `routes/twilio.js`
- **Logging**: Comprehensive logging throughout all components

### Testing Tools

```bash
# Test Twilio connection
node test-twilio.js

# Test AI tool calling
node test-ai-tool-calling.js

# Monitor active calls
curl http://localhost:3000/twilio/active-calls
```

## 🛡️ Security

- **Environment Variables**: Sensitive data in `.env` (not committed)
- **JWT Authentication**: Secure API access with bearer tokens
- **HTTPS/WSS**: Secure connections for all external APIs
- **Token Masking**: JWT tokens masked in logs for security

## 🚨 Troubleshooting

### Common Issues

1. **Call Not Connecting**
   ```bash
   # Check ngrok tunnel
   curl -s http://localhost:4040/api/tunnels | jq '.tunnels[0].public_url'
   
   # Verify Twilio webhook
   curl -s https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/IncomingPhoneNumbers.json
   ```

2. **Address Validation Failing**
   ```bash
   # Test address API directly
   curl -X POST http://localhost:3000/cromwell/validateAddress \
     -H "Content-Type: application/json" \
     -d '{"address_lines": ["Test Address"], "postcode": "SW1A 2AA"}'
   ```

3. **Booking Errors**
   ```bash
   # Check JWT token validity
   echo $CABEE_JWT_TOKEN | cut -c1-20
   ```

### Log Monitoring

Watch the terminal for these key log sections:
- `📞 ===== INCOMING CALL RECEIVED =====`
- `🔍 ===== ADDRESS VALIDATION TOOL CALLED =====`
- `💰 ===== PRICING TOOL CALLED =====`
- `🚖 ===== BOOKING TOOL CALLED =====`

## 📈 Production Deployment

### Required Services

1. **Web Server**: Deploy Node.js application
2. **Domain/SSL**: Replace ngrok with proper domain
3. **Environment**: Secure environment variable management
4. **Monitoring**: Log aggregation and monitoring setup

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
WEBHOOK_BASE_URL=https://your-domain.com
```

## 📄 License

This project is proprietary software for Cromwell Cars.

## 🤝 Support

For support and configuration assistance, contact the development team.

---

**Built with ❤️ for Cromwell Cars** | AI-Powered Taxi Dispatch System