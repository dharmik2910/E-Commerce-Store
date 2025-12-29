# 🛒 E-Commerce Application

A modern, full-featured **E-Commerce Web Application** built using **React, Redux Toolkit, and Material-UI** with a clean UI, smooth user experience, and complete shopping flow.

🌐 **Live Demo:** https://e-commerce-store-vite.vercel.app

---

## ✨ Features

### 🔐 Authentication & Security
- Secure user authentication using **DummyJSON API**
- JWT token-based login
- Protected routes for authenticated users only
- Session persistence using `localStorage`
- Auto-redirect to login for unauthenticated access

---

### 🛍️ Product Browsing
- **Product Catalog**: Browse all available products with beautiful card-based layout
- **Product Search**: Real-time product search functionality
- **Category Filtering**: Filter products by category with dynamic category loading
- **Product Sorting**: Sort products by price (low to high, high to low) and name (A-Z, Z-A)
- **Pagination**: Navigate through products with pagination controls
- **Product Detail Page**: Detailed product view with:
  - Product description and organized specifications
  - Structured product details (physical, technical, features)
  - Price and rating display
  - Product reviews and ratings
  - Add product reviews functionality
  - Similar product recommendations
  - Shipping, warranty, and return policy information

---

### 🛒 Shopping Cart
- Add products from listing or detail page
- Update quantities and remove items
- Save items for later
- Move saved items back to cart
- Real-time cart count in navigation bar
- Cart persistence using `localStorage`
- Automatic subtotal and total price calculation

---

### 🚚 Checkout & Orders
- **Checkout Page**: Complete checkout process with:
  - Cart items display with images and details
  - Quantity adjustment and item removal
  - Shipping address form with comprehensive validation
  - Order summary with total price
  - Save for later functionality
- **Order Placement**: Create and save orders with structured order details
- **Order History**: View all past orders with:
  - Order status (pending, completed, shipped, cancelled)
  - Order status indicators with color coding
  - Order date & time
  - Total amount
- **Order Details**: Detailed view of individual orders with:
  - Complete order information
  - All ordered items
  - Formatted shipping address
  - Order status and tracking information
- **Shipping Management**: 
  - Structured shipping address validation
  - Shipping method selection support
  - Shipping cost calculation utilities

---

### ❤️ Wishlist
- Add and remove wishlist items
- Move wishlist items directly to cart
- Sort wishlist items
- Wishlist count in navigation bar
- Wishlist persistence using `localStorage`

---

### 🎨 User Experience
- Fully responsive design (desktop, tablet, mobile)
- Modern UI built with **Material-UI**
- Loading indicators for better feedback
- User-friendly error handling
- Smooth navigation and routing
- Visual chips for active search & filters

---

## 🧰 Tech Stack
- **React 19** – UI library
- **Vite** – Build tool & dev server
- **Redux Toolkit** – State management
- **React Router** – Routing & navigation
- **Material-UI (MUI)** – UI components
- **Axios** – API communication

---

## 🌐 API Integration
This project uses the **DummyJSON API**:

- Authentication: https://dummyjson.com/auth/login  
- Products: https://dummyjson.com/products  
- Categories: https://dummyjson.com/products/categories  

---

## ⚙️ Installation & Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/              # React components
│   ├── Navbar.jsx          # Navigation bar with cart & wishlist count
│   ├── Login.jsx           # Login page with authentication
│   ├── Home.jsx            # Product listing with filters & pagination
│   ├── ProductDetail.jsx   # Product detail page with reviews
│   ├── Checkout.jsx        # Checkout page with order placement
│   ├── OrderHistory.jsx    # Order history listing
│   ├── OrderDetails.jsx    # Individual order details
│   ├── Wishlist.jsx        # Wishlist management
│   └── ProtectedRoute.jsx  # Route protection component
├── store/                  # Redux store configuration
│   ├── store.js            # Store setup
│   └── slices/             # Redux slices
│       ├── authSlice.js    # Authentication state
│       ├── cartSlice.js    # Shopping cart state
│       ├── orderSlice.js   # Order management state
│       ├── productSlice.js # Product state management
│       ├── productSelectors.js # Product state selectors
│       └── wishlistSlice.js # Wishlist state
├── services/               # API services
│   └── api.js              # API client and functions
├── utils/                  # Utility functions
│   ├── currency.js         # Currency formatting utilities
│   ├── productConstants.js # Product-related constants and helpers
│   ├── productDetails.js   # Product details structure and utilities
│   └── shippingConstants.js # Shipping-related constants and utilities
├── App.jsx                 # Main app component with routing
└── main.jsx                # Application entry point
```

## 🚀 Usage

### 🔐 Authentication
- Use any valid credentials from the DummyJSON API  
- JWT token is stored in `localStorage` after successful login  
- Protected routes require authentication  

---

### 🛍️ Shopping Flow

#### Login
- Login using DummyJSON credentials  
- Example:  
  - **Username:** emilys  
  - **Password:** emilyspass  

#### Browse Products
- View all products on the home page  
- Search products using the search bar  
- Filter products by category using dropdown  
- Sort products by price or name  
- Navigate using pagination  

#### Product Details
- Click on a product to view:
  - Full product information  
  - Reviews and ratings  
  - Similar product recommendations  
- Add product to cart or wishlist  

#### Add to Cart
- Click **Add to Cart** on any product  
- View updated cart count in navbar badge  

#### Wishlist
- Click heart icon to add products to wishlist  
- View wishlist from navigation bar  
- Add wishlist items directly to cart  

#### Checkout
- Click cart icon to open checkout page  
- Review cart items  
- Update quantities or remove items  
- Save items for later  
- Fill shipping address form  
- Place order to complete purchase  

#### Order Management
- View order history from navigation  
- Click an order to view full details  
- Track order status  

---

## 💾 Data Persistence
- **Authentication:** JWT token & user data stored in `localStorage`  
- **Cart:** Cart and saved-for-later items persisted  
- **Wishlist:** Wishlist items saved  
- **Orders:** Order history stored  
- **State Restoration:** All data restored on page reload  

---

## ℹ️ Important Notes
- ✅ Uses external API (**DummyJSON**) — no backend required  
- ✅ SPA routing configuration  
- ✅ State persistence via `localStorage`  
- ✅ Fully responsive across all devices  
