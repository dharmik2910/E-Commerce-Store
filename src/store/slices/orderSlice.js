import { createSlice } from '@reduxjs/toolkit';

// Safely parse localStorage order data
const getStoredOrders = () => {
  try {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error parsing stored orders:', error);
    localStorage.removeItem('orders');
    return [];
  }
};

const initialState = {
  orders: getStoredOrders(),
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      const order = {
        id: Date.now().toString(),
        ...action.payload,
        date: new Date().toISOString(),
        status: 'completed',
      };
      state.orders.unshift(order);
      localStorage.setItem('orders', JSON.stringify(state.orders));
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.orders.find((o) => o.id === id);
      if (order) {
        order.status = status;
        localStorage.setItem('orders', JSON.stringify(state.orders));
      }
    },
    clearOrders: (state) => {
      state.orders = [];
      localStorage.removeItem('orders');
    },
  },
});

export const { addOrder, updateOrderStatus, clearOrders } = orderSlice.actions;

export const selectOrders = (state) => state.orders.orders;
export const selectOrderById = (id) => (state) =>
  state.orders.orders.find((order) => order.id === id);

export default orderSlice.reducer;

