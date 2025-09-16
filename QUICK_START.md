# 🚀 Quick Start Guide - Twilio + Ultravox Integration

## ✅ Current Status: READY TO USE!

Your Twilio number **+17624000454** is now fully integrated with the Ultravox AI agent!

## 🎯 One-Command Setup

```bash
./start-server.sh
```

This script will:
- ✅ Start ngrok tunnel
- ✅ Update Twilio webhook automatically
- ✅ Start the server
- ✅ Test the integration

## 📞 Test Your Integration

**Call +17624000454 right now!**

The AI agent "Steve" will:
- Answer as an HVAC receptionist
- Help with product questions
- Offer appointment booking
- Transfer to humans when needed

## 🔧 Manual Commands

### Start Everything
```bash
./start-server.sh
```

### Update Webhook (when ngrok URL changes)
```bash
./update-webhook.sh
```

### Test Webhook
```bash
curl -X POST https://0e040704539e.ngrok-free.app/twilio/incoming \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "CallSid=test123&From=%2B1234567890&To=%2B17624000454"
```

### Monitor Active Calls
```bash
curl http://localhost:3000/twilio/active-calls
```

## 📋 Current Configuration

- **Twilio Number**: +17624000454
- **Webhook URL**: https://0e040704539e.ngrok-free.app/twilio/incoming
- **Server**: http://localhost:3000
- **AI Agent**: Steve (HVAC Receptionist)
- **Voice**: Mark (Natural AI Voice)

## 🛠️ Troubleshooting

### Server Won't Start
```bash
# Check if port 3000 is free
lsof -i :3000

# Kill any existing processes
pkill -f "node index.js"
```

### Webhook Not Working
```bash
# Update webhook with current ngrok URL
./update-webhook.sh
```

### ngrok URL Changed
```bash
# Automatically update everything
./update-webhook.sh
```

## 🎉 Success!

Your AI-powered phone system is live and ready to handle calls 24/7!

**Next Steps:**
1. Call +17624000454 to test
2. Customize the agent in `ultravox-config.js`
3. Add real Cal.com integration if needed
4. Add real knowledge base if needed

**Files Created:**
- `start-server.sh` - Complete startup script
- `update-webhook.sh` - Webhook update script
- `.env` - Your credentials
- `INTEGRATION_STATUS.md` - Detailed status

🎯 **Your AI phone system is ready!**
