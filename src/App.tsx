/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { CategoryProvider } from './context/CategoryContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Delivery } from './pages/Delivery';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { DashboardRouter } from './pages/DashboardRouter';
import { DynamicBackground } from './components/DynamicBackground';
import Contact from './pages/Contact';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CategoryProvider>
          <ProductProvider>
            <OrderProvider>
              <CartProvider>
                <div className="flex flex-col min-h-screen relative bg-gradient-to-br from-[#1c120c] via-[#120a05] to-[#0a0502]">
                <DynamicBackground />
                <Header />
                <main className="flex-1 flex flex-col relative z-10 transition-all duration-300">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/delivery" element={<Delivery />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<DashboardRouter />} />
                  </Routes>
                </main>
                <Footer />
              </div>
              </CartProvider>
            </OrderProvider>
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </Router>
  );
}

