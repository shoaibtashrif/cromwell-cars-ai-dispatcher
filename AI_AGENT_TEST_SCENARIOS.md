# 🤖 Cromwell Cars AI Agent - Test Scenarios & Error Handling

## ✅ **All Tools Tested & Working**

### **Real API Integrations:**
- **Address Validation**: `https://online.ontimechauffeurs.co.uk/api/address/validate`
- **Create Booking**: `https://capi.cabee-est.com/api/Job/CreateOnlineJob`
- **Get Bookings**: `https://capi.cabee-est.com/api/Job/GetOnlineJobs`
- **Update Booking**: `https://capi.cabee-est.com/api/Job/UpdateOnlineJob/{id}`
- **Cancel Booking**: `https://capi.cabee-est.com/api/Job/CancelJob`
- **Driver Location**: `https://capi.cabee-est.com/api/Job/GetDriverCurrentLocationForJob/{jobNo}`

---

## 📞 **AI Agent Behavior Scenarios**

### **Scenario 1: Successful Booking Flow**
**User says:** *"I need a taxi from 10 Downing Street to Heathrow Airport"*

**AI Agent will:**
1. **Validate pickup address** using `address_validate` tool
   - ✅ **Success**: "Perfect, that's 10 Downing Street, London SW1A 2AA"
   - ❌ **Failure**: "I'm having trouble finding that address. Could you provide the full postcode?"

2. **Validate destination address** using `address_validate` tool
   - ✅ **Success**: "Great, Heathrow Airport is confirmed"
   - ❌ **Failure**: "Could you be more specific about which terminal at Heathrow?"

3. **Get pricing** using `checkPricing` tool
   - ✅ **Success**: "Your ride options are: Standard Car at 25.50 pounds, Estate Car at 32.00 pounds..."

4. **Collect booking details** (name, phone, email, passengers, date, time)

5. **Create booking** using `BookCab` tool
   - ✅ **Success**: "Your booking is confirmed. Your job number is A241. Thank you for choosing Cromwell Cars."
   - ❌ **Failure**: "I'm sorry, there was an issue creating your booking. Let me try that again."

---

### **Scenario 2: Address Validation Failures**

#### **Invalid Address:**
**User says:** *"Pick me up from 999 Fake Street, Nowhere"*

**AI Response:**
- Calls `address_validate` tool
- Gets low confidence result
- **AI says:** *"I'm having trouble finding that address. Could you please provide the correct street name and postcode?"*

#### **Partial Address:**
**User says:** *"Pick me up from Baker Street"*

**AI Response:**
- Calls `address_validate` tool
- Gets multiple candidates
- **AI says:** *"I found several Baker Streets. Could you please provide the full address including the house number and postcode?"*

---

### **Scenario 3: Booking Retrieval**

#### **With Job Number:**
**User says:** *"I want to check my booking A241"*

**AI Response:**
- Calls `BookCab` with `operation: "getBooking"` and `jobNO: "A241"`
- **Success**: *"I found your booking A241 for Test User, scheduled for January 15th at 10:00 AM, going from 10 Downing Street to Heathrow Airport for 25.50 pounds."*
- **Failure**: *"I'm sorry, I couldn't find a booking with that job number. Could you please check the number?"*

#### **With Phone Number:**
**User says:** *"I want to check my booking, my phone is +44123456789"*

**AI Response:**
- Calls `BookCab` with `operation: "getBooking"` and `Phone: "+44123456789"`
- **Success**: *"I found your booking A241..."*
- **Multiple**: *"I found multiple bookings for this phone number. The first is job number A241..."*

---

### **Scenario 4: Booking Updates**

**User says:** *"I want to change my pickup time to 2 PM"*

**AI Response:**
1. Gets current booking details
2. **AI says:** *"I found your booking A241. You want to change the pickup time from 10:00 AM to 2:00 PM. Is that correct?"*
3. Calls `BookCab` with `operation: "updateBooking"`
4. **Success**: *"Your booking has been successfully updated."*
5. **Failure**: *"I'm sorry, I couldn't update your booking at this time. Please try again later."*

---

### **Scenario 5: Booking Cancellation**

**User says:** *"I want to cancel my booking A241"*

**AI Response:**
1. Gets booking details for confirmation
2. **AI says:** *"I found your booking A241 for January 15th at 10:00 AM. Just to confirm, you want to cancel this booking?"*
3. **User confirms**: *"Yes"*
4. Calls `BookCab` with `operation: "cancelBooking"`
5. **Success**: *"Your booking A241 has been successfully cancelled."*
6. **Failure**: *"I'm sorry, I couldn't cancel your booking at this time. Please try again later."*

---

### **Scenario 6: Driver Location Check**

**User says:** *"Where is my driver for booking A241?"*

**AI Response:**
- Calls `BookCab` with `operation: "getDriverLocation"` and `jobNO: "A241"`
- **Success**: *"Your driver is currently near Hyde Park and is about 10 minutes away."*
- **Not Assigned**: *"I'm sorry, a driver hasn't been assigned to your booking yet. We'll notify you when one is assigned."*
- **Error**: *"I'm having trouble getting the driver location. Please try again in a few minutes."*

---

## 🛠️ **Error Handling Examples**

### **API Errors:**
- **400 Bad Request**: *"I'm sorry, there was an issue with your request. Let me try that again."*
- **404 Not Found**: *"I couldn't find that booking. Could you please check your job number?"*
- **500 Server Error**: *"I'm experiencing technical difficulties. Please try again in a moment."*

### **Address Validation Errors:**
- **Low Confidence**: *"I'm having trouble finding that address. Could you provide more details?"*
- **No Results**: *"I couldn't find that address. Could you please check the spelling and try again?"*
- **Multiple Matches**: *"I found several addresses matching that. Could you be more specific?"*

### **Booking Errors:**
- **Creation Failed**: *"I'm sorry, I couldn't create your booking at this time. Please try again later."*
- **Update Failed**: *"I couldn't update your booking. Please check your details and try again."*
- **Cancellation Failed**: *"I'm sorry, I couldn't cancel your booking. Please contact us directly."*

---

## 🎯 **AI Agent Confirmation Behavior**

### **After Address Validation:**
*"Perfect, that's 10 Downing Street, London SW1A 2AA. Is that correct?"*

### **After Pricing:**
*"Your Standard Car ride at 25.50 pounds is going from 10 Downing Street to Heathrow Airport. Is that correct?"*

### **Before Booking:**
*"Okay, so that's a Standard Car for 2 passengers, going from 10 Downing Street to Heathrow Airport on January 15th at 10:00 AM. Is that all correct?"*

### **After Successful Booking:**
*"Your booking is confirmed. Your job number is A241. Thank you for choosing Cromwell Cars."*

---

## 🚀 **Ready for Production!**

**All tools are working with real APIs and the AI agent is ready to handle:**
- ✅ Address validation with real Cromwell API
- ✅ Real booking creation, updates, and cancellations
- ✅ Driver location tracking
- ✅ Comprehensive error handling
- ✅ Natural conversation flow
- ✅ Confirmation of all details

**Call +17624000454 to test the AI agent!**
