/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/utils/customerStorage.js */

const STORAGE_KEY = 'bags_beyond_customer';
const ORDERS_KEY = 'bags_beyond_orders';

/**
 * Save customer data to localStorage for PWA prefilling
 * @param {Object} customerData - { email, name, phone, shippingAddress }
 */
export function saveCustomerData(customerData) {
  try {
    const existing = getCustomerData();
    const updated = {
      ...existing,
      ...customerData,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Failed to save customer data:', error);
    return false;
  }
}

/**
 * Get customer data from localStorage
 * @returns {Object|null}
 */
export function getCustomerData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get customer data:', error);
    return null;
  }
}

/**
 * Check if customer has saved data
 * @returns {boolean}
 */
export function hasCustomerData() {
  return !!getCustomerData();
}

/**
 * Clear customer data from localStorage
 */
export function clearCustomerData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear customer data:', error);
    return false;
  }
}

/**
 * Save an order to localStorage for guest order tracking
 * @param {Object} order - Order details
 */
export function saveOrder(order) {
  try {
    const existing = getOrders();
    const newOrder = {
      ...order,
      id: order.id || `ORD-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newOrder, ...existing];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return newOrder;
  } catch (error) {
    console.error('Failed to save order:', error);
    return null;
  }
}

/**
 * Get all orders from localStorage
 * @returns {Array}
 */
export function getOrders() {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get orders:', error);
    return [];
  }
}

/**
 * Get orders by email
 * @param {string} email
 * @returns {Array}
 */
export function getOrdersByEmail(email) {
  const orders = getOrders();
  return orders.filter(order => 
    order.customerEmail?.toLowerCase() === email.toLowerCase()
  );
}

/**
 * Get a single order by ID
 * @param {string} orderId
 * @returns {Object|null}
 */
export function getOrderById(orderId) {
  const orders = getOrders();
  return orders.find(order => order.id === orderId) || null;
}

/**
 * Update order status
 * @param {string} orderId
 * @param {string} status
 */
export function updateOrderStatus(orderId, status) {
  try {
    const orders = getOrders();
    const updated = orders.map(order => 
      order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
    );
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Failed to update order:', error);
    return false;
  }
}

/**
 * Clear all orders (use with caution)
 */
export function clearAllOrders() {
  try {
    localStorage.removeItem(ORDERS_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear orders:', error);
    return false;
  }
}
