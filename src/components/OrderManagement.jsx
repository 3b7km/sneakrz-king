import React, { useState } from "react";
import { useOrders, ORDER_STATUS } from "../context/OrderContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  X,
  Search,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  MessageSquare,
} from "lucide-react";

const OrderManagement = () => {
  const { orders, updateOrderStatus, addOrderNote, getOrderStats } =
    useOrders();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newNote, setNewNote] = useState("");

  const stats = getOrderStats();

  // Get status icon and color
  const getStatusInfo = (status) => {
    const statusConfig = {
      [ORDER_STATUS.PENDING]: {
        icon: Clock,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pending",
      },
      [ORDER_STATUS.CONFIRMED]: {
        icon: CheckCircle,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Confirmed",
      },
      [ORDER_STATUS.PREPARING]: {
        icon: Package,
        color: "bg-purple-100 text-purple-800 border-purple-200",
        label: "Preparing",
      },
      [ORDER_STATUS.SHIPPED]: {
        icon: Truck,
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        label: "Shipped",
      },
      [ORDER_STATUS.DELIVERED]: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Delivered",
      },
      [ORDER_STATUS.CANCELLED]: {
        icon: X,
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Cancelled",
      },
    };
    return statusConfig[status] || statusConfig[ORDER_STATUS.PENDING];
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchTerm ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.phone?.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle status update
  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  // Handle adding note
  const handleAddNote = () => {
    if (newNote.trim() && selectedOrder) {
      addOrderNote(selectedOrder.id, newNote.trim());
      setNewNote("");
      // Refresh selected order
      const updatedOrder = orders.find((o) => o.id === selectedOrder.id);
      setSelectedOrder(updatedOrder);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.statusCounts[ORDER_STATUS.PENDING] || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.statusCounts[ORDER_STATUS.DELIVERED] || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRevenue.toFixed(2)} EGP
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order number, customer name, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          {Object.values(ORDER_STATUS).map((status) => {
            const statusInfo = getStatusInfo(status);
            return (
              <option key={status} value={status}>
                {statusInfo.label}
              </option>
            );
          })}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {filteredOrders.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No orders found
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div
                      key={order.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedOrder?.id === order.id
                          ? "bg-blue-50 border-blue-200"
                          : ""
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            #{order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {order.customerInfo?.name}
                          </p>
                        </div>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {order.total?.toFixed(2)} EGP
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedOrder ? (
              <div className="space-y-6">
                {/* Order Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">
                      #{selectedOrder.orderNumber}
                    </h3>
                    <p className="text-gray-600">
                      Created:{" "}
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {selectedOrder.total?.toFixed(2)} EGP
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Customer Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedOrder.customerInfo?.name}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedOrder.customerInfo?.phone}
                    </p>
                    {selectedOrder.customerInfo?.email && (
                      <p>
                        <strong>Email:</strong>{" "}
                        {selectedOrder.customerInfo?.email}
                      </p>
                    )}
                    <p className="flex items-start">
                      <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>
                        {selectedOrder.customerInfo?.address},{" "}
                        {selectedOrder.customerInfo?.city},{" "}
                        {selectedOrder.customerInfo?.governorate}
                      </span>
                    </p>
                    {selectedOrder.customerInfo?.notes && (
                      <p>
                        <strong>Notes:</strong>{" "}
                        {selectedOrder.customerInfo?.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Size: {item.selectedSize} | Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold">
                          {(item.price * item.quantity).toFixed(2)} EGP
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <Label htmlFor="status-select">Update Status</Label>
                  <div className="flex gap-2 mt-2">
                    <select
                      id="status-select"
                      value={selectedOrder.status}
                      onChange={(e) =>
                        handleStatusUpdate(selectedOrder.id, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.values(ORDER_STATUS).map((status) => {
                        const statusInfo = getStatusInfo(status);
                        return (
                          <option key={status} value={status}>
                            {statusInfo.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Admin Notes
                  </h4>

                  {/* Existing Notes */}
                  {selectedOrder.adminNotes &&
                    selectedOrder.adminNotes.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {selectedOrder.adminNotes.map((note, index) => (
                          <div
                            key={index}
                            className="bg-blue-50 p-3 rounded border-l-4 border-blue-400"
                          >
                            <p className="text-sm">{note.note}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(note.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Add New Note */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add admin note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddNote()}
                    />
                    <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select an order to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderManagement;
