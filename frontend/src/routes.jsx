import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Public Pages
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Academics } from '@/pages/Academics';
import { Results } from '@/pages/Results';
import { Toppers } from '@/pages/Toppers';
import { Events } from '@/pages/Events';
import { Gallery } from '@/pages/Gallery';
import { Faculty } from '@/pages/Faculty';
import { Admissions } from '@/pages/Admissions';
import { Announcements } from '@/pages/Announcements';
import { History } from '@/pages/History';
import { Contact } from '@/pages/Contact';

// Admin Pages
import { AdminLogin } from '@/pages/Admin/Login';
import { AdminDashboard } from '@/pages/Admin/Dashboard';
import { ManageEvents } from '@/pages/Admin/ManageEvents';
import { ManageResults } from '@/pages/Admin/ManageResults';
import { ManageGallery } from '@/pages/Admin/ManageGallery';
import { ManageToppers } from '@/pages/Admin/ManageToppers';
import { ManageFaculty } from '@/pages/Admin/ManageFaculty';
import { ManageAnnouncements } from '@/pages/Admin/ManageAnnouncements';
import { SiteSettings } from '@/pages/Admin/SiteSettings';
import { ManageCarousel } from '@/pages/Admin/ManageCarousel';

export const router = createBrowserRouter([
  // Public routes
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/academics', element: <Academics /> },
  { path: '/results', element: <Results /> },
  { path: '/toppers', element: <Toppers /> },
  { path: '/events', element: <Events /> },
  { path: '/gallery', element: <Gallery /> },
  { path: '/faculty', element: <Faculty /> },
  { path: '/admissions', element: <Admissions /> },
  { path: '/announcements', element: <Announcements /> },
  { path: '/history', element: <History /> },
  { path: '/contact', element: <Contact /> },

  // Admin routes
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/manage-events',
    element: (
      <ProtectedRoute>
        <ManageEvents />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/manage-results',
    element: (
      <ProtectedRoute>
        <ManageResults />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/manage-gallery',
    element: (
      <ProtectedRoute>
        <ManageGallery />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/manage-toppers',
    element: (
      <ProtectedRoute>
        <ManageToppers />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/manage-faculty',
    element: (
      <ProtectedRoute>
        <ManageFaculty />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/manage-announcements',
    element: (
      <ProtectedRoute>
        <ManageAnnouncements />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/site-settings',
    element: (
      <ProtectedRoute>
        <SiteSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/manage-carousel',
    element: (
      <ProtectedRoute>
        <ManageCarousel />
      </ProtectedRoute>
    ),
  },
]);
