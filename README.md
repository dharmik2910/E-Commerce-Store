# E-Commerce Application

A modern, full-featured e-commerce application built with React, Redux Toolkit, and Material-UI.
Live: https://e-commerce-store-vite.vercel.app

## Features

### Authentication & Security
- **User Authentication**: Secure login system with JWT token storage using DummyJSON API
- **Protected Routes**: Route protection ensures only authenticated users can access the application
- **Session Persistence**: JWT tokens and user data stored in localStorage for persistent sessions
- **Auto-redirect**: Automatic redirect to login page for unauthenticated users

### Product Browsing
- **Product Catalog**: Browse all available products with beautiful card-based layout
- **Product Search**: Real-time product search functionality
- **Category Filtering**: Filter products by category with dynamic category loading
- **Product Sorting**: Sort products by price (low to high, high to low) and name (A-Z, Z-A)
- **Pagination**: Navigate through products with pagination controls
- **Product Detail Page**: Detailed product view with:
  - Product description and specifications
  - Price and rating display
  - Product reviews and ratings
  - Add product reviews functionality
  - Similar product recommendations

### Shopping Cart
- **Add to Cart**: Add products to cart from product listing or detail page
- **Cart Management**: 
  - Update product quantities
  - Remove items from cart
  - Save items for later
  - Move saved items back to cart
- **Real-time Cart Count**: Cart item count displayed in navigation bar badge
- **Cart Persistence**: Cart items saved in localStorage and restored on page reload
- **Cart Total Calculation**: Automatic calculation of subtotal and total price

### Checkout & Orders
- **Checkout Page**: Complete checkout process with:
  - Cart items display with images and details
  - Quantity adjustment and item removal
  - Shipping address form with validation
  - Order summary with total price
  - Save for later functionality
- **Order Placement**: Create and save orders with order details
- **Order History**: View all past orders with:
  - Order status (pending, completed, shipped, cancelled)
  - Order date and time
  - Total amount
  - Order status indicators with color coding
- **Order Details**: Detailed view of individual orders with:
  - Complete order information
  - All ordered items
  - Shipping address
  - Order status and tracking

### Wishlist
- **Add to Wishlist**: Save favorite products to wishlist
- **Wishlist Management**: 
  - View all wishlist items
  - Remove items from wishlist
  - Add wishlist items directly to cart
  - Sort wishlist items
- **Wishlist Count**: Wishlist item count displayed in navigation bar
- **Wishlist Persistence**: Wishlist items saved in localStorage

### User Experience
- **Responsive Design**: Fully responsive design that works on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful, modern interface built with Material-UI components
- **Loading States**: Loading indicators for better user feedback
- **Error Handling**: Comprehensive error handling with user-friendly error messages
- **Smooth Navigation**: Smooth page transitions and route navigation
- **Search & Filter Chips**: Visual indicators for active search queries and category filters

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Navigation and routing
- **Material-UI (MUI)** - Component library
- **Axios** - HTTP client for API calls

## API Integration

This application uses the [DummyJSON API](https://dummyjson.com/):
- Authentication: `https://dummyjson.com/auth/login`
- Products: `https://dummyjson.com/products`
- Categories: `https://dummyjson.com/products/categories`

## Installation

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
│       └── wishlistSlice.js # Wishlist state
├── services/               # API services
│   └── api.js              # API client and functions
├── utils/                  # Utility functions
│   └── currency.js         # Currency formatting utilities
├── App.jsx                 # Main app component with routing
└── main.jsx                # Application entry point
```

## Usage

### Authentication
- Use any valid credentials from the DummyJSON API
- JWT token is stored in localStorage upon successful login
- Protected routes require authentication

### Shopping Flow
1. **Login**: Use DummyJSON credentials to login (e.g., username: `emilys`, password: `emilyspass`)
2. **Browse Products**: 
   - View all products on the home page
   - Use search bar to find specific products
   - Filter by category using the dropdown
   - Sort products by price or name
   - Navigate through pages using pagination
3. **Product Details**: Click on any product to view:
   - Full product information
   - Product reviews and ratings
   - Similar product recommendations
   - Add to cart or wishlist
4. **Add to Cart**: 
   - Click "Add to Cart" button on any product
   - View cart count in the navigation bar badge
5. **Wishlist**: 
   - Click heart icon to add products to wishlist
   - View wishlist from navigation bar
   - Add wishlist items to cart
6. **Checkout**: 
   - Click cart icon in navigation to go to checkout
   - Review cart items
   - Adjust quantities or remove items
   - Save items for later if needed
   - Fill shipping address form
   - Place order to complete purchase
7. **Order Management**:
   - View order history from navigation
   - Click on any order to view details
   - Track order status


### Data Persistence
- **Authentication**: JWT tokens and user data stored in localStorage
- **Cart**: Cart items and saved-for-later items persisted in localStorage
- **Wishlist**: Wishlist items saved in localStorage
- **Orders**: Order history stored in localStorage
- **State Restoration**: All state automatically restored on page reload


### Important Notes

- ✅ This app uses external API (DummyJSON), so no backend needed
- ✅ All routing is configured for SPA (Single Page Application)
- ✅ State persistence via localStorage (cart, wishlist, orders, auth)
- ✅ Fully responsive design for all screen sizes



