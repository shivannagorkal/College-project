import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Public Pages
import { Home }          from '@/pages/Home';
import { About }         from '@/pages/About';
import { Academics }     from '@/pages/Academics';
import { Results }       from '@/pages/Results';
import { Toppers }       from '@/pages/Toppers';
import { Events }        from '@/pages/Events';
import { Gallery }       from '@/pages/Gallery';
import { Faculty }       from '@/pages/Faculty';
import { Admissions }    from '@/pages/Admissions';
import { Announcements } from '@/pages/Announcements';
import { History }       from '@/pages/History';
import { Contact }       from '@/pages/Contact';

// Admin Pages
import { AdminLogin }          from '@/pages/Admin/Login';
import { AdminLayout }         from '@/pages/Admin/AdminLayout';       // ← new shell
import { AdminDashboard }      from '@/pages/Admin/Dashboard';
import { ManageEvents }        from '@/pages/Admin/ManageEvents';
import { ManageResults }       from '@/pages/Admin/ManageResults';
import { ManageGallery }       from '@/pages/Admin/ManageGallery';
import { ManageToppers }       from '@/pages/Admin/ManageToppers';
import { ManageFaculty }       from '@/pages/Admin/ManageFaculty';
import { ManageAnnouncements } from '@/pages/Admin/ManageAnnouncements';
import { SiteSettings }        from '@/pages/Admin/SiteSettings';
import { ManageCarousel }      from '@/pages/Admin/ManageCarousel';

export const router = createBrowserRouter([

  // ── Public routes ──────────────────────────────────────
  { path: '/',              element: <Home /> },
  { path: '/about',         element: <About /> },
  { path: '/academics',     element: <Academics /> },
  { path: '/results',       element: <Results /> },
  { path: '/toppers',       element: <Toppers /> },
  { path: '/events',        element: <Events /> },
  { path: '/gallery',       element: <Gallery /> },
  { path: '/faculty',       element: <Faculty /> },
  { path: '/admissions',    element: <Admissions /> },
  { path: '/announcements', element: <Announcements /> },
  { path: '/history',       element: <History /> },
  { path: '/contact',       element: <Contact /> },

  // ── Admin login (public) ───────────────────────────────
  { path: '/admin/login', element: <AdminLogin /> },

  // ── Admin shell ────────────────────────────────────────
  // ProtectedRoute wraps AdminLayout once — all children are
  // automatically protected. AdminLayout renders the sidebar +
  // header + <Outlet /> where each child page renders.
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,                  element: <AdminDashboard /> },       // /admin
      { path: 'dashboard',            element: <AdminDashboard /> },       // /admin/dashboard
      { path: 'manage-events',        element: <ManageEvents /> },
      { path: 'manage-results',       element: <ManageResults /> },
      { path: 'manage-gallery',       element: <ManageGallery /> },
      { path: 'manage-toppers',       element: <ManageToppers /> },
      { path: 'manage-faculty',       element: <ManageFaculty /> },
      { path: 'manage-announcements', element: <ManageAnnouncements /> },
      { path: 'site-settings',        element: <SiteSettings /> },
      { path: 'manage-carousel',      element: <ManageCarousel /> },
    ],
  },

]);