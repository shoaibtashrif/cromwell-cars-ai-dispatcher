import express from 'express';
import 'dotenv/config';

const router = express.Router();

// Cromwell Cars API Configuration
const CROMWELL_API_BASE = 'https://online.ontimechauffeurs.co.uk/api';
const CABEE_API_BASE = 'https://capi.cabee-est.com/api';
const JWT_TOKEN = process.env.CABEE_JWT_TOKEN;

// Validate UK addresses using real API
router.post('/validateAddress', async (req, res) => {
    const timestamp = new Date().toISOString();
    const callId = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
        console.log('\n🔍 ===== ADDRESS VALIDATION TOOL CALLED =====');
        console.log(`📅 Timestamp: ${timestamp}`);
        console.log(`🆔 Call ID: ${callId}`);
        console.log('📥 INCOMING REQUEST:');
        console.log(JSON.stringify(req.body, null, 2));
        
        const { address_lines, postcode, building } = req.body;
        
        // Fix: Parse stringified address_lines array from AI
        let parsedAddressLines = address_lines;
        if (typeof address_lines === 'string') {
            try {
                // Parse JSON string like "[\"Address\"]" to actual array
                parsedAddressLines = JSON.parse(address_lines);
                console.log(`🔧 PARSED STRING TO ARRAY: ${address_lines} → ${JSON.stringify(parsedAddressLines)}`);
            } catch (e) {
                // If not valid JSON, treat as single address
                parsedAddressLines = [address_lines];
                console.log(`🔧 CONVERTED TO ARRAY: ${address_lines} → ${JSON.stringify(parsedAddressLines)}`);
            }
        } else if (!Array.isArray(address_lines)) {
            // Ensure it's always an array
            parsedAddressLines = address_lines ? [address_lines] : [];
            console.log(`🔧 MADE ARRAY: ${address_lines} → ${JSON.stringify(parsedAddressLines)}`);
        } else {
            console.log(`✅ ALREADY ARRAY: ${JSON.stringify(parsedAddressLines)}`);
        }
        
        const requestPayload = {
            address_lines: parsedAddressLines,
            postcode: postcode,
            building: building
        };
        
        console.log('🌐 CALLING CROMWELL ADDRESS API:');
        console.log(`   URL: ${CROMWELL_API_BASE}/address/validate`);
        console.log(`   Method: POST`);
        console.log(`   Payload:`, JSON.stringify(requestPayload, null, 2));
        
        // Call the real Cromwell Cars address validation API
        const response = await fetch(`${CROMWELL_API_BASE}/address/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload)
        });
        
        console.log(`📡 API Response Status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log(`❌ API Error: ${response.status}`);
            console.log(`❌ Error Details: ${errorText}`);
            throw new Error(`Address validation API error: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('📤 API RESPONSE DATA:');
        console.log(JSON.stringify(result, null, 2));
        
        console.log('✅ ADDRESS VALIDATION SUCCESS');
        console.log(`🔍 Found ${result.candidates ? result.candidates.length : 0} address candidates`);
        console.log(`🎯 Confidence: ${result.google_confidence || result.source || 'N/A'}`);
        
        if (result.candidates && result.candidates.length > 0) {
            console.log('📍 TOP ADDRESS CANDIDATE:');
            console.log(`   Formatted: ${result.candidates[0].formatted}`);
            console.log(`   Postcode: ${result.candidates[0].postcode}`);
        }
        
        console.log('📤 SENDING RESPONSE TO AI:');
        console.log(JSON.stringify(result, null, 2));
        console.log('🔍 ===== ADDRESS VALIDATION COMPLETE =====\n');
        
        res.json(result);
    } catch (error) {
        console.log('❌ ===== ADDRESS VALIDATION ERROR =====');
        console.log(`🆔 Call ID: ${callId}`);
        console.log(`📅 Timestamp: ${timestamp}`);
        console.log('💥 ERROR DETAILS:', error.message);
        console.log('📤 ERROR RESPONSE TO AI:', {
            success: false,
            error: 'Address validation failed',
            details: error.message
        });
        console.log('❌ ===== ADDRESS VALIDATION ERROR END =====\n');
        
        res.status(500).json({ 
            success: false, 
            error: 'Address validation failed',
            details: error.message 
        });
    }
});

// Check pricing using real Make.com webhook
router.post('/checkPricing', async (req, res) => {
    const timestamp = new Date().toISOString();
    const callId = `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
        console.log('\n💰 ===== PRICING TOOL CALLED =====');
        console.log(`📅 Timestamp: ${timestamp}`);
        console.log(`🆔 Call ID: ${callId}`);
        console.log('📥 INCOMING REQUEST:');
        console.log(JSON.stringify(req.body, null, 2));
        
        const { sourceAddress, destinationAddress } = req.body;
        
        // Always use company ID 99 as specified
        const pricingData = {
            operation: 'checkPricing',
            companyId: '99',
            sourceAddress: sourceAddress,
            destinationAddress: destinationAddress
        };
        
        console.log('🌐 CALLING MAKE.COM WEBHOOK:');
        console.log(`   URL: https://hook.eu2.make.com/7k8jjdhuqbuyywi3mkuwmm9rd6t1fpzi`);
        console.log(`   Method: POST`);
        console.log(`   Payload:`, JSON.stringify(pricingData, null, 2));
        
        const response = await fetch('https://hook.eu2.make.com/7k8jjdhuqbuyywi3mkuwmm9rd6t1fpzi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pricingData)
        });
        
        console.log(`📡 Make.com Response Status: ${response.status} ${response.statusText}`);
        console.log(`📋 Content-Type: ${response.headers.get('content-type')}`);
        
        if (!response.ok) {
            console.log(`❌ Make.com API Error: ${response.status}`);
            throw new Error(`Pricing API error: ${response.status}`);
        }
        
        // Handle both JSON and text responses
        const contentType = response.headers.get('content-type');
        let result;
        
        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
            console.log('📤 Make.com JSON Response:');
            console.log(JSON.stringify(result, null, 2));
        } else {
            const textResult = await response.text();
            console.log('📤 Make.com Text Response:', textResult);
            
            // If Make.com returns "Accepted", create a success response
            if (textResult.includes('Accepted')) {
                result = {
                    success: true,
                    message: 'Pricing request accepted and processing',
                    status: 'accepted',
                    webhook_response: textResult
                };
                console.log('✅ PRICING REQUEST ACCEPTED');
            } else {
                result = {
                    success: false,
                    error: 'Unexpected response format',
                    response: textResult
                };
                console.log('⚠️ UNEXPECTED RESPONSE FORMAT');
            }
        }
        
        console.log('📤 SENDING RESPONSE TO AI:');
        console.log(JSON.stringify(result, null, 2));
        console.log('💰 ===== PRICING TOOL COMPLETE =====\n');
        
        res.json(result);
    } catch (error) {
        console.log('❌ ===== PRICING TOOL ERROR =====');
        console.log(`🆔 Call ID: ${callId}`);
        console.log(`📅 Timestamp: ${timestamp}`);
        console.log('💥 ERROR DETAILS:', error.message);
        console.log('📤 ERROR RESPONSE TO AI:', {
            success: false,
            error: 'Failed to get pricing',
            details: error.message
        });
        console.log('❌ ===== PRICING TOOL ERROR END =====\n');
        
        res.status(500).json({ 
            success: false, 
            error: 'Failed to get pricing',
            details: error.message 
        });
    }
});

