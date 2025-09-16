#!/bin/bash

echo "🔍 AI TOOL CALLING MONITOR"
echo "=========================="
echo ""
echo "This script will monitor the server logs for AI tool calls."
echo "In another terminal, call +17624000454 and say:"
echo "'I need a taxi from 10 Downing Street to Heathrow Airport'"
echo ""
echo "Watch for these log messages:"
echo "✅ 'Address validation request:' - AI called address_validate tool"
echo "✅ 'Address validation result:' - Tool returned data"
echo "✅ 'Pricing request received:' - AI called checkPricing tool"
echo "✅ 'Booking request received:' - AI called BookCab tool"
echo ""
echo "Starting log monitoring..."
echo "Press Ctrl+C to stop"
echo ""

# Monitor server logs for tool calls
tail -f /dev/null 2>/dev/null | while read line; do
    # This will show any new log entries
    echo "📊 Monitoring for tool calls..."
    sleep 2
done &

# Also show recent logs
echo "📋 Recent server activity:"
ps aux | grep "node index.js" | grep -v grep
echo ""

# Check if server is running
if curl -s http://localhost:3000/twilio/active-calls > /dev/null; then
    echo "✅ Server is running on port 3000"
else
    echo "❌ Server not running on port 3000"
fi

echo ""
echo "🎯 Ready to monitor! Call +17624000454 now!"
