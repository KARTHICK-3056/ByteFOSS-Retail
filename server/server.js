const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Product = require('./models/Product');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
const AuditLog = require('./models/AuditLog');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

let isMockDB = false;

// --- MOCK DATA ---
const now = new Date();
const formatDate = (date) => date.toISOString().replace('T', ' ').slice(0, 19);

let mockProducts = [
  { _id: 'p1', id: 'p1', name: 'Premium Coffee', price: 12.99, stock: 12, tax: 5, category: 'Beverages', createdAt: new Date(now - 86400000 * 5) },
  { _id: 'p2', id: 'p2', name: 'Wireless Mouse', price: 25.50, stock: 8, tax: 10, category: 'Electronics', createdAt: new Date(now - 86400000 * 4) },
  { _id: 'p3', id: 'p3', name: 'Notebook', price: 4.99, stock: 150, tax: 0, category: 'Stationery', createdAt: new Date(now - 86400000 * 3) },
  { _id: 'p4', id: 'p4', name: 'USB-C Cable', price: 9.99, stock: 45, tax: 5, category: 'Electronics', createdAt: new Date(now - 86400000 * 2) },
  { _id: 'p5', id: 'p5', name: 'Green Tea', price: 6.50, stock: 22, tax: 5, category: 'Beverages', createdAt: new Date(now - 86400000 * 1) },
  { _id: 'p6', id: 'p6', name: 'Chocolate Bar', price: 2.50, stock: 80, tax: 8, category: 'Snacks', createdAt: new Date(now - 86400000 * 1) },
  { _id: 'p7', id: 'p7', name: 'Energy Drink', price: 3.50, stock: 15, tax: 5, category: 'Beverages', createdAt: new Date(now) }
];

let mockCustomers = [
  { _id: 'c1', id: 'c1', f: 'John', l: 'Doe', e: 'john@example.com', p: '1234567890', points: 450, createdAt: new Date(now - 86400000 * 15) },
  { _id: 'c2', id: 'c2', f: 'Jane', l: 'Smith', e: 'jane@example.com', p: '0987654321', points: 820, createdAt: new Date(now - 86400000 * 12) },
  { _id: 'c3', id: 'c3', f: 'Alice', l: 'Brown', e: 'alice@example.com', p: '5551234567', points: 120, createdAt: new Date(now - 86400000 * 10) },
  { _id: 'c4', id: 'c4', f: 'Bob', l: 'Wilson', e: 'bob@example.com', p: '5559876543', points: 340, createdAt: new Date(now - 86400000 * 5) },
  { _id: 'c5', id: 'c5', f: 'Charlie', l: 'Davis', e: 'charlie@example.com', p: '5550001111', points: 50, createdAt: new Date(now - 86400000 * 2) }
];

let mockOrders = [
  { _id: 'o1', id: 'o1', customerId: 'c1', customerName: 'John Doe', items: [{ id: 'p1', name: 'Premium Coffee', qty: 2, price: 12.99 }], total: 27.28, subtotal: 25.98, tax: 1.30, createdAt: new Date(now - 86400000 * 4), date: formatDate(new Date(now - 86400000 * 4)) },
  { _id: 'o2', id: 'o2', customerId: 'c2', customerName: 'Jane Smith', items: [{ id: 'p2', name: 'Wireless Mouse', qty: 1, price: 25.50 }], total: 28.05, subtotal: 25.50, tax: 2.55, createdAt: new Date(now - 86400000 * 3), date: formatDate(new Date(now - 86400000 * 3)) },
  { _id: 'o3', id: 'o3', customerId: 'c1', customerName: 'John Doe', items: [{ id: 'p3', name: 'Notebook', qty: 5, price: 4.99 }], total: 24.95, subtotal: 24.95, tax: 0, createdAt: new Date(now - 86400000 * 2), date: formatDate(new Date(now - 86400000 * 2)) },
  { _id: 'o4', id: 'o4', customerId: 'c3', customerName: 'Alice Brown', items: [{ id: 'p4', name: 'USB-C Cable', qty: 2, price: 9.99 }, { id: 'p6', name: 'Chocolate Bar', qty: 4, price: 2.50 }], total: 32.48, subtotal: 29.98, tax: 2.50, createdAt: new Date(now - 86400000 * 1), date: formatDate(new Date(now - 86400000 * 1)) },
  { _id: 'o5', id: 'o5', customerId: 'c2', customerName: 'Jane Smith', items: [{ id: 'p5', name: 'Green Tea', qty: 3, price: 6.50 }], total: 20.48, subtotal: 19.50, tax: 0.98, createdAt: new Date(now), date: formatDate(new Date()) }
];

