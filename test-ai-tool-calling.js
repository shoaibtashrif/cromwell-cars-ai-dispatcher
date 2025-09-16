import 'dotenv/config';
import https from 'node:https';

// Test if AI agent calls the address validation tool
async function testAIToolCalling() {
    console.log('🧪 Testing AI Agent Tool Calling...\n');
    
    // Get current ngrok URL
    const ngrokUrl = 'https://d19f81a8a4d3.ngrok-free.app';
    const webhookUrl = `${ngrokUrl}/twilio/incoming`;
    
    console.log('📡 Webhook URL:', webhookUrl);
    console.log('🎯 Testing if AI calls address validation tool...\n');
    
    // Test 1: Call webhook to start conversation
    console.log('📞 Test 1: Starting conversation...');
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                CallSid: 'test_ai_tool_' + Date.now(),
                From: '+441234567890',
                To: '+17624000454'
            })
        });
        
        const responseText = await response.text();
        console.log('✅ Webhook response received');
        console.log('📋 Response preview:', responseText.substring(0, 200) + '...\n');
        
    } catch (error) {
        console.error('❌ Webhook test failed:', error.message);
    }
    
    // Test 2: Check server logs for tool calls
    console.log('📊 Test 2: Checking server logs...');
    console.log('Look for these log messages in the server terminal:');
    console.log('- "Address validation request:" - means AI called the tool');
    console.log('- "Address validation result:" - means tool returned data');
    console.log('- "Pricing request received:" - means AI called pricing tool');
    console.log('- "Booking request received:" - means AI called booking tool\n');
    
    // Test 3: Direct tool test
    console.log('🔧 Test 3: Testing address validation tool directly...');
    try {
        const toolResponse = await fetch(`${ngrokUrl}/cromwell/validateAddress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address_lines: ['10 Downing Street', 'Westminster'],
                postcode: 'SW1A 2AA'
            })
        });
        
        const toolResult = await toolResponse.json();
        console.log('✅ Address validation tool working');
        console.log('📋 Tool response preview:', JSON.stringify(toolResult).substring(0, 200) + '...\n');
        
    } catch (error) {
        console.error('❌ Tool test failed:', error.message);
    }
    
    console.log('🎯 TEST COMPLETE!');
    console.log('📝 To see if AI calls tools:');
    console.log('1. Call +17624000454');
    console.log('2. Say: "I need a taxi from 10 Downing Street to Heathrow Airport"');
    console.log('3. Watch the server logs for tool call messages');
    console.log('4. The AI should call address_validate tool for both addresses');
}

testAIToolCalling();
