# GBS Stripe Payment Integration

This document provides a complete guide for integrating the Stripe payment system with your GBS application.

## **Overview**

The integration includes:
- ✅ Web payments via Stripe Checkout
- ✅ Mobile payments via PaymentIntents  
- ✅ Package creation, updates, and extensions
- ✅ Real-time plan fetching from backend
- ✅ Payment success/cancel handling
- ✅ Authentication integration ready

## **Backend API Endpoints**

### **Payment Operations**
- `POST /payment/checkout` - Create Stripe Checkout session (Web)
- `POST /payment/create-payment-intent` - Create PaymentIntent (Mobile)
- `POST /payment/update-checkout` - Update package via Stripe (Web)
- `POST /payment/update-payment-intent` - Update package via PaymentIntent (Mobile)
- `GET /payment/success` - Payment success page
- `GET /payment/cancel` - Payment cancel page
- `POST /webhook` - Stripe webhook handler

### **User & Package Management**
- `GET /roles` - Get all available plans/roles
- `GET /user-package/active` - Get user's active package
- `POST /user-package` - Create new package
- `PUT /user-package/:id` - Update existing package

## **Frontend Integration**

### **1. Environment Setup**

Create a `.env` file in your project root:

```bash
# Copy the example file
cp .env.example .env

# Update with your values
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

### **2. Key Components**

#### **API Services** (`src/services/`)
- `api.ts` - Core API client with authentication
- `stripe.ts` - Stripe-specific payment operations
- `auth.ts` - Authentication service

#### **React Components** (`src/components/stripe/`)
- `StripePlans.tsx` - Dynamic plan selection with real data
- `StripePaymentSuccess.tsx` - Payment success page
- `StripePaymentCancel.tsx` - Payment cancel page
- `StripeCheckout.tsx` - Checkout page (ready for Stripe integration)
- `StripeLayout.tsx` - Main layout with navigation

### **3. Payment Flow**

#### **Web Flow (Stripe Checkout)**
1. User selects plan → `StripePlans.tsx`
2. Click "Get Started" → `stripeService.redirectToCheckout()`
3. Redirect to Stripe Checkout → Backend creates session
4. User completes payment → Stripe redirects back
5. Success page → `/payment/success?session_id=xxx`
6. Webhook processes payment → Backend activates package

#### **Mobile Flow (PaymentIntent)**
1. User selects plan → `stripeService.createPaymentIntent()`
2. Frontend shows Stripe Payment Element
3. User completes payment → `stripeService.confirmPayment()`
4. Success handling → Package activation

## **Authentication Setup**

The app is ready for JWT authentication. Update `authService` in `src/services/auth.ts` with your auth endpoints:

```typescript
// Update these endpoints in authApi
login: async (credentials) => await api.post('/auth/login', credentials),
register: async (userData) => await api.post('/auth/register', userData),
getCurrentUser: async () => await api.get('/auth/me'),
```

## **Currency Configuration**

The system is configured for **AUD (Australian Dollar)**:

### **Backend Updates Needed**
```typescript
// In stripe.service.ts
currency: 'aud', // Already configured

// In payments.controller.ts  
successUrl/cancelUrl: 'https://gbs.westsidecarcare.com.au/...'
```

### **Frontend Currency Display**
```typescript
// Helper functions available
formatPrice(amountInCents, 'aud') // $29.99
formatPriceFromDecimal(amount, 'aud') // $29.99
```

## **Package Management Features**

### **Supported Operations**
- ✅ **Create** new packages
- ✅ **Upgrade** packages (paid upgrades only)
- ✅ **Extend** packages (add months)
- ✅ **Upgrade + Extend** (combined operation)

### **Package Update Flow**
1. Check current package: `userPackageApi.getActivePackage()`
2. Calculate proration for upgrades
3. Create update session: `stripeService.redirectToUpdateCheckout()`
4. Handle webhook for package activation

## **Webhook Configuration**

### **Required Webhook Events**
- `checkout.session.completed` - Web checkout success
- `payment_intent.succeeded` - Mobile payment success

### **Webhook URL**
```
https://your-domain.com/webhook
```

### **Environment Variables (Backend)**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=https://gbs.westsidecarcare.com.au/payment/success?session_id={CHECKOUT_SESSION_ID}
STRIPE_CANCEL_URL=https://gbs.westsidecarcare.com.au/payment/cancel
```

## **Testing the Integration**

### **1. Start Development Servers**

```bash
# Frontend
npm run dev

# Backend (your NestJS app)
npm run start:dev
```

### **2. Test Payment Flow**

1. Navigate to `/stripe/plans`
2. Select a plan and click "Get Started"
3. Complete test payment in Stripe Checkout
4. Verify redirect to success page
5. Check backend for package activation

### **3. Test Webhooks**

Use Stripe CLI to test webhooks locally:

```bash
# Forward webhook events to local backend
stripe listen --forward-to localhost:3000/webhook
```

## **Mobile App Integration**

For React Native, Flutter, or native apps:

### **1. Create PaymentIntent**
```typescript
const { clientSecret, paymentIntentId } = await stripeService.createPaymentIntent({
  roleId: 'role_id',
  months: 1,
  trial: false
});
```

### **2. Use Stripe Mobile SDKs**
- **React Native**: `@stripe/stripe-react-native`
- **Flutter**: `flutter_stripe`
- **iOS**: `Stripe iOS SDK`
- **Android**: `Stripe Android SDK`

### **3. Confirm Payment**
Use the `clientSecret` with the mobile SDK to complete payment.

## **Error Handling**

### **Common Issues**
1. **CORS Errors** - Ensure backend allows frontend origin
2. **Webhook Failures** - Check webhook secret and URL
3. **Authentication** - Verify JWT token handling
4. **Currency Mismatch** - Ensure AUD is used throughout

### **Debug Mode**
Enable debug logging in development:

```typescript
// In api.ts - add request/response logging
api.interceptors.request.use(config => {
  console.log('API Request:', config);
  return config;
});
```

## **Production Deployment**

### **Required Updates**
1. **Stripe Keys** - Use production keys
2. **Webhook URL** - Update to production domain
3. **Success/Cancel URLs** - Update to production URLs
4. **Environment Variables** - Set production values

### **Security Considerations**
- Never expose Stripe secret key in frontend
- Use HTTPS in production
- Validate webhook signatures
- Implement proper authentication

## **Support & Troubleshooting**

### **Common Questions**
- **Q: Can I change the currency?** 
  - A: Yes, update both backend and frontend currency codes
  
- **Q: How do I add custom features to plans?**
  - A: Add features array to roles in your backend database
  
- **Q: Can I support multiple payment methods?**
  - A: Stripe Checkout automatically supports cards, Apple Pay, Google Pay

### **Getting Help**
1. Check browser console for errors
2. Verify backend API responses
3. Test with Stripe CLI for webhooks
4. Check Stripe Dashboard for payment logs

---

## **Next Steps**

1. ✅ **Core Integration** - Complete
2. 🔄 **Authentication** - Add your auth system
3. 🔄 **Testing** - Test with real Stripe keys
4. 🔄 **Mobile SDK** - Integrate mobile payment SDKs
5. 🔄 **Production** - Deploy with production keys

The integration is now ready for use! Users can navigate to your GBS app and perform transactions seamlessly through the Stripe payment system.
