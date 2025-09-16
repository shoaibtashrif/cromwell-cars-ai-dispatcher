#!/bin/bash

echo "🔄 Updating Twilio Webhook"
echo "========================="

# Load environment variables
source .env

# Get current ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | cut -d'"' -f4)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Error: Could not get ngrok URL. Make sure ngrok is running on port 4040."
    exit 1
fi

echo "📡 Current ngrok URL: $NGROK_URL"

# Update ultravox config
echo "⚙️  Updating ultravox config..."
sed -i "s|https://[^/]*\.ngrok-free\.app|$NGROK_URL|g" ultravox-config.js

# Update Twilio webhook
WEBHOOK_URL="$NGROK_URL/twilio/incoming"
PHONE_SID="PN41ed904e49e30ed6f151e849d8642a91"

echo "🔗 Updating Twilio webhook to: $WEBHOOK_URL"

RESPONSE=$(curl -s -X POST \
    -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" \
    -d "VoiceUrl=$WEBHOOK_URL" \
    -d "VoiceMethod=POST" \
    "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/IncomingPhoneNumbers/$PHONE_SID.json")

if echo "$RESPONSE" | grep -q "error"; then
    echo "❌ Error updating webhook: $RESPONSE"
    exit 1
else
    echo "✅ Twilio webhook updated successfully!"
fi

# Test the webhook
echo "�� Testing webhook..."
TEST_RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "CallSid=test123&From=%2B1234567890&To=%2B17624000454")

if echo "$TEST_RESPONSE" | grep -q "ultravox"; then
    echo "✅ Webhook test successful!"
    echo ""
    echo "🎉 Ready to receive calls on +17624000454!"
else
    echo "❌ Webhook test failed: $TEST_RESPONSE"
fi
