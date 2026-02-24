import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/layout';
import {
  HomePage,
  ProductsPage,
  ProductDetailPage,
  LoginPage,
  SignUpPage,
  MyAccountPage,
  BoardPage,
  BoardDetailPage,
  CheckoutPage,
  OrderSuccessPage,
} from '@/pages';
import { OAuthCallbackPage } from '@/pages/OAuthCallbackPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/account" element={<MyAccountPage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/board/:postId" element={<BoardDetailPage />} />
            <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders/:orderId" element={<OrderSuccessPage />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
