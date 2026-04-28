import { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  products: [],
  customers: [],
  orders: [],
  auditLogs: [],
  adminProfile: JSON.parse(localStorage.getItem('pos_admin_profile')) || {
    name: 'Admin User',
    email: 'admin@example.com',
    password: ''
  },
  settings: JSON.parse(localStorage.getItem('pos_settings')) || {
    siteName: 'ByteFOSS Retail',
    email: 'admin@example.com',
    description: 'This is an awesome site!',
    currency: 'Rs.'
  },
  loading: true
};

const GlobalContext = createContext();

const API_URL = 'http://localhost:5000/api';

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        ...action.payload,
        loading: false
      };
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p._id === action.payload._id ? action.payload : p)
      };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p._id !== action.payload) };
    case 'ADD_CUSTOMER':
      return { ...state, customers: [action.payload, ...state.customers] };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(c => c._id === action.payload._id ? action.payload : c)
      };
    case 'DELETE_CUSTOMER':
      return { ...state, customers: state.customers.filter(c => c._id !== action.payload) };
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders]
      };
    case 'SET_AUDIT_LOGS':
      return { ...state, auditLogs: action.payload };
    case 'UPDATE_SETTINGS':
      localStorage.setItem('pos_settings', JSON.stringify(action.payload));
      return { ...state, settings: action.payload };
    case 'UPDATE_PROFILE':
      localStorage.setItem('pos_admin_profile', JSON.stringify(action.payload));
      return { ...state, adminProfile: action.payload };
    default:
      return state;
  }
};

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = async () => {
    try {
      const [prodRes, custRes, orderRes, logRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/customers`),
        fetch(`${API_URL}/orders`),
        fetch(`${API_URL}/audit-logs`)
      ]);

      const productsData = await prodRes.json();
      const customersData = await custRes.json();
      const ordersData = await orderRes.json();
      const auditLogsData = await logRes.json();

      // Map _id to id for frontend compatibility
      const products = productsData.map(p => ({ ...p, id: p._id }));
      const customers = customersData.map(c => ({ ...c, id: c._id }));
      const orders = ordersData.map(o => ({ ...o, id: o._id }));
      const auditLogs = auditLogsData.map(l => ({ ...l, id: l._id }));

      dispatch({
        type: 'SET_DATA',
        payload: { products, customers, orders, auditLogs }
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Migration: Update site name if it's the old placeholder
    if (state.settings.siteName === 'My Laravel App' || state.settings.siteName === 'Retail POS') {
      const updatedSettings = { ...state.settings, siteName: 'ByteFOSS Retail' };
      dispatch({ type: 'UPDATE_SETTINGS', payload: updatedSettings });
    }
  }, []);

  const addProduct = async (product) => {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, date: new Date().toISOString() })
    });
    const data = await res.json();
    dispatch({ type: 'ADD_PRODUCT', payload: { ...data, id: data._id } });
  };

  const updateProduct = async (product) => {
    const res = await fetch(`${API_URL}/products/${product._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    dispatch({ type: 'UPDATE_PRODUCT', payload: { ...data, id: data._id } });
  };

  const deleteProduct = async (id) => {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
  };

  const restockProduct = async (id, quantity) => {
    const product = state.products.find(p => p._id === id);
    if (!product) return;
    
    const updatedStock = product.stock + quantity;
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: updatedStock })
    });
    const data = await res.json();
    
    // Log it
    await fetch(`${API_URL}/audit-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            time: new Date().toISOString(),
            productName: product.name,
            oldStock: product.stock,
            newStock: updatedStock,
            action: 'Restock'
        })
    });
    
    dispatch({ type: 'UPDATE_PRODUCT', payload: { ...data, id: data._id } });
    fetchData(); // Refresh logs
  };

  const addCustomer = async (customer) => {
    const res = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...customer, date: new Date().toISOString() })
    });
    const data = await res.json();
    dispatch({ type: 'ADD_CUSTOMER', payload: { ...data, id: data._id } });
  };

  const updateCustomer = async (customer) => {
    const res = await fetch(`${API_URL}/customers/${customer._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });
    const data = await res.json();
    dispatch({ type: 'UPDATE_CUSTOMER', payload: { ...data, id: data._id } });
  };

  const deleteCustomer = async (id) => {
    await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE' });
    dispatch({ type: 'DELETE_CUSTOMER', payload: id });
  };

  const addOrder = async (order) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...order, date: new Date().toISOString() })
    });
    const data = await res.json();
    dispatch({ type: 'ADD_ORDER', payload: { ...data, id: data._id } });
    fetchData(); // Refresh everything to sync stock and points
  };

  const deleteOrder = async (id) => {
    // Optional: implement delete order in backend
    dispatch({ type: 'DELETE_ORDER', payload: id });
  };

  return (
    <GlobalContext.Provider value={{
      ...state,
      dispatch,
      addProduct,
      updateProduct,
      deleteProduct,
      restockProduct,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addOrder,
      deleteOrder,
      updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
      updateProfile: (profile) => dispatch({ type: 'UPDATE_PROFILE', payload: profile })
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
