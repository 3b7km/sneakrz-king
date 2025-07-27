import { Minus, Plus, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartItem = ({ item, onUpdateQuantity, onRemove, isLoading }) => {
  const { isAF1Product, getDiscountedPrice } = useCart();

  return (
    <div className="flex items-start space-x-4 p-4 border-b">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium truncate ${
          isAF1Product(item.id) ? "text-pink-600" : "text-gray-900"
        }`}>
          {item.name}
          {isAF1Product(item.id) && (
            <span className="ml-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              AF1 OFFER!
            </span>
          )}
        </h3>
        <p className="text-sm text-gray-600">{item.brand}</p>
        <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
        
        <div className="flex items-center space-x-2 mt-2">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1 || isLoading}
            className="p-1 hover:bg-gray-100 disabled:opacity-50"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="text-right">
        {isAF1Product(item.id) ? (
          <>
            <p className="font-medium text-pink-600">
              {getDiscountedPrice(item) * item.quantity} EGP
            </p>
            <p className="text-sm text-gray-500 line-through">
              {item.price * item.quantity} EGP
            </p>
            <p className="text-xs text-pink-600">15% OFF!</p>
          </>
        ) : (
          <p className="font-medium text-gray-900">
            {item.price * item.quantity} EGP
          </p>
        )}
        <button
          onClick={onRemove}
          disabled={isLoading}
          className="mt-2 p-1 text-red-500 hover:bg-red-50 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
