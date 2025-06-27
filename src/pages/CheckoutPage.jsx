import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ShoppingCart, Phone, MapPin, User, Mail } from "lucide-react";

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    governorate: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!customerData.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!customerData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!customerData.address.trim()) newErrors.address = "العنوان مطلوب";
    if (!customerData.city.trim()) newErrors.city = "المدينة مطلوبة";
    if (!customerData.governorate.trim())
      newErrors.governorate = "المحافظة مطلوبة";

    // Validate phone number format
    if (
      customerData.phone &&
      !/^01[0-9]{9}$/.test(customerData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone =
        "رقم هاتف غير صحيح (يجب أن يبدأ بـ 01 ويتكون من 11 رقم)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format order message for WhatsApp
  const formatWhatsAppMessage = () => {
    const total = getTotalPrice();

    let message = `🏆 *طلب جديد من Sneakrz King* 🏆\n\n`;

    // Customer Information
    message += `👤 *بيانات العميل:*\n`;
    message += `الاسم: ${customerData.name}\n`;
    message += `الهاتف: ${customerData.phone}\n`;
    if (customerData.email) message += `الإيميل: ${customerData.email}\n`;
    message += `العنوان: ${customerData.address}\n`;
    message += `المدينة: ${customerData.city}\n`;
    message += `المحافظة: ${customerData.governorate}\n`;
    if (customerData.notes) message += `ملاحظات: ${customerData.notes}\n`;

    message += `\n🛍️ *تفاصيل الطلب:*\n`;

    // Cart Items
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   العلامة التجارية: ${item.brand}\n`;
      if (item.selectedSize) message += `   المقاس: ${item.selectedSize}\n`;
      message += `   الكمية: ${item.quantity}\n`;
      message += `   السعر: ${item.price} جنيه\n`;
      message += `   الإجمالي: ${(item.price * item.quantity).toFixed(2)} جنيه\n\n`;
    });

    // Total
    message += `💰 *إجمالي الطلب: ${total.toFixed(2)} جنيه*\n\n`;

    message += `📝 *ملاحظة:* يرجى تأكيد الطلب والتواصل لتحديد طريقة الدفع والتوصيل.\n\n`;
    message += `شكراً لاختياركم Sneakrz King! 👟✨`;

    return encodeURIComponent(message);
  };

  // Handle order submission
  const handleSubmitOrder = () => {
    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      alert("السلة فارغة!");
      return;
    }

    // Format WhatsApp message
    const message = formatWhatsAppMessage();

    // Your WhatsApp business number (replace with your actual number)
    const whatsappNumber = "201023329072"; // Replace with your number

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Open WhatsApp
    window.open(whatsappURL, "_blank");

    // Clear cart after successful order
    clearCart();

    // Show success message and redirect
    alert("تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.");
    navigate("/");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">السلة فارغة</h2>
          <p className="text-gray-600 mb-8">يرجى إضافة منتجات لإتمام الطلب</p>
          <Button onClick={() => navigate("/products")} size="lg">
            تصفح المنتجات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="progress-steps flex items-center justify-center space-x-4 sm:space-x-8 overflow-x-auto px-4">
            <div className="flex items-center flex-shrink-0">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                ✓
              </div>
              <span className="ml-2 font-semibold text-green-600 text-sm sm:text-base whitespace-nowrap">
                SHOPPING CART
              </span>
            </div>
            <div className="w-8 sm:w-16 h-1 bg-blue-600 rounded-full flex-shrink-0"></div>
            <div className="flex items-center flex-shrink-0">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                2
              </div>
              <span className="ml-2 font-semibold text-gray-900 text-sm sm:text-base whitespace-nowrap">
                CHECKOUT
              </span>
            </div>
            <div className="w-8 sm:w-16 h-1 bg-gray-300 rounded-full flex-shrink-0"></div>
            <div className="flex items-center flex-shrink-0">
              <div className="w-10 h-10 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-gray-300">
                3
              </div>
              <span className="ml-2 font-semibold text-gray-700 text-sm sm:text-base whitespace-nowrap">
                ORDER STATUS
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إتمام الطلب</h1>
          <p className="text-gray-600">املأ البيانات لإرسال طلبك عبر واتساب</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                بيانات العميل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم الكامل *</Label>
                <Input
                  id="name"
                  name="name"
                  value={customerData.name}
                  onChange={handleInputChange}
                  placeholder="ادخل اسمك الكامل"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={customerData.phone}
                  onChange={handleInputChange}
                  placeholder="01xxxxxxxxx"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={customerData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <Label htmlFor="governorate">المحافظة *</Label>
                <Input
                  id="governorate"
                  name="governorate"
                  value={customerData.governorate}
                  onChange={handleInputChange}
                  placeholder="القاهرة، الجيزة، الاسكندرية..."
                  className={errors.governorate ? "border-red-500" : ""}
                />
                {errors.governorate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.governorate}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="city">المدينة *</Label>
                <Input
                  id="city"
                  name="city"
                  value={customerData.city}
                  onChange={handleInputChange}
                  placeholder="المدينة أو المنطقة"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address">العنوان التفصيلي *</Label>
                <Input
                  id="address"
                  name="address"
                  value={customerData.address}
                  onChange={handleInputChange}
                  placeholder="الشارع والرقم والعلامات المميزة"
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={customerData.notes}
                  onChange={handleInputChange}
                  placeholder="أي ملاحظات خاصة بالطلب"
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                ملخص الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">{item.brand}</p>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-600">
                          المقاس: {item.selectedSize}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">
                          الكمية: {item.quantity}
                        </span>
                        <span className="font-semibold">
                          {(item.price * item.quantity).toFixed(2)} جنيه
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>الإجمالي:</span>
                    <span>{getTotalPrice().toFixed(2)} جنيه</span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmitOrder}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  إرسال الطلب عبر واتساب
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  سيتم فتح واتساب مع تفاصيل طلبك جاهزة للإرسال
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
