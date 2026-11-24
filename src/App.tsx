import { Route, Routes } from 'react-router-dom';
import { ScrollManager } from './lib/ScrollManager';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Product from './pages/Product';
import Sell from './pages/Sell';

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/equipamentos" element={<Marketplace />} />
        <Route path="/produto/:id" element={<Product />} />
        <Route path="/vender" element={<Sell />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