let mockLogs = [
  { _id: 'l1', id: 'l1', time: formatDate(new Date(now - 3600000 * 8)), productName: 'Premium Coffee', oldStock: 0, newStock: 50, action: 'Restock', createdAt: new Date(now - 3600000 * 8) },
  { _id: 'l2', id: 'l2', time: formatDate(new Date(now - 3600000 * 6)), productName: 'Wireless Mouse', oldStock: 5, newStock: 20, action: 'Restock', createdAt: new Date(now - 3600000 * 6) },
  { _id: 'l3', id: 'l3', time: formatDate(new Date(now - 3600000 * 4)), productName: 'Notebook', oldStock: 100, newStock: 150, action: 'Restock', createdAt: new Date(now - 3600000 * 4) },
  { _id: 'l4', id: 'l4', time: formatDate(new Date(now - 3600000 * 2)), productName: 'USB-C Cable', oldStock: 10, newStock: 45, action: 'Restock', createdAt: new Date(now - 3600000 * 2) },
  { _id: 'l5', id: 'l5', time: formatDate(new Date(now - 3600000 * 1)), productName: 'Green Tea', oldStock: 5, newStock: 25, action: 'Restock', createdAt: new Date(now - 3600000 * 1) }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
      console.error('MongoDB Connection Error:', err.message);
      console.log('Falling back to mock database mode.');
      isMockDB = true;
  });

// --- API ROUTES ---

// Products
app.get('/api/products', async (req, res) => {
  if (isMockDB) return res.json(mockProducts);
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  if (isMockDB) {
      const newProduct = { ...req.body, _id: Date.now().toString(), id: Date.now().toString(), createdAt: new Date() };
      mockProducts.push(newProduct);
      return res.status(201).json(newProduct);
  }
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  if (isMockDB) {
      mockProducts = mockProducts.map(p => p.id === req.params.id ? { ...p, ...req.body } : p);
      return res.json(mockProducts.find(p => p.id === req.params.id));
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  if (isMockDB) {
      mockProducts = mockProducts.filter(p => p.id !== req.params.id);
      return res.json({ message: 'Product deleted' });
  }
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Customers
app.get('/api/customers', async (req, res) => {
  if (isMockDB) return res.json(mockCustomers);
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/customers', async (req, res) => {
  if (isMockDB) {
      const newCustomer = { ...req.body, _id: Date.now().toString(), id: Date.now().toString(), createdAt: new Date(), points: 0 };
      mockCustomers.push(newCustomer);
      return res.status(201).json(newCustomer);
  }
  try {
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  if (isMockDB) {
      mockCustomers = mockCustomers.map(c => c.id === req.params.id ? { ...c, ...req.body } : c);
      return res.json(mockCustomers.find(c => c.id === req.params.id));
  }
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  if (isMockDB) {
      mockCustomers = mockCustomers.filter(c => c.id !== req.params.id);
      return res.json({ message: 'Customer deleted' });
  }
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Orders
app.get('/api/orders', async (req, res) => {
  if (isMockDB) return res.json(mockOrders);
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  if (isMockDB) {
      const newOrder = { ...req.body, _id: Date.now().toString(), id: Date.now().toString(), createdAt: new Date(), date: formatDate(new Date()) };
      mockOrders.push(newOrder);
      
      for (const item of req.body.items || []) {
          mockProducts = mockProducts.map(p => p.id === item.id ? { ...p, stock: p.stock - item.qty } : p);
      }
      
      if (req.body.customerId) {
          const pointsEarned = Math.floor(req.body.total / 100);
          mockCustomers = mockCustomers.map(c => c.id === req.body.customerId ? { ...c, points: (c.points || 0) + pointsEarned } : c);
      }
      return res.status(201).json(newOrder);
  }
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    
    for (const item of req.body.items) {
      await Product.findByIdAndUpdate(item.id, { $inc: { stock: -item.qty } });
    }
    
    if (req.body.customerId) {
        const pointsEarned = Math.floor(req.body.total / 100);
        await Customer.findByIdAndUpdate(req.body.customerId, { 
            $inc: { o: 1, points: pointsEarned } 
        });
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Audit Logs
app.get('/api/audit-logs', async (req, res) => {
  if (isMockDB) return res.json(mockLogs);
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/audit-logs', async (req, res) => {
  if (isMockDB) {
      const newLog = { ...req.body, _id: Date.now().toString(), id: Date.now().toString(), createdAt: new Date(), time: formatDate(new Date()) };
      mockLogs.push(newLog);
      return res.status(201).json(newLog);
  }
  try {
    const newLog = new AuditLog(req.body);
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
