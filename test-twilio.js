import 'dotenv/config';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function testTwilioConnection() {
    try {
        console.log('Testing Twilio connection...');
        console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID);
        console.log('Phone Number:', process.env.TWILIO_PHONE_NUMBER);
        
        // Test by fetching account info
        const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
        console.log('✅ Twilio connection successful!');
        console.log('Account Status:', account.status);
        console.log('Account Type:', account.type);
        
        // Test phone number
        const incomingNumbers = await client.incomingPhoneNumbers.list();
        const ourNumber = incomingNumbers.find(num => num.phoneNumber === process.env.TWILIO_PHONE_NUMBER);
        
        if (ourNumber) {
            console.log('✅ Phone number found and active!');
            console.log('Phone Number SID:', ourNumber.sid);
        } else {
            console.log('❌ Phone number not found in your account');
        }
        
    } catch (error) {
        console.error('❌ Twilio connection failed:', error.message);
    }
}

testTwilioConnection();
