import React, { createContext, useContext, useReducer, useEffect } from "react";

const OrderContext = createContext();

// Order status types
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Order reducer
const orderReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_ORDERS":
      return {
        ...state,
        orders: action.payload,
      };

    case "ADD_ORDER":
      const newOrder = {
        id: `ORD-${Date.now()}`,
        orderNumber: `SK${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        ...action.payload,
        status: ORDER_STATUS.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedOrders = [...state.orders, newOrder];
      localStorage.setItem("sneakrz-orders", JSON.stringify(updatedOrders));

      return {
        ...state,
        orders: updatedOrders,
      };

    case "UPDATE_ORDER_STATUS":
      const statusUpdatedOrders = state.orders.map((order) =>
        order.id === action.payload.orderId
          ? {
              ...order,
              status: action.payload.status,
              updatedAt: new Date().toISOString(),
              deliveryNotes: action.payload.notes || order.deliveryNotes,
            }
          : order,
      );

      localStorage.setItem(
        "sneakrz-orders",
        JSON.stringify(statusUpdatedOrders),
      );

      return {
        ...state,
        orders: statusUpdatedOrders,
      };

    case "ADD_ORDER_NOTE":
      const noteUpdatedOrders = state.orders.map((order) =>
        order.id === action.payload.orderId
          ? {
              ...order,
              adminNotes: [
                ...(order.adminNotes || []),
                {
                  note: action.payload.note,
                  timestamp: new Date().toISOString(),
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : order,
      );

      localStorage.setItem("sneakrz-orders", JSON.stringify(noteUpdatedOrders));

      return {
        ...state,
        orders: noteUpdatedOrders,
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  orders: [],
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("sneakrz-orders");
    if (savedOrders) {
      try {
        const orders = JSON.parse(savedOrders);
        dispatch({ type: "LOAD_ORDERS", payload: orders });
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    }
  }, []);

  // Create new order
  const createOrder = (orderData) => {
    dispatch({ type: "ADD_ORDER", payload: orderData });
  };

  // Update order status
  const updateOrderStatus = (orderId, status, notes = "") => {
    dispatch({
      type: "UPDATE_ORDER_STATUS",
      payload: { orderId, status, notes },
    });
  };

  // Add admin note to order
  const addOrderNote = (orderId, note) => {
    dispatch({
      type: "ADD_ORDER_NOTE",
      payload: { orderId, note },
    });
  };

  // Get order by ID
  const getOrderById = (orderId) => {
    return state.orders.find((order) => order.id === orderId);
  };

  // Get orders by status
  const getOrdersByStatus = (status) => {
    return state.orders.filter((order) => order.status === status);
  };

  // Get customer orders
  const getCustomerOrders = (customerPhone) => {
    return state.orders.filter(
      (order) => order.customerInfo?.phone === customerPhone,
    );
  };

  // Get order statistics
  const getOrderStats = () => {
    const total = state.orders.length;
    const statusCounts = Object.values(ORDER_STATUS).reduce((acc, status) => {
      acc[status] = state.orders.filter(
        (order) => order.status === status,
      ).length;
      return acc;
    }, {});

    const totalRevenue = state.orders
      .filter((order) => order.status !== ORDER_STATUS.CANCELLED)
      .reduce((sum, order) => sum + (order.total || 0), 0);

    return {
      total,
      statusCounts,
      totalRevenue,
    };
  };

  const value = {
    orders: state.orders,
    createOrder,
    updateOrderStatus,
    addOrderNote,
    getOrderById,
    getOrdersByStatus,
    getCustomerOrders,
    getOrderStats,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