// Handle all booking operations using real Cabee APIs
router.post('/bookCab', async (req, res) => {
    const timestamp = new Date().toISOString();
    const callId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
        console.log('\n🚖 ===== BOOKING TOOL CALLED =====');
        console.log(`📅 Timestamp: ${timestamp}`);
        console.log(`🆔 Call ID: ${callId}`);
        console.log('📥 INCOMING REQUEST:');
        console.log(JSON.stringify(req.body, null, 2));
        
        const { operation, jobNO, Phone, pickupAddress, dropoffAddress, passengerName, passengerEmail, passengers, vehicleTypeId, origin, destination, date, customerPrice, bags, note } = req.body;
        
        console.log(`🎯 OPERATION: ${operation}`);
        console.log(`📋 Key Parameters:`);
        if (jobNO) console.log(`   Job Number: ${jobNO}`);
        if (Phone) console.log(`   Phone: ${Phone}`);
        if (passengerName) console.log(`   Passenger: ${passengerName}`);
        if (origin) console.log(`   From: ${origin}`);
        if (destination) console.log(`   To: ${destination}`);
        
        switch (operation) {
            case 'cabBooking':
                console.log('\n📝 === CREATE BOOKING OPERATION ===');
                
                // Map vehicle types to API IDs (based on your working example)
                const vehicleTypeMapping = {
                    'standard': 68,
                    'estate': 69,
                    'mpv': 70,
                    'MPV': 70,
                    'luxury': 71,
                    'executive': 71
                };
                
                // Get numeric vehicle type ID
                let numericVehicleTypeId = 68; // default to standard
                if (vehicleTypeId) {
                    const vehicleTypeLower = vehicleTypeId.toString().toLowerCase();
                    numericVehicleTypeId = vehicleTypeMapping[vehicleTypeLower] || vehicleTypeMapping[vehicleTypeId] || 68;
                }
                
                const bookingData = {
                    id: 0,
                    jobNO: "string", // API will assign actual job number
                    date: date || new Date().toISOString(),
                    passengerName: passengerName,
                    passengerPhone: Phone || '03000000000', // Use actual phone
                    passengerMobile: Phone || '03000000000', // Use actual phone  
                    passengerEmail: passengerEmail,
                    passengers: parseInt(passengers) || 1,
                    bags: parseInt(bags) || 0,
                    note: note || '',
                    companyId: 99,
                    driver_id: null,
                    paymentMethod_id: null,
                    driverPrice: parseFloat(customerPrice) || 0,
                    customerPrice: parseFloat(customerPrice) || 0,
                    duration: 0, // Will be calculated by system
                    distance: 0, // Will be calculated by system
                    jobSource: 3,
                    jobcase: 0,
                    vehicleTypeId: numericVehicleTypeId, // Now numeric
                    origin: origin,
                    destination: destination
                };
                
                console.log('🌐 CALLING CABEE CREATE BOOKING API:');
                console.log(`   URL: ${CABEE_API_BASE}/Job/CreateOnlineJob`);
                console.log(`   Method: POST`);
                console.log(`   Headers: Authorization: Bearer ${JWT_TOKEN?.substring(0, 20)}...`);
                console.log(`   Vehicle Type Mapping: "${vehicleTypeId}" → ${numericVehicleTypeId}`);
                console.log(`   Phone Number: ${Phone}`);
                console.log(`   Payload:`, JSON.stringify(bookingData, null, 2));
                
                const createResponse = await fetch(`${CABEE_API_BASE}/Job/CreateOnlineJob`, {
                    method: 'POST',
                    headers: {
                        'accept': 'text/plain',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JWT_TOKEN}`
                    },
                    body: JSON.stringify(bookingData)
                });
                
                console.log(`📡 Cabee Response Status: ${createResponse.status} ${createResponse.statusText}`);
                
                if (!createResponse.ok) {
                    const errorText = await createResponse.text();
                    console.log(`❌ CREATE BOOKING ERROR:`);
                    console.log(`   Status: ${createResponse.status}`);
                    console.log(`   Error Text: ${errorText}`);
                    throw new Error(`Create booking API error: ${createResponse.status} - ${errorText}`);
                }
                
                const createResult = await createResponse.json();
                console.log('📤 CREATE BOOKING SUCCESS:');
                console.log(JSON.stringify(createResult, null, 2));
                console.log(`✅ New Job Number: ${createResult.jobNO}`);
                console.log(`👤 Passenger: ${createResult.passengerName}`);
                console.log(`💰 Price: £${createResult.customerPrice}`);
                
                const responseData = {
                    status: "success",  // Changed from success: true to be more explicit
                    booking_status: "confirmed",  // Added to be explicit about booking state
                    error: null,  // Explicitly showing no error
                    data: {
                        jobNO: createResult.jobNO,
                        bookingId: createResult.id,
                        passengerName: createResult.passengerName,
                        customerPrice: createResult.customerPrice,
                        date: createResult.date,
                        origin: createResult.origin,
                        destination: createResult.destination,
                        vehicleType: vehicleTypeId
                    }
                };

                console.log('📤 SENDING RESPONSE TO AI:');
                console.log(JSON.stringify(responseData, null, 2));
                
                res.json(responseData);
                break;
                
            case 'getBooking':
                console.log('Getting booking details...');
                
                let getBookingUrl = `${CABEE_API_BASE}/Job/GetJob`;
                if (jobNO) {
                    getBookingUrl += `/${jobNO}`;
                } else if (Phone) {
                    getBookingUrl += `/GetByMobile/${Phone}`;
                }
                
                console.log(`📤 GET BOOKING REQUEST: ${getBookingUrl}`);
                
                const getResponse = await fetch(getBookingUrl, {
                    method: 'GET',
                    headers: {
                        'accept': 'text/plain',
                        'Authorization': `Bearer ${JWT_TOKEN}`
                    }
                });
                
                console.log(`📡 Get Response Status: ${getResponse.status} ${getResponse.statusText}`);
                
                if (!getResponse.ok) {
                    const errorText = await getResponse.text();
                    console.log(`❌ GET BOOKING ERROR:`, errorText);
                    if (getResponse.status === 404) {
                        res.status(404).json({
                            status: "error",
                            booking_status: "not_found",
                            error: "Booking not found",
                            data: null
                        });
                        return;
                    }
                    throw new Error(`Get booking API error: ${getResponse.status} - ${errorText}`);
                }
                
                const getResult = await getResponse.json();
                console.log('✅ GET BOOKING SUCCESS:', JSON.stringify(getResult, null, 2));
                
                res.json({
                    status: "success",
                    booking_status: "found",
                    error: null,
                    data: getResult
                });
                break;
                
            case 'updateBooking':
                console.log('Updating booking...');
                
                // Use consistent format for update data
                const updateData = {
                    id: jobNO,
                    companyId: 99,
                    passengerName: passengerName,
                    passengerPhone: Phone,
                    passengerEmail: passengerEmail,
                    passengers: parseInt(passengers) || undefined,
                    date: date,
                    origin: origin,
                    destination: destination,
                    note: note
                };
                
                console.log('📤 UPDATE REQUEST:', JSON.stringify(updateData, null, 2));
                
                const updateResponse = await fetch(`${CABEE_API_BASE}/Job/UpdateJob`, {
                    method: 'PUT',
                    headers: {
                        'accept': 'text/plain',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JWT_TOKEN}`
                    },
                    body: JSON.stringify(updateData)
                });
                
                console.log(`📡 Update Response Status: ${updateResponse.status} ${updateResponse.statusText}`);
                
                if (!updateResponse.ok) {
                    const errorText = await updateResponse.text();
                    console.log(`❌ UPDATE ERROR:`, errorText);
                    throw new Error(`Update booking API error: ${updateResponse.status} - ${errorText}`);
                }
                
                const updateResult = await updateResponse.json();
                console.log('✅ UPDATE SUCCESS:', JSON.stringify(updateResult, null, 2));
                
                res.json({
                    status: "success",
                    booking_status: "updated",
                    error: null,
                    data: updateResult
                });
                break;
                
            case 'cancelBooking':
                console.log('Cancelling booking...');
                
                // Use JSON format consistently
                const cancelData = {
                    jobNo: jobNO,
                    companyId: 99  // Use same companyId as booking creation
                };
                
                if (Phone) {
                    cancelData.mobile = Phone;
                }
                
                console.log('📤 CANCEL REQUEST:', JSON.stringify(cancelData, null, 2));
                
                const cancelResponse = await fetch(`${CABEE_API_BASE}/Job/CancelJob`, {
                    method: 'POST',
                    headers: {
                        'accept': 'text/plain',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JWT_TOKEN}`
                    },
                    body: JSON.stringify(cancelData)
                });
                
                console.log(`📡 Cancel Response Status: ${cancelResponse.status} ${cancelResponse.statusText}`);
                
                if (!cancelResponse.ok) {
                    const errorText = await cancelResponse.text();
                    console.log(`❌ CANCEL ERROR:`, errorText);
                    throw new Error(`Cancel booking API error: ${cancelResponse.status} - ${errorText}`);
                }
                
                const cancelResult = await cancelResponse.text();
                console.log('✅ CANCEL SUCCESS:', cancelResult);
                
                res.json({
                    status: "success",
                    booking_status: "cancelled",
                    error: null,
                    data: {
                        jobNO: jobNO,
                        result: cancelResult
                    }
                });
                break;
                
            case 'getDriverLocation':
                console.log('Getting driver location...');
                
                console.log(`📤 LOCATION REQUEST: Job ${jobNO}`);
                
                const locationResponse = await fetch(`${CABEE_API_BASE}/Job/GetDriverCurrentLocationForJob/${jobNO}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'text/plain',
                        'Authorization': `Bearer ${JWT_TOKEN}`
                    }
                });
                
                console.log(`📡 Location Response Status: ${locationResponse.status} ${locationResponse.statusText}`);
                
                if (!locationResponse.ok) {
                    const errorText = await locationResponse.text();
                    console.log(`❌ LOCATION ERROR:`, errorText);
                    if (locationResponse.status === 404) {
                        res.status(404).json({
                            status: "error",
                            booking_status: "driver_not_found",
                            error: "Driver location not available or not assigned yet",
                            data: null
                        });
                        return;
                    }
                    throw new Error(`Get driver location API error: ${locationResponse.status} - ${errorText}`);
                }
                
                const locationResult = await locationResponse.json();
                console.log('✅ LOCATION SUCCESS:', JSON.stringify(locationResult, null, 2));
                
                res.json({
                    status: "success",
                    booking_status: "driver_located",
                    error: null,
                    data: {
                        jobNO: jobNO,
                        location: locationResult
                    }
                });
                break;
                
            default:
                res.status(400).json({ success: false, error: 'Invalid operation' });
        }
    } catch (error) {
        console.log('❌ ===== BOOKING TOOL ERROR =====');
        console.log(`🆔 Call ID: ${callId}`);
        console.log(`📅 Timestamp: ${timestamp}`);
        console.log(`🎯 Failed Operation: ${req.body.operation || 'unknown'}`);
        console.log('💥 ERROR DETAILS:', error.message);
        console.log('📤 ERROR RESPONSE TO AI:', {
            success: false,
            error: 'Booking operation failed',
            details: error.message
        });
        console.log('❌ ===== BOOKING TOOL ERROR END =====\n');
        
        res.status(500).json({ 
            success: false, 
            error: 'Booking operation failed',
            details: error.message 
        });
    }
    
    console.log('🚖 ===== BOOKING TOOL COMPLETE =====\n');
});

export { router };
