import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import DonateProductDetailsPage from "./components/Online-Store/donate/donateProductDetails/DonateProductDetailsPage";
import CancelPage from "./components/Online-Store/donate/canclePage/CancelPage";
import Navigation from "./components/Layout/navigation/Navigation";
import SuccessPage from "./components/Online-Store/donate/successPage/SuccessPage";
import Footer from "./components/Layout/footer/Footer";
import LoginPage from "./components/users/login/LoginPage";
import UserIndexPage from "./components/users/userIndex/UserIndexPage";
import HomePage from "./components/users/home/HomePage";
import BrandPage from "./components/IMS/brand/BrandPage";
import CategoryPage from "./components/IMS/category/CategoryPage";
import SupplierPage from "./components/IMS/supplier/SupplierPage";
import Layout from "./components/Layout/Layout";
import SalesOrderPage from "./components/CMS/salesOrder/SalesOrder";
import SalesOrderDetailPage from "./components/CMS/salesOrderDetail/SalesOrderDetail";
import ProductPage from "./components/IMS/product/Product";
import ProductAttributePage from "./components/IMS/productAttribute/ProductAttribute";
import InvoicePage from "./components/CMS/invoice/InvoicePage";
import PaymentPage from "./components/CMS/payment/PaymentPage";
import ProductDetailsPage from "./components/Online-Store/ProductDetails/ProductDetails";
import ProductMainPage from "./components/Online-Store/ProductMainPage/ProductMainPage";
import PreOrder from "./components/Online-Store/checkout/PreOrder";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentSuccessPage from "./components/Online-Store/checkout/PaymentSuccessPage";
import PayPalCompletePayment from "./components/Online-Store/checkout/PayPalCompletePayment";
import PayPalReturnPage from "./components/Online-Store/checkout/PayPalReturnPage";
import PaypalTransactionUploader from "./components/MonitorSys/Reconcile/PaypalTransactionUploader";
import ErrorLog from "./components/MonitorSys/PaymentErrorLog/ErrorLog";
import ReconcileWithOrder from "./components/MonitorSys/ReconcileWithOrder/ReconcileWithOrder";
import ReconcilePastDays from "./components/MonitorSys/ReconcilePastDays/ReconcilePastDays";
import ReconcileBetweenDays from "./components/MonitorSys/ReconcileBetweenDays/ReconcileBetweenDays";
import MonthlySalesReport from "./components/MonitorSys/MonthlySalesReport/MonthlySalesReport";
import ReconLayout from "./components/MonitorSys/ReconcileLayout/ReconLayout";
import SupplierInfoPage from "./components/Suppliers/SupplierInfo/SupplierInfo";
import MerchantOnboardingForm from "./components/Suppliers/SupplierReferral/MerchantOnboardingForm";
import SupplierProductPage from "./components/Suppliers/SupplierProduct/SupplierProduct";
import SuppliersLayout from "./components/Suppliers/SuppliersLayout/SuppliersLayout";
import SupplierSalesOrderPage from "./components/Suppliers/SupplierSalesOrder/SupplierSalesOrderPage";
import SuppliersPayPalPayment from "./components/Suppliers/SuppliersPayPalPayment/SuppliersPayPalPayment";
import SuppliersFinance from "./components/Suppliers/SupplierFinance/v1/SuppliersFinance";
import SupplierFinanceLayout from "./components/Suppliers/SupplierFinance/v1/SupplierFinanceLayout/SupplierFinanceLayout";
import SupplierFinanceReport from "./components/Suppliers/SupplierFinance/SupplierFinanceReport/SupplierFinanceReport";
import SupplierLogin from "./components/users/SupplierLogin/SupplierLogin";
import SupplierDashboard from "./components/Suppliers/SupplierDashboard/SupplierDashboard";
import AuthMiddlewarePage from "./components/Suppliers/SupplierJWT/JWTStorage";
import SupplierRegistration from "./components/users/SupplierRegister/SupplierRegister";
import LoginFailure from "./components/users/SupplierLogin/LoginFailure";

import SuppliersLayout2 from "./components/Suppliers/SuppliersLayout2/SuppliersLayout";

import CustomerDashboard from "./components/Customers/CustomerInfo/CustomerDashboard";
import CustomerSalesOrderPage from "./components/Customers/CustomerSalesOrder/CustomerSalesOrderPage";
import CustomerLayout from "./components/Customers/CustomerLayout/CustomerLayout";

import ForumPage from "./components/Online-Store/Forum/ForumPage";

import Chatroom from "./components/Assist/chatroom/Chatroom";
import IntercomChat from "./components/Assist/intercom/IntercomChat";
import HelpPage from "./components/Assist/chatroom/HelpPage";


