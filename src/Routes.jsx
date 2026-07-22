import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AboutContact from './pages/about-contact';
import SubscriptionManagement from './pages/subscription-management';
import Homepage from './pages/homepage';
import Feed from './pages/feed/Feed';
import PostPreview from './pages/preview/PostPreview';
import Editor from './pages/editor/Editor';
import Discover from './pages/discover/Discover';
import BookmarksPreview from './pages/preview/BookmarksPreview';
import ProfilePreview from './pages/preview/ProfilePreview';
import Profile from './pages/profile/Profile';
import SubscribeEmbed from './pages/embed/SubscribeEmbed';
import PostDetail from './pages/post/PostDetail';
import Bookmarks from './pages/bookmarks/Bookmarks';

import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Onboarding from './pages/onboarding/Onboarding';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        <Route path="/" element={<Homepage />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/feed" element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } />
        
        {/* Auth & Onboarding */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        
        {/* We only require auth for onboarding, but not onboarding itself */}
        <Route path="/onboarding" element={
          <ProtectedRoute requireOnboarding={false}>
            <Onboarding />
          </ProtectedRoute>
        } />
        
        <Route path="/about-contact" element={<AboutContact />} />
        <Route path="/subscription-management" element={<SubscriptionManagement />} />
        <Route path="/homepage" element={<Homepage />} />
        
        {/* Preview Screens - we can optionally protect these if needed, but for now leave public or partially protected */}

        <Route path="/preview/post" element={<PostPreview />} />
        
        <Route path="/write" element={
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        } />
        <Route path="/write/:postId" element={
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        } />
        
        <Route path="/@:username" element={<Profile />} />
        <Route path="/post/:slug" element={<PostDetail />} />
        <Route path="/embed/:username" element={<SubscribeEmbed />} />
        
        <Route path="/bookmarks" element={
          <ProtectedRoute>
            <Bookmarks />
          </ProtectedRoute>
        } />
        
        <Route path="/preview/bookmarks" element={
          <ProtectedRoute>
            <BookmarksPreview />
          </ProtectedRoute>
        } />
        
        <Route path="/preview/profile" element={<ProfilePreview />} />
        
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
