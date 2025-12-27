# E-Commerce Application

A modern, full-featured e-commerce application built with React, Redux Toolkit, and Material-UI.

## Features

- **User Authentication**: Secure login system with JWT token storage
- **Product Catalog**: Browse products with category filtering and pagination
- **Shopping Cart**: Add products to cart with real-time count display
- **Checkout**: Complete checkout process with cart summary and total calculation
- **Responsive Design**: Modern UI built with Material-UI components

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
├── components/          # React components
│   ├── Navbar.jsx      # Navigation bar with cart count
│   ├── Login.jsx       # Login page
│   ├── Home.jsx        # Product listing page
│   ├── Checkout.jsx    # Checkout page
│   └── ProtectedRoute.jsx  # Route protection component
├── store/              # Redux store configuration
│   ├── store.js        # Store setup
│   └── slices/         # Redux slices
│       ├── authSlice.js    # Authentication state
│       └── cartSlice.js    # Shopping cart state
├── services/           # API services
│   └── api.js          # API client and functions
├── App.jsx             # Main app component with routing
└── main.jsx            # Application entry point
```

## Usage

### Authentication
- Use any valid credentials from the DummyJSON API
- JWT token is stored in localStorage upon successful login
- Protected routes require authentication

### Shopping
1. Browse products on the home page
2. Filter by category using the dropdown
3. Navigate through pages using pagination
4. Click "Add to Cart" to add products
5. View cart count in the navigation bar
6. Click the cart icon to go to checkout
7. Adjust quantities or remove items in checkout
8. Place order to complete purchase

## Implementation Details

### State Management
- **Redux Toolkit** is used for centralized state management
- **Auth Slice**: Manages user authentication state and JWT tokens
- **Cart Slice**: Handles shopping cart operations with localStorage persistence

### Routing
- Protected routes ensure only authenticated users can access the application
- Automatic redirect to login page for unauthenticated users

### Data Persistence
- JWT tokens stored in localStorage
- Cart items persisted in localStorage
- State restored on page reload

## Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Challenges and Solutions

1. **State Persistence**: Implemented localStorage integration in Redux slices to persist cart and auth state across page reloads.

2. **API Integration**: Created a centralized API service to handle all API calls with proper error handling.

3. **Protected Routes**: Implemented a ProtectedRoute component to secure routes and redirect unauthenticated users.

4. **Cart Management**: Used Redux Toolkit for efficient cart state management with quantity updates and item removal.

5. **UI/UX**: Leveraged Material-UI for a professional, responsive design with proper loading states and error handling.

## Future Improvements

- Add product search functionality
- Implement user profile page
- Add order history
- Integrate payment gateway
- Add product reviews and ratings
- Implement wishlist functionality
- Add product detail page
- Enhance error handling and user feedback

## License

This project is created for assessment purposes.
