import express from 'express';
import twilio from 'twilio';
import 'dotenv/config';
import { createUltravoxCall } from '../ultravox-utils.js';
import { ULTRAVOX_CALL_CONFIG } from '../ultravox-config.js';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const destinationNumber = process.env.DESTINATION_PHONE_NUMBER;
const router = express.Router();

// Hack: Dictionary to store Twilio CallSid and Ultravox Call ID mapping
// TODO replace this with something more durable
const activeCalls = new Map();

async function transferActiveCall(ultravoxCallId) {
    try {
        const callData = activeCalls.get(ultravoxCallId);
        if (!callData || !callData.twilioCallSid) {
            throw new Error('Call not found or invalid CallSid');
        }

        // First create a new TwiML to handle the transfer
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.dial().number(destinationNumber);

        // Update the active call with the new TwiML
        const updatedCall = await client.calls(callData.twilioCallSid)
            .update({
                twiml: twiml.toString()
            });

        return {
            status: 'success',
            message: 'Call transfer initiated',
            callDetails: updatedCall
        };

    } catch (error) {
        console.error('Error transferring call:', error);
        throw {
            status: 'error',
            message: 'Failed to transfer call',
            error: error.message
        };
    }
}

// Handle incoming calls from Twilio
router.post('/incoming', async (req, res) => {
    const timestamp = new Date().toISOString();
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
        console.log('\n📞 ===== INCOMING CALL RECEIVED =====');
        console.log(`📅 Timestamp: ${timestamp}`);
        console.log(`🆔 Call Tracking ID: ${callId}`);
        console.log('📥 TWILIO WEBHOOK DATA:');
        console.log(JSON.stringify(req.body, null, 2));

        const twilioCallSid = req.body.CallSid;
        const fromNumber = req.body.From;
        const toNumber = req.body.To;
        
        console.log('📋 CALL DETAILS:');
        console.log(`   Twilio Call SID: ${twilioCallSid}`);
        console.log(`   From: ${fromNumber}`);
        console.log(`   To: ${toNumber}`);
        console.log(`   Call Status: ${req.body.CallStatus || 'Unknown'}`);
        console.log(`   Direction: ${req.body.Direction || 'Unknown'}`);

        console.log('🤖 CREATING ULTRAVOX AI CALL:');
        console.log('   Config: Alex - Cromwell Cars Dispatcher');
        console.log('   Tools: address_validate, checkPricing, BookCab');
        
        // Create the Ultravox call
        const response = await createUltravoxCall(ULTRAVOX_CALL_CONFIG);
        
        console.log('✅ ULTRAVOX CALL CREATED:');
        console.log(`   Ultravox Call ID: ${response.callId}`);
        console.log(`   Join URL: ${response.joinUrl}`);

        activeCalls.set(response.callId, {
            twilioCallSid: twilioCallSid,
            fromNumber: fromNumber,
            toNumber: toNumber,
            timestamp: timestamp,
            trackingId: callId
        });
        
        console.log('📝 CALL MAPPING STORED:');
        console.log(`   Twilio SID → Ultravox ID: ${twilioCallSid} → ${response.callId}`);
        console.log(`   Active Calls Count: ${activeCalls.size}`);

        const twiml = new twilio.twiml.VoiceResponse();
        const connect = twiml.connect();
        connect.stream({
            url: response.joinUrl,
            name: 'ultravox'
        });

        const twimlString = twiml.toString();
        console.log('📤 TWIML RESPONSE:');
        console.log(twimlString);
        
        console.log('🎯 AI CALL INITIATED - Customer connected to Alex');
        console.log('📞 ===== INCOMING CALL SETUP COMPLETE =====\n');
        
        res.type('text/xml');
        res.send(twimlString);

    } catch (error) {
        console.log('❌ ===== INCOMING CALL ERROR =====');
        console.log(`🆔 Call Tracking ID: ${callId}`);
        console.log(`📅 Timestamp: ${timestamp}`);
        console.log('💥 ERROR DETAILS:', error.message);
        
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say('Sorry, there was an error connecting your call.');
        
        console.log('📤 ERROR TWIML RESPONSE:', twiml.toString());
        console.log('❌ ===== INCOMING CALL ERROR END =====\n');
        
        res.type('text/xml');
        res.send(twiml.toString());
    }
});

// Handle transfer of calls to another number
router.post('/transferCall', async (req, res) => {
    const { callId } = req.body;
    console.log(`Request to transfer call with callId: ${callId}`);

    try {
        const result = await transferActiveCall(callId);
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/active-calls', (req, res) => {
    const calls = Array.from(activeCalls.entries()).map(([ultravoxCallId, data]) => ({
        ultravoxCallId,
        ...data
    }));
    res.json(calls);
});

export { router };
