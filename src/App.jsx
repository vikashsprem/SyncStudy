import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ShoppingCard from "./components/ShoppingCard";
import BookList from "./components/BookList";
import UserAccount from "./components/UserAccount";
import LoginComponent from "./authComponent/LoginComponent";
import RegisterationComponent from "./authComponent/RegisterationComponent";
import AuthProvider, { useAuth } from "./security/AuthContext";
import UploadBook from "./components/UploadBook";
import "./App.css";
import HomePage from "./components/HomePage";
import Layout from "./components/Layout";
import GroupChat from "./components/DiscussionRoom";
import Marketplace from "./components/Marketplace";
import MarketplaceItemDetail from "./components/MarketplaceItemDetail";
import OrganizationManagement from "./components/OrganizationManagement";

function AuthenticatedRoute({ children }) {
  const authContext = useAuth();
  if (authContext.isAuthenticated) return children;
  return <Navigate to='/auth/login' />;
}

function AdminRoute({ children }) {
  const authContext = useAuth();
  if (authContext.isAuthenticated && authContext.isAdmin) return children;
  return <Navigate to='/auth/login' />;
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route
              path='/admin/organizations'
              element={
                <AdminRoute>
                  <OrganizationManagement />
                </AdminRoute>
              }
            />
            <Route
              path='/book/upload'
              element={
                <AuthenticatedRoute>
                  <UploadBook />
                </AuthenticatedRoute>
              }
            />
            <Route
              path='/home'
              element={
                <AuthenticatedRoute>
                  <HomePage />
                </AuthenticatedRoute>
              }
            />
            <Route path='/register' element={<RegisterationComponent />} />
            <Route path='/auth/login' element={<LoginComponent />} />
            <Route
              path='/chat'
              element={
                <AuthenticatedRoute>
                  <GroupChat />
                </AuthenticatedRoute>
              }
            />
            <Route
              path='/market-place'
              element={
                <AuthenticatedRoute>
                  <Marketplace />
                </AuthenticatedRoute>
              }
            />
            <Route
              path='/market-place/:itemId'
              element={
                <AuthenticatedRoute>
                  <MarketplaceItemDetail />
                </AuthenticatedRoute>
              }
            />

            <Route
              path='/'
              element={
                <AuthenticatedRoute>
                  <BookList />
                </AuthenticatedRoute>
              }
            />
            <Route
              path='/user'
              element={
                <AuthenticatedRoute>
                  <UserAccount />
                </AuthenticatedRoute>
              }
            />
            <Route
              path='/books'
              element={
                <AuthenticatedRoute>
                  <BookList />
                </AuthenticatedRoute>
              }
            />
            <Route
              path='/books/:id'
              element={
                <AuthenticatedRoute>
                  <ShoppingCard />
                </AuthenticatedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
