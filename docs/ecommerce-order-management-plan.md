# eCommerce & Order Management System Plan

## Current State Assessment

### ✅ **Existing Infrastructure**
- **PaymentProcessor** component with full form handling
- **OrderConfirmation** component with order tracking steps
- **ExportInterface** integration for engraved map purchases
- **Map Creation Store** with payment state management
- **Material selection** and pricing system
- **Order flow** from map creation to confirmation

### ❌ **Missing Components**
- **Real Stripe integration** (currently simulated)
- **User authentication & accounts**
- **Database schema** for orders and users
- **Admin dashboard** for order management
- **User dashboard** for order history
- **Backend API** for order processing
- **Email notifications** system

## Implementation Plan

### Phase 1: Backend Infrastructure & Database 🗄️
**Priority: High | Timeline: 1-2 weeks**

#### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table  
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL, -- EM123456
  user_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Customer info (for guest orders)
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  
  -- Shipping address
  shipping_address_line1 VARCHAR(255),
  shipping_address_line2 VARCHAR(255),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100), 
  shipping_postal_code VARCHAR(20),
  shipping_country VARCHAR(2),
  
  -- Stripe data
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  
  -- Map data (JSON)
  map_data JSONB, -- locations, style, template info
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_type VARCHAR(50), -- 'engraved_map', 'digital_download'
  material_id VARCHAR(50), -- 'wood', 'metal', etc.
  size VARCHAR(50),
  orientation VARCHAR(50),
  theme VARCHAR(50),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  
  -- Digital assets
  download_url VARCHAR(500),
  download_expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order status history
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  status VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### API Endpoints
- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/login` - User login  
- **GET** `/api/auth/me` - Get current user
- **POST** `/api/orders` - Create new order
- **GET** `/api/orders` - Get user orders
- **GET** `/api/orders/:id` - Get specific order
- **PATCH** `/api/orders/:id/status` - Update order status (admin)
- **POST** `/api/stripe/create-payment-intent` - Stripe integration
- **POST** `/api/stripe/webhook` - Stripe webhooks

#### Tasks
- [ ] Set up database (PostgreSQL/Supabase)
- [ ] Create API routes with Next.js App Router
- [ ] Implement authentication (NextAuth.js)
- [ ] Set up Stripe integration
- [ ] Create order management utilities

### Phase 2: User Authentication & Account System 👤
**Priority: High | Timeline: 1 week**

#### Components to Build
- **LoginModal** - Quick login/register popup
- **UserDashboard** - Order history and account management
- **AccountSettings** - Profile management
- **GuestCheckout** - Allow purchases without account

#### Features
- **Email/password authentication**
- **Social login** (Google, optional)
- **Guest checkout** with email
- **Account creation** post-purchase for guests
- **Password reset** functionality

#### Tasks
- [ ] Implement NextAuth.js configuration
- [ ] Create login/register components
- [ ] Add authentication to payment flow
- [ ] Build user dashboard page
- [ ] Implement guest checkout option

### Phase 3: Stripe Integration 💳
**Priority: High | Timeline: 1 week**

#### Replace Simulated Payment
- **Stripe Elements** for card input
- **Payment Intents** for secure processing
- **Webhooks** for order confirmation
- **Customer management** for repeat orders
- **Invoice generation** and receipts

#### Security Features
- **PCI compliance** via Stripe
- **3D Secure** support
- **Fraud detection**
- **Refund handling**

#### Tasks
- [ ] Install and configure Stripe SDK
- [ ] Replace PaymentProcessor with Stripe Elements
- [ ] Implement payment intent creation
- [ ] Set up webhook handling
- [ ] Add subscription handling (future)

### Phase 4: Order Management & Admin Dashboard 📊
**Priority: Medium | Timeline: 1-2 weeks**

#### Admin Dashboard Features
- **Order list** with filtering and search
- **Order details** view with customer info
- **Status updates** with email notifications
- **Production tracking** and notes
- **Customer management**
- **Analytics** and reporting

#### Workflow Management
- **Order status pipeline**: Pending → Processing → Production → Shipped → Delivered
- **Automated emails** for status changes
- **Production notes** and internal communication
- **Shipping label** generation
- **Quality control** checkpoints

#### Tasks
- [ ] Create admin-only routes and middleware
- [ ] Build order management interface
- [ ] Implement status update system
- [ ] Add email notification system
- [ ] Create production workflow tools

### Phase 5: Enhanced User Experience 🎨
**Priority: Medium | Timeline: 1 week**

#### User Dashboard
- **Order history** with status tracking
- **Reorder functionality**
- **Download center** for digital files
- **Shipping tracking** integration
- **Support ticket** system

#### Email System
- **Order confirmation** emails
- **Status update** notifications
- **Shipping notifications** with tracking
- **Digital download** delivery
- **Follow-up surveys**

#### Tasks
- [ ] Build comprehensive user dashboard
- [ ] Implement email template system
- [ ] Add reorder functionality
- [ ] Create download management
- [ ] Set up shipping integration

### Phase 6: Advanced Features & Optimization ⚡
**Priority: Low | Timeline: 2 weeks**

#### Advanced eCommerce
- **Bulk orders** and quantity discounts
- **Gift orders** and custom messages
- **Subscription model** for multiple maps
- **Affiliate program** integration
- **Referral system**

#### Performance & Analytics
- **Order analytics** and reporting
- **A/B testing** for conversion optimization
- **Performance monitoring**
- **Customer lifetime value** tracking
- **Inventory management** for materials

#### Tasks
- [ ] Implement advanced pricing models
- [ ] Add analytics and reporting
- [ ] Create affiliate system
- [ ] Build inventory management
- [ ] Optimize performance

## Technical Stack

### Database & Backend
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma or Drizzle
- **Authentication**: NextAuth.js
- **API**: Next.js App Router
- **File Storage**: Supabase Storage

### Payment & Communication
- **Payment Processing**: Stripe
- **Email Service**: Resend or SendGrid
- **SMS**: Twilio (optional)
- **Push Notifications**: OneSignal (optional)

### Frontend Enhancements
- **State Management**: Zustand (already in use)
- **Forms**: React Hook Form + Zod
- **UI Components**: Existing shadcn/ui setup
- **Animations**: Framer Motion (already in use)

## Success Metrics

### Business Metrics
- **Conversion Rate**: % of map creators who purchase
- **Average Order Value**: Revenue per order
- **Customer Lifetime Value**: Total customer value
- **Order Fulfillment Time**: Production to shipping
- **Customer Satisfaction**: Post-purchase surveys

### Technical Metrics
- **Payment Success Rate**: % of successful transactions
- **Page Load Times**: Under 2 seconds
- **API Response Times**: Under 500ms
- **Error Rates**: Under 1%
- **Uptime**: 99.9%+

## Risk Mitigation

### Security
- **PCI DSS compliance** via Stripe
- **Data encryption** at rest and in transit
- **Input validation** and sanitization
- **Rate limiting** on APIs
- **Regular security audits**

### Business Continuity
- **Payment processor backup** (PayPal as fallback)
- **Database backups** and disaster recovery
- **Order export** capabilities
- **Manual fulfillment** processes
- **Customer support** escalation

## Implementation Priority

### Week 1-2: Foundation
1. **Database setup** and schema
2. **Basic API routes**
3. **Stripe integration**
4. **User authentication**

### Week 3-4: Core Features  
1. **Real payment processing**
2. **Order management basics**
3. **User dashboard**
4. **Email notifications**

### Week 5-6: Polish & Admin
1. **Admin dashboard**
2. **Advanced order management**
3. **Analytics setup**
4. **Testing and optimization**

## Next Steps

1. **Review this plan** and prioritize features
2. **Set up development environment** (Supabase, Stripe accounts)
3. **Create database schema** and initial API routes
4. **Replace simulated payment** with real Stripe integration
5. **Build user authentication** system

Would you like me to start with any specific phase or component? 