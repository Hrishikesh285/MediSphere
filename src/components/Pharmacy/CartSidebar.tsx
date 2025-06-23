import { useEffect } from 'react';
import { useMedication } from '../../hooks/useMedication';
import { X, Trash, ShoppingCart, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { cart, removeFromCart, clearCart } = useMedication();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  const handleCheckout = () => {
    alert('Processing checkout...');
    clearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black"
            onClick={onClose}
          ></motion.div>
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-white shadow-xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-primary-600" />
                  <h2 className="ml-2 text-lg font-medium text-gray-900">Your Cart</h2>
                  {cart.items.length > 0 && (
                    <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-800">
                      {cart.items.length} items
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {cart.items.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {cart.items.map((item) => (
                      <li key={item.medicationId} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <p className="text-base font-medium text-gray-900">
                              ${(item.quantity * item.price).toFixed(2)}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.medicationId)}
                              className="ml-4 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <ShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
                    <p className="mt-1 text-center text-sm text-gray-500">
                      Add medications to your cart to place an order
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-4 inline-flex items-center rounded-md bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100"
                    >
                      Continue shopping
                    </button>
                  </div>
                )}
              </div>
              
              {cart.items.length > 0 && (
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium text-gray-900">Subtotal</p>
                    <p className="text-base font-medium text-gray-900">${cart.total.toFixed(2)}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Shipping</p>
                    <p className="text-sm text-gray-500">Free</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Tax</p>
                    <p className="text-sm text-gray-500">${(cart.total * 0.07).toFixed(2)}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                    <p className="text-lg font-bold text-gray-900">Total</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${(cart.total + (cart.total * 0.07)).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={handleCheckout}
                      className="btn-primary flex w-full items-center justify-center"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={clearCart}
                      className="btn-outline flex w-full items-center justify-center"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Clear Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
