import { createSlice } from '@reduxjs/toolkit';

// Safely parse localStorage cart data
const getStoredCart = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error parsing stored cart:', error);
    localStorage.removeItem('cart');
    return [];
  }
};

// Safely parse localStorage saved for later data
const getStoredSavedForLater = () => {
  try {
    const saved = localStorage.getItem('savedForLater');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error parsing stored saved for later:', error);
    localStorage.removeItem('savedForLater');
    return [];
  }
};

const initialState = {
  items: getStoredCart(),
  savedForLater: getStoredSavedForLater(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
    saveForLater: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        // Remove from cart
        state.items = state.items.filter((item) => item.id !== action.payload);
        // Add to saved for later (without quantity, as it's saved)
        const savedItem = { ...item };
        delete savedItem.quantity;
        state.savedForLater.push(savedItem);
        localStorage.setItem('cart', JSON.stringify(state.items));
        localStorage.setItem('savedForLater', JSON.stringify(state.savedForLater));
      }
    },
    moveToCart: (state, action) => {
      const item = state.savedForLater.find((item) => item.id === action.payload);
      if (item) {
        // Remove from saved for later
        state.savedForLater = state.savedForLater.filter((item) => item.id !== action.payload);
        // Add to cart with quantity 1
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({ ...item, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(state.items));
        localStorage.setItem('savedForLater', JSON.stringify(state.savedForLater));
      }
    },
    removeFromSavedForLater: (state, action) => {
      state.savedForLater = state.savedForLater.filter((item) => item.id !== action.payload);
      localStorage.setItem('savedForLater', JSON.stringify(state.savedForLater));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, saveForLater, moveToCart, removeFromSavedForLater } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => {
  return state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};
export const selectCartCount = (state) => {
  return state.cart.items.reduce((count, item) => count + item.quantity, 0);
};
export const selectSavedForLater = (state) => state.cart.savedForLater;

export default cartSlice.reducer;

