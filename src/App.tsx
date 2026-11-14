import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { Admin } from "./pages/Admin";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const { pathname } = useLocation();

  // The admin area has its own layout, without the shop header and footer.
  if (pathname.startsWith("/admin")) {
    return <Admin />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Navbar onCartClick={() => setCartOpen(true)} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <ScrollToTop />
    </div>
  );
}

export default App;
