#!/bin/bash

echo "🚀 Starting Twilio + Ultravox Integration Server"
echo "=============================================="

# Load environment variables
source .env

# Function to get ngrok URL
get_ngrok_url() {
    curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | cut -d'"' -f4
}

# Function to update Twilio webhook
update_twilio_webhook() {
    local webhook_url=$1
    local phone_sid="PN41ed904e49e30ed6f151e849d8642a91"
    
    echo "🔗 Updating Twilio webhook to: $webhook_url"
    
    local response=$(curl -s -X POST \
        -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" \
        -d "VoiceUrl=$webhook_url" \
        -d "VoiceMethod=POST" \
        "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/IncomingPhoneNumbers/$phone_sid.json")
    
    if echo "$response" | grep -q "error"; then
        echo "❌ Error updating webhook: $response"
        return 1
    else
        echo "✅ Twilio webhook updated successfully!"
        return 0
    fi
}

# Function to test webhook
test_webhook() {
    local webhook_url=$1
    echo "🧪 Testing webhook endpoint..."
    
    local response=$(curl -s -X POST "$webhook_url/twilio/incoming" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "CallSid=test123&From=%2B1234567890&To=%2B17624000454")
    
    if echo "$response" | grep -q "ultravox"; then
        echo "✅ Webhook test successful!"
        return 0
    else
        echo "❌ Webhook test failed: $response"
        return 1
    fi
}

# Start ngrok in background if not running
if ! pgrep -f "ngrok" > /dev/null; then
    echo "🌐 Starting ngrok..."
    ngrok http 3000 --log=stdout > ngrok.log 2>&1 &
    sleep 5
fi

# Get ngrok URL
NGROK_URL=$(get_ngrok_url)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Error: Could not get ngrok URL. Make sure ngrok is running."
    exit 1
fi

echo "📡 ngrok URL: $NGROK_URL"

# Update ultravox config with new ngrok URL
echo "⚙️  Updating ultravox config..."
sed -i "s|https://[^/]*\.ngrok-free\.app|$NGROK_URL|g" ultravox-config.js

# Update Twilio webhook
WEBHOOK_URL="$NGROK_URL/twilio/incoming"
update_twilio_webhook "$WEBHOOK_URL"

# Test the webhook
test_webhook "$NGROK_URL"

# Start the server
echo "🚀 Starting server..."
echo "📞 Your Twilio number +17624000454 is ready!"
echo "🔗 Webhook URL: $WEBHOOK_URL"
echo "📊 Monitor calls: http://localhost:3000/twilio/active-calls"
echo ""

node index.js
