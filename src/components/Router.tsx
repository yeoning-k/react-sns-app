import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from 'pages';
import SignUpPage from 'pages/auth/signup';
import LoginPage from 'pages/auth/login';
import ProfilePage from 'pages/profile';
import ProfileEditPage from 'pages/profile/edit';
import SearchPage from 'pages/search';
import NotificationsPage from 'pages/notifications';
import PostDetailPage from 'pages/posts/detail';
import PostEditPage from 'pages/posts/edit';
import PostWritePage from 'pages/posts/write';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/signup" element={<SignUpPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<ProfileEditPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
      <Route path="/posts/:id/edit" element={<PostEditPage />} />
      <Route path="/posts/write" element={<PostWritePage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

export default Router;
