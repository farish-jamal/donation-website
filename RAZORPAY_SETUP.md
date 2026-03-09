# Razorpay Integration Setup Instructions

## What's Been Added

✅ **Backend Payment Routes** (in `backend/index.js`):
- `POST /api/payment/create-order` - Creates a Razorpay order
- `POST /api/payment/verify` - Verifies payment signature
- `POST /api/payment/webhook` - Handles Razorpay webhooks

✅ **Frontend Integration** (in `donation.html`):
- Razorpay payment option alongside existing QR code
- Amount selection buttons (₹500, ₹1000, ₹2000, ₹5000)
- Custom amount input
- Automatic form submission after successful payment
- Secure payment verification

✅ **Configuration Files**:
- Updated `js/config.js` with Razorpay endpoints and key configuration

## Setup Required

### 1. Get Razorpay Credentials
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys from the dashboard

### 2. Update Environment Variables
Edit `backend/.env` and replace the placeholder values:

```env
# Replace these with your actual Razorpay credentials
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 3. Update Frontend Configuration
Edit `js/config.js` and replace the Razorpay key:

```javascript
RAZORPAY: {
    KEY_ID: 'rzp_test_your_actual_key_id' // Replace with your actual key
}
```

### 4. Start the Backend Server
```bash
cd backend
npm start
```

## How It Works

### For Users:
1. **Option 1: QR Code Payment** (existing)
   - User scans QR code and pays manually
   - User fills form with UTR number

2. **Option 2: Razorpay Payment** (new)
   - User selects amount and enters details
   - Razorpay handles secure payment
   - Form is automatically filled and submitted
   - Donation is saved to database

### Payment Flow:
1. User clicks "Pay with Razorpay"
2. Backend creates Razorpay order
3. Razorpay payment gateway opens
4. User completes payment
5. Payment is verified with backend
6. Donation details are automatically saved
7. User sees success confirmation

## Testing

Use Razorpay's test mode with test cards:
- **Test Card**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Important Notes

⚠️ **Security**: Never expose your Razorpay secret key on the frontend
⚠️ **Environment**: Use test keys for development, live keys for production
⚠️ **Webhooks**: Set up webhooks in Razorpay dashboard for production use

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify your Razorpay credentials
3. Ensure backend server is running
4. Check network requests in browser dev tools