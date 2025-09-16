#!/bin/bash

echo "🔧 Setting up Twilio Webhook Configuration"
echo "=========================================="

# Get the ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | cut -d'"' -f4)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Error: Could not get ngrok URL. Make sure ngrok is running."
    exit 1
fi

echo "📡 ngrok URL: $NGROK_URL"
echo ""

# Get Twilio credentials from .env
source .env

if [ -z "$TWILIO_ACCOUNT_SID" ] || [ -z "$TWILIO_AUTH_TOKEN" ] || [ -z "$TWILIO_PHONE_NUMBER" ]; then
    echo "❌ Error: Twilio credentials not found in .env file"
    exit 1
fi

echo "📞 Twilio Phone Number: $TWILIO_PHONE_NUMBER"
echo "🔑 Account SID: $TWILIO_ACCOUNT_SID"
echo ""

# Get the phone number SID
PHONE_SID=$(curl -s -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" \
    "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/IncomingPhoneNumbers.json" \
    | grep -o '"sid":"[^"]*","phone_number":"'$TWILIO_PHONE_NUMBER'"' | cut -d'"' -f4)

if [ -z "$PHONE_SID" ]; then
    echo "❌ Error: Could not find phone number SID for $TWILIO_PHONE_NUMBER"
    exit 1
fi

echo "📱 Phone Number SID: $PHONE_SID"
echo ""

# Update the webhook URL
WEBHOOK_URL="$NGROK_URL/twilio/incoming"

echo "🔗 Setting webhook URL to: $WEBHOOK_URL"

RESPONSE=$(curl -s -X POST \
    -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" \
    -d "VoiceUrl=$WEBHOOK_URL" \
    -d "VoiceMethod=POST" \
    "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/IncomingPhoneNumbers/$PHONE_SID.json")

if echo "$RESPONSE" | grep -q "error"; then
    echo "❌ Error setting webhook: $RESPONSE"
    exit 1
else
    echo "✅ Webhook configured successfully!"
    echo ""
    echo "🎉 Setup Complete!"
    echo "================"
    echo "Your Twilio number $TWILIO_PHONE_NUMBER is now connected to the AI agent."
    echo "Call the number to test the integration!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Call $TWILIO_PHONE_NUMBER to test"
    echo "2. The AI agent 'Steve' will answer as an HVAC receptionist"
    echo "3. Test features: ask about products, request appointments, ask for human transfer"
    echo ""
    echo "🔧 Server Status:"
    echo "- Server running on: http://localhost:3000"
    echo "- Public URL: $NGROK_URL"
    echo "- Webhook endpoint: $WEBHOOK_URL"
fi