// Initialize Stripe outside of the component
const stripePromise = loadStripe('pk_test_51O3s0OFiZR4PbrrIwdG0F0rZm8zShUKCvofRtT6VEYFVLL9bJg32JNWj6BTJ49IYJYcMgr269VwlASt7ctPmnatd002qbeH7Bm');

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        {" "}
        {/* <Route path="/chat" element={<Chatroom />} /> */}
        <Route path="/help" element={<HelpPage />} />

        <Route path="/supplierLogin" element={<SupplierLogin />} />
        <Route path="/register" element={<SupplierRegistration />} />
        <Route path="/supplier/midpage" element={<AuthMiddlewarePage />} />
        <Route path="/supplier/profile" element={<SupplierDashboard />} />
        <Route path="/supplier-ims" element={<SuppliersLayout><SupplierInfoPage /></SuppliersLayout>} />
        <Route path="/supplier-ims/products" element={<SuppliersLayout><SupplierProductPage /></SuppliersLayout>} />
        <Route path="/supplier-ims/orders" element={<SuppliersLayout><SupplierSalesOrderPage /></SuppliersLayout>} />
        <Route path="/supplier-ims/payments" element={<SuppliersLayout><SuppliersPayPalPayment /></SuppliersLayout>} />
        <Route path="/supplier-ims/finance/:supplierId" element={<SuppliersLayout><SupplierFinanceReport /></SuppliersLayout>} />

        {/* <Route path="/login-failure" element={LoginFailure} /> */}

        <Route path="/" element={<Navigate replace to="/index" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user" element={<UserIndexPage />} />

        {/* Online Store */}
        <Route path="/index" element={<ProductMainPage />} />
        <Route path="/details/:productId" element={<ProductDetailsPage />} />
        {/* <Route path="/preOrder/:productSkuCode" element={<PreOrder />} /> */}
        <Route path="/preOrder/:productSkuCode" element={
          <Elements stripe={stripePromise}>
            <PreOrder />
          </Elements>
        } />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/paypal-success" element={<PayPalCompletePayment />} />
        <Route path="/paypal-return" element={<PayPalReturnPage />} />

        <Route path="/forum" element={<ForumPage />} />

      </Routes>

      {/* Customer */}
      <Routes>
        {" "}
        <Route path="/customer/info" element={<CustomerLayout><CustomerDashboard /></CustomerLayout>} />
        <Route path="/customer/main" element={<CustomerLayout><CustomerSalesOrderPage /></CustomerLayout>} />
      </Routes>

      {/* IMS */}
      <Routes>
        <Route path="/products" element={<Layout><ProductPage /></Layout>} />
        <Route path="/productAttribute" element={<Layout><ProductAttributePage /></Layout>} />
        <Route path="/brand" element={<Layout><BrandPage /></Layout>} />
        <Route path="/category" element={<Layout><CategoryPage /></Layout>} />
        <Route path="/supplier" element={<Layout><SupplierPage /></Layout>} />
        <Route path="/salesOrders" element={<Layout><SalesOrderPage /></Layout>} />
        <Route path="/salesOrderDetail" element={<Layout><SalesOrderDetailPage /></Layout>} />
        <Route path="/payments" element={<Layout><PaymentPage /></Layout>} />
        <Route path="/invoices" element={<Layout><InvoicePage /></Layout>} />
        {/* <Route path="/supplier-products/:supplierId" element={<Layout><SupplierProductPage /></Layout>} /> */}
      </Routes>

      <Routes>
        {/* Payment Flow - Product Details - Donate*/}
        <Route path="/donate" element={<DonateProductDetailsPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>

      {/* <ReconcileNavigationTabs /> */}

      <Routes>
      <Route path="/reconcile" element={<ReconLayout><PaypalTransactionUploader /></ReconLayout>} />
      <Route path="/reconcile/salesOrderSn" element={<ReconLayout><ReconcileWithOrder /></ReconLayout>} />
      <Route path="/reconcile/pastdays" element={<ReconLayout><ReconcilePastDays /></ReconLayout>} />
      <Route path="/reconcile/between" element={<ReconLayout><ReconcileBetweenDays /></ReconLayout>} />
      <Route path="/reconcile/monthly-sales-report" element={<ReconLayout><MonthlySalesReport /></ReconLayout>} />
      <Route path="/error-logs" element={<ErrorLog />} />
      </Routes>

      <Routes>
        <Route path="/supplier-ims/referral" element={<SuppliersLayout2><MerchantOnboardingForm /></SuppliersLayout2>} />
      </Routes>
      {/* Supplier IMS */}
      {/* <Routes>
      <Route path="/supplier-ims/:productId" element={<SuppliersLayout2><SupplierInfoPage /></SuppliersLayout2>} />
      <Route path="/supplier-ims/referral" element={<SuppliersLayout2><MerchantOnboardingForm /></SuppliersLayout2>} />
      <Route path="/supplier-ims/products/:productId" element={<SuppliersLayout2><SupplierProductPage /></SuppliersLayout2>} />
      <Route path="/supplier-ims/orders/:productId" element={<SuppliersLayout2><SupplierSalesOrderPage /></SuppliersLayout2>} />
      <Route path="/supplier-ims/payments/:productId" element={<SuppliersLayout2><SuppliersPayPalPayment /></SuppliersLayout2>} />
      <Route path="/supplier-ims/finance/:supplierId" element={<SuppliersLayout2><SupplierFinanceReport /></SuppliersLayout2>} />
      </Routes> */}
      {/* <Route path="/supplier-ims/finance/:supplierId/monthly" element={<SuppliersLayout><SupplierFinanceLayout><SuppliersFinance /></SupplierFinanceLayout></SuppliersLayout>} />
      <Route path="/supplier-ims/finance/:supplierId/yearly" element={<SuppliersLayout><SupplierFinanceLayout><SuppliersFinance /></SupplierFinanceLayout></SuppliersLayout>} /> */}
      <Footer />
    </Router>
  );
}

export default App;
