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
        
        const requestPayload = {
            address_lines: address_lines,
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
            console.log(`❌ API Error: ${response.status}`);
            throw new Error(`Address validation API error: ${response.status}`);
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
                
                const bookingData = {
                    id: 0,
                    jobNO: jobNO || `A${Math.floor(Math.random() * 1000) + 200}`,
                    date: date || new Date().toISOString(),
                    passengerName: passengerName,
                    passengerPhone: Phone || '0000000000',
                    passengerMobile: Phone || '0000000000',
                    passengerEmail: passengerEmail,
                    passengers: passengers || 1,
                    bags: bags || 0,
                    note: note || '',
                    companyId: 99,
                    driver_id: null,
                    driverPrice: customerPrice || 0,
                    customerPrice: customerPrice || 0,
                    duration: 0,
                    distance: 0,
                    jobSource: 3,
                    jobcase: 0,
                    vehicleTypeId: vehicleTypeId || 79,
                    origin: origin,
                    destination: destination
                };
                
                console.log('🌐 CALLING CABEE CREATE BOOKING API:');
                console.log(`   URL: ${CABEE_API_BASE}/Job/CreateOnlineJob`);
                console.log(`   Method: POST`);
                console.log(`   Headers: Authorization: Bearer ${JWT_TOKEN?.substring(0, 20)}...`);
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
                    success: true,
                    jobNO: createResult.jobNO || bookingData.jobNO,
                    message: 'Booking created successfully',
                    data: createResult
                };
                
                console.log('📤 SENDING RESPONSE TO AI:');
                console.log(JSON.stringify(responseData, null, 2));
                
                res.json(responseData);
                break;
                
            case 'getBooking':
                console.log('\n🔍 === GET BOOKING OPERATION ===');
                console.log('🌐 CALLING CABEE GET BOOKINGS API:');
                console.log(`   URL: ${CABEE_API_BASE}/Job/GetOnlineJobs`);
                console.log(`   Method: GET`);
                console.log(`   Headers: Authorization: Bearer ${JWT_TOKEN?.substring(0, 20)}...`);
                
                const getResponse = await fetch(`${CABEE_API_BASE}/Job/GetOnlineJobs`, {
                    method: 'GET',
                    headers: {
                        'accept': 'text/plain',
                        'Authorization': `Bearer ${JWT_TOKEN}`
                    }
                });
                
                console.log(`📡 Cabee Response Status: ${getResponse.status} ${getResponse.statusText}`);
                
                if (!getResponse.ok) {
                    console.log(`❌ GET BOOKING ERROR: ${getResponse.status}`);
                    throw new Error(`Get booking API error: ${getResponse.status}`);
                }
                
                const getResult = await getResponse.json();
                console.log(`📤 GET BOOKING SUCCESS: ${getResult.length} total bookings retrieved`);
                
                // Filter by job number, phone, or addresses if provided
                let filteredBookings = getResult;
                console.log('🔍 APPLYING FILTERS:');
                
                if (jobNO) {
                    console.log(`   Filtering by Job Number: ${jobNO}`);
                    filteredBookings = getResult.filter(booking => booking.jobNO === jobNO);
                } else if (Phone) {
                    console.log(`   Filtering by Phone: ${Phone}`);
                    filteredBookings = getResult.filter(booking => 
                        booking.passengerPhone === Phone || booking.passengerMobile === Phone
                    );
                } else if (pickupAddress && dropoffAddress) {
                    console.log(`   Filtering by Addresses: ${pickupAddress} → ${dropoffAddress}`);
                    filteredBookings = getResult.filter(booking => 
                        booking.origin === pickupAddress && booking.destination === dropoffAddress
                    );
                } else {
                    console.log('   No filters applied - returning all bookings');
                }
                
                console.log(`✅ FILTERED RESULTS: ${filteredBookings.length} matching bookings`);
                
                if (filteredBookings.length > 0) {
                    console.log('📋 FOUND BOOKINGS:');
                    filteredBookings.forEach((booking, index) => {
                        console.log(`   ${index + 1}. Job ${booking.jobNO} - ${booking.passengerName} - ${booking.origin} → ${booking.destination}`);
                    });
                } else {
                    console.log('⚠️ NO MATCHING BOOKINGS FOUND');
                }
                
                console.log('📤 SENDING RESPONSE TO AI:');
                console.log(JSON.stringify(filteredBookings, null, 2));
                
                res.json(filteredBookings);
                break;
                
            case 'updateBooking':
                // Update existing booking using real API
                console.log('Updating booking...');
                const updateData = {
                    id: req.body.id || 0,
                    jobNO: jobNO,
                    date: date || new Date().toISOString(),
                    passengerName: passengerName,
                    passengerPhone: Phone,
                    passengerMobile: Phone,
                    passengerEmail: passengerEmail,
                    passengers: passengers || 1,
                    bags: bags || 0,
                    note: note || '',
                    companyId: 99,
                    driver_id: null,
                    paymentMethod_id: 0,
                    driverPrice: customerPrice || 0,
                    customerPrice: customerPrice || 0,
                    duration: 0,
                    distance: 0,
                    jobSource: 3,
                    jobcase: 0,
                    vehicleTypeId: vehicleTypeId || 79,
                    origin: origin,
                    destination: destination
                };
                
                const updateResponse = await fetch(`${CABEE_API_BASE}/Job/UpdateOnlineJob/${req.body.id}`, {
                    method: 'PUT',
                    headers: {
                        'accept': 'text/plain',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JWT_TOKEN}`
                    },
                    body: JSON.stringify(updateData)
                });
                
                if (!updateResponse.ok) {
                    throw new Error(`Update booking API error: ${updateResponse.status}`);
                }
                
                const updateResult = await updateResponse.json();
                console.log('Booking updated:', updateResult);
                
                res.json({
                    success: true,
                    jobNO: jobNO,
                    message: 'Booking updated successfully',
                    data: updateResult
                });
                break;
                
            case 'cancelBooking':
                // Cancel booking using real API
                console.log('Cancelling booking...');
                const cancelData = new URLSearchParams();
                if (jobNO) {
                    cancelData.append('jobNo', jobNO);
                } else if (Phone) {
                    cancelData.append('mobile', Phone);
                }
                
                const cancelResponse = await fetch(`${CABEE_API_BASE}/Job/CancelJob`, {
                    method: 'POST',
                    headers: {
                        'accept': 'text/plain',
                        'Authorization': `Bearer ${JWT_TOKEN}`
                    },
                    body: cancelData
                });
                
                if (!cancelResponse.ok) {
                    throw new Error(`Cancel booking API error: ${cancelResponse.status}`);
                }
                
                // Handle text response instead of JSON
                const cancelResult = await cancelResponse.text();
                console.log('Booking cancelled:', cancelResult);
                
                res.json({
                    success: true,
                    jobNO: jobNO,
                    message: 'Booking cancelled successfully',
                    data: cancelResult
                });
                break;
                
            case 'getDriverLocation':
                // Get driver location using real API
                console.log('Getting driver location...');
                const locationResponse = await fetch(`${CABEE_API_BASE}/Job/GetDriverCurrentLocationForJob/${jobNO}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'text/plain',
                        'Authorization': `Bearer ${JWT_TOKEN}`
                    }
                });
                
                if (!locationResponse.ok) {
                    if (locationResponse.status === 404) {
                        res.status(404).json({
                            success: false,
                            error: 'Driver location not found or not assigned yet'
                        });
                        return;
                    }
                    throw new Error(`Get driver location API error: ${locationResponse.status}`);
                }
                
                const locationResult = await locationResponse.json();
                console.log('Driver location:', locationResult);
                
                res.json({
                    success: true,
                    jobNO: jobNO,
                    driverLocation: locationResult,
                    message: 'Driver location retrieved successfully'
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
