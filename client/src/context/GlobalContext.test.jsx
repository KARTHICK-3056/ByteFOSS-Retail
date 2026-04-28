import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { GlobalProvider, useGlobalContext } from './GlobalContext';
import React from 'react';

// Wrap the hook for testing context
const wrapper = ({ children }) => <GlobalProvider>{children}</GlobalProvider>;

describe('GlobalContext Logic', () => {
  beforeEach(() => {
    // Clear localStorage before each test to start fresh
    localStorage.clear();
  });

  it('calculates points correctly and deducts stock on ADD_ORDER', () => {
    const { result } = renderHook(() => useGlobalContext(), { wrapper });

    const initialCustomer = result.current.customers[0];
    const initialProduct = result.current.products[0];

    expect(initialCustomer.points).toBe(125);
    expect(initialProduct.stock).toBe(11);

    // Act: Place an order
    act(() => {
      result.current.addOrder({
        customerId: initialCustomer.id,
        items: [{ id: initialProduct.id, qty: 5, price: 100 }],
        total: 500 // 500 / 100 = 5 points
      });
    });

    const updatedCustomer = result.current.customers.find(c => c.id === initialCustomer.id);
    const updatedProduct = result.current.products.find(p => p.id === initialProduct.id);

    // Assert Points (125 + 5 = 130)
    expect(updatedCustomer.points).toBe(130);
    expect(updatedCustomer.o).toBe(initialCustomer.o + 1);

    // Assert Stock Deduction (11 - 5 = 6)
    expect(updatedProduct.stock).toBe(6);

    // Assert Audit Log was created
    expect(result.current.auditLogs[0].action).toBe('Checkout');
    expect(result.current.auditLogs[0].newStock).toBe(6);
  });

  it('handles RESTOCK_PRODUCT and creates an audit log', () => {
    const { result } = renderHook(() => useGlobalContext(), { wrapper });
    const initialProduct = result.current.products[0];

    act(() => {
      // Add 20 items
      result.current.restockProduct(initialProduct.id, 20);
    });

    const updatedProduct = result.current.products.find(p => p.id === initialProduct.id);

    // Assert stock update
    expect(updatedProduct.stock).toBe(initialProduct.stock + 20);

    // Assert Audit Log
    expect(result.current.auditLogs[0].action).toBe('Restock');
    expect(result.current.auditLogs[0].newStock).toBe(initialProduct.stock + 20);
  });
});
