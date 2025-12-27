import { createSlice } from '@reduxjs/toolkit';

// Safely parse localStorage wishlist data
const getStoredWishlist = () => {
  try {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error parsing stored wishlist:', error);
    localStorage.removeItem('wishlist');
    return [];
  }
};

const initialState = {
  items: getStoredWishlist(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      
      if (!existingItem) {
        state.items.push(action.payload);
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsInWishlist = (id) => (state) =>
  state.wishlist.items.some((item) => item.id === id);

export default wishlistSlice.reducer;

