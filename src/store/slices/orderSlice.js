import { createSlice } from '@reduxjs/toolkit';
import { SHIPPING_METHODS } from '../../utils/shippingConstants';

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
      const payload = action.payload;
      const order = {
        id: Date.now().toString(),
        items: payload.items || [],
        subtotal: payload.subtotal || payload.total || 0,
        shipping: payload.shipping || 0,
        shippingMethod: payload.shippingMethod || SHIPPING_METHODS.STANDARD,
        shippingAddress: payload.shippingAddress || null,
        total: payload.total || 0,
        discount: payload.discount || 0,
        date: new Date().toISOString(),
        status: payload.status || 'pending',
        // Additional order metadata
        orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
        estimatedDelivery: payload.estimatedDelivery || null,
        trackingNumber: payload.trackingNumber || null,
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
    updateOrderTracking: (state, action) => {
      const { id, trackingNumber, estimatedDelivery } = action.payload;
      const order = state.orders.find((o) => o.id === id);
      if (order) {
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
        localStorage.setItem('orders', JSON.stringify(state.orders));
      }
    },
    clearOrders: (state) => {
      state.orders = [];
      localStorage.removeItem('orders');
    },
  },
});

export const { addOrder, updateOrderStatus, updateOrderTracking, clearOrders } = orderSlice.actions;

export const selectOrders = (state) => state.orders.orders;
export const selectOrderById = (id) => (state) =>
  state.orders.orders.find((order) => order.id === id);
export const selectOrdersByStatus = (status) => (state) =>
  state.orders.orders.filter((order) => order.status === status);

export default orderSlice.reducer;

