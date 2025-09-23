// Test script for Cromwell Cars API tools
const BASE_URL = 'http://localhost:3000/cromwell';

async function testTools() {
    console.log('\n🚀 STARTING TOOLS TEST\n');
    
    try {
        // 1. Test Address Validation
        console.log('1️⃣ TESTING ADDRESS VALIDATION');
        const addressResponse = await fetch(`${BASE_URL}/validateAddress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                address_lines: ["10 Downing Street"],
                postcode: "SW1A 2AA",
                building: "10"
            })
        });
        console.log('Address Validation Response:', await addressResponse.json());

        // 2. Test Price Check
        console.log('\n2️⃣ TESTING PRICE CHECK');
        const priceResponse = await fetch(`${BASE_URL}/checkPricing`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sourceAddress: "10 Downing Street, London",
                destinationAddress: "Heathrow Airport, London"
            })
        });
        console.log('Price Check Response:', await priceResponse.json());

        // 3. Create Booking
        console.log('\n3️⃣ TESTING BOOKING CREATION');
        const bookingResponse = await fetch(`${BASE_URL}/bookCab`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                operation: "cabBooking",
                companyId: 99,
                passengerName: "Test User",
                passengerEmail: "test@example.com",
                Phone: "07700900000",
                passengers: 2,
                vehicleTypeId: 68,
                origin: "10 Downing Street, London",
                destination: "Heathrow Airport, London",
                date: new Date().toISOString(),
                customerPrice: 50,
                bags: 2,
                note: "Test booking"
            })
        });
        const bookingResult = await bookingResponse.json();
        console.log('Booking Creation Response:', bookingResult);
        
        const jobNO = bookingResult.data?.jobNO;
        if (!jobNO) {
            throw new Error('No job number received from booking creation');
        }

        // 4. Get Booking
        console.log('\n4️⃣ TESTING GET BOOKING');
        const getResponse = await fetch(`${BASE_URL}/bookCab`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                operation: "getBooking",
                jobNO: jobNO
            })
        });
        console.log('Get Booking Response:', await getResponse.json());

        // 5. Update Booking
        console.log('\n5️⃣ TESTING UPDATE BOOKING');
        const updateResponse = await fetch(`${BASE_URL}/bookCab`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                operation: "updateBooking",
                jobNO: jobNO,
                passengerName: "Updated Test User",
                origin: "20 Piccadilly, London",
                note: "Updated test booking"
            })
        });
        console.log('Update Booking Response:', await updateResponse.json());

        // 6. Get Driver Location
        console.log('\n6️⃣ TESTING DRIVER LOCATION');
        const locationResponse = await fetch(`${BASE_URL}/bookCab`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                operation: "getDriverLocation",
                jobNO: jobNO
            })
        });
        console.log('Driver Location Response:', await locationResponse.json());

        // 7. Cancel Booking
        console.log('\n7️⃣ TESTING BOOKING CANCELLATION');
        const cancelResponse = await fetch(`${BASE_URL}/bookCab`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                operation: "cancelBooking",
                jobNO: jobNO,
                companyId: 99
            })
        });
        console.log('Cancel Booking Response:', await cancelResponse.json());

    } catch (error) {
        console.error('❌ TEST ERROR:', error.message);
    }
    
    console.log('\n✅ TOOLS TEST COMPLETE\n');
}

// Run the tests
testTools(); 