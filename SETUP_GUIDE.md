# Cromwell Cars AI Dispatcher - Setup Guide

## ✅ Current Status
- Twilio credentials configured and tested
- Ultravox API key configured
- Real API integrations complete
- Server ready to run

## 🔧 Configuration

### Environment Variables (in .env file)
```
ULTRAVOX_API_KEY=your_ultravox_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
DESTINATION_PHONE_NUMBER=+1234567890
CABEE_JWT_TOKEN=your_cabee_jwt_token_here
```

### Required API Keys & Tokens
1. **Ultravox API Key**: Get from https://dashboard.ultravox.ai
2. **Twilio Credentials**: Get from https://console.twilio.com
3. **Cromwell Cars JWT**: Contact your API provider
4. **Make.com Webhook**: Configure pricing workflow

### Twilio Webhook Configuration
1. Go to your Twilio Console: https://console.twilio.com/
2. Navigate to Phone Numbers > Manage > Active numbers
3. Click on your phone number
4. Set the webhook URL to: `https://YOUR_DOMAIN/twilio/incoming`
5. Set HTTP method to: POST
6. Save the configuration

## 🚀 Running the Server

### Development (with ngrok)
1. Start ngrok (in a separate terminal):
   ```bash
   ngrok http 3000
   ```

2. Update Twilio webhook with ngrok URL:
   ```bash
   ./setup-twilio-webhook.sh
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Production Deployment
Follow the comprehensive deployment guide in `DEPLOYMENT.md`

## 📞 Testing

1. **Call your Twilio number**
2. **The AI agent "Alex" will answer** as a Cromwell Cars dispatcher
3. **Test booking flow**:
   - "I need a taxi from 10 Downing Street to Heathrow Airport"
   - Watch terminal logs for API calls
   - Verify address validation, pricing, and booking

## 🔧 Available Endpoints

### Core System
- `POST /twilio/incoming` - Twilio webhook for incoming calls
- `POST /twilio/transferCall` - Transfer call to human agent
- `GET /twilio/active-calls` - View active calls

### Cromwell Cars APIs
- `POST /cromwell/validateAddress` - UK address validation
- `POST /cromwell/checkPricing` - Get pricing quotes
- `POST /cromwell/bookCab` - Complete booking management

## 📊 Monitoring

### Real-time Logs
The system provides comprehensive logging:
- 📞 Incoming call setup
- 🔍 Address validation calls
- 💰 Pricing requests
- 🚖 Booking operations
- ❌ Error tracking

### Log Sections to Watch
- `===== INCOMING CALL RECEIVED =====`
- `===== ADDRESS VALIDATION TOOL CALLED =====`
- `===== PRICING TOOL CALLED =====`
- `===== BOOKING TOOL CALLED =====`

## 📝 Notes

- The server runs on port 3000
- All API integrations are real (no mock data)
- Comprehensive error handling and logging
- The AI agent is "Alex" - professional Cromwell Cars dispatcher
- JWT authentication for Cabee APIs
- Address validation for UK postal system
