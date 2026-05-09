import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard, UserCheck, LogOut, Bell, MessageSquare,
  Gift, FileText, Search, X, Menu, ChevronUp,
  Image as ImageIcon, CalendarDays, Megaphone,
  GraduationCap, Trophy, Share2, Settings,
  PanelRightClose,
  PanelRightIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// ── Nav config ────────────────────────────────────────────
const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',     href: '/admin' },
  { icon: CalendarDays,    label: 'Events',        href: '/admin/manage-events' },
  { icon: ImageIcon,       label: 'Gallery',       href: '/admin/manage-gallery' },
  { icon: Megaphone,       label: 'Announcements', href: '/admin/manage-announcements' },
  { icon: GraduationCap,   label: 'Toppers',       href: '/admin/manage-toppers' },
  { icon: Trophy,          label: 'Results',       href: '/admin/manage-results' },
  { icon: UserCheck,       label: 'Faculty',       href: '/admin/manage-faculty' },
  { icon: Share2,          label: 'Carousel',      href: '/admin/manage-carousel' },
  { icon: Settings,        label: 'Settings',      href: '/admin/site-settings' },
];

// ── SidebarInner ──────────────────────────────────────────
// Fully self-contained: manages its own avatarOpen + avatarRef
// so it works correctly whether rendered in desktop or mobile drawer.
function SidebarInner({ collapsed, location, onLinkClick, onLogout }) {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef   = useRef(null);

  // Close popup on outside click
  useEffect(() => {
    function onMouseDown(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const handleLogoutClick = () => {
    setAvatarOpen(false);
    onLogout();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Brand ── */}
      <div className={`flex items-center gap-3 px-4 pt-6 pb-3 shrink-0
        ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shadow shrink-0">
          <span className="text-lg">🎓</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-bold text-white text-sm leading-tight whitespace-nowrap">My College</p>
            <p className="text-purple-200 text-xs whitespace-nowrap">Admin Panel</p>
          </div>
        )}
      </div>

      {/* ── Nav links ── */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1 overflow-y-auto py-1">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active =
            location.pathname === href ||
            (href !== '/admin' && location.pathname.startsWith(href));
          return (
            <Link
              key={label}
              to={href}
              title={collapsed ? label : undefined}
              onClick={onLinkClick}
              className={`flex items-center gap-3 rounded-xl text-sm font-semibold transition-all
                ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                ${active
                  ? 'bg-white text-primary shadow'
                  : 'text-purple-100 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Avatar + popup ── */}
      <div ref={avatarRef} className="relative mx-3 mb-5 shrink-0">

        {/* Popup — floats above avatar button */}
        {avatarOpen && (
          <div className="absolute bottom-full mb-2 left-0 right-0
            bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[999]">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-bold text-gray-800 text-sm">Admin</p>
              <p className="text-xs text-gray-400">Ass. Admin</p>
            </div>
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 w-full px-4 py-3
                text-red-500 hover:bg-red-50 font-semibold text-sm transition-colors text-left"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Logout
            </button>
          </div>
        )}

        {/* Avatar trigger */}
        <button
          onClick={() => setAvatarOpen(o => !o)}
          title={collapsed ? 'Admin' : undefined}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all
            hover:bg-white/10 active:bg-white/20
            ${avatarOpen ? 'bg-white/15' : ''}
            ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 to-indigo-400
            flex items-center justify-center text-white font-bold text-sm shadow shrink-0">
            A
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-white font-bold text-xs leading-tight truncate">Admin</p>
                <p className="text-purple-200 text-[10px] truncate">Ass. Admin</p>
              </div>
              <ChevronUp
                className={`w-4 h-4 text-purple-200 shrink-0 transition-transform duration-200
                  ${avatarOpen ? '' : 'rotate-180'}`}
              />
            </>
          )}
        </button>
      </div>

    </div>
  );
}

// ── AdminLayout ───────────────────────────────────────────
export function AdminLayout() {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  const [desktopOpen, setDesktopOpen] = useState(true);
  const [drawerOpen,  setDrawerOpen]  = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div
      className="flex h-screen bg-[#f4f6fb] overflow-hidden"
      style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}
    >

      {/* ── Mobile backdrop ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile slide-in drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-52 bg-primary/90 rounded-r-lg shadow-2xl
          transition-transform duration-300 lg:hidden
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          onClick={() => setDrawerOpen(false)}
          className="absolute top-8 right-3 text-white hover:text-white z-50"
        >
          <PanelRightIcon className="w-6 h-6" />
        </button>
        {/* Own instance — own avatarOpen state + avatarRef */}
        <SidebarInner
          collapsed={false}
          location={location}
          onLinkClick={() => setDrawerOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden lg:block bg-primary rounded-r-lg shadow-xl relative z-10
          overflow-hidden shrink-0 transition-all duration-300
          ${desktopOpen ? 'w-52' : 'w-[60px]'}`}
      >
        <div className="absolute -bottom-14 -left-8 w-40 h-40 rounded-full
          bg-[#9b59f5] opacity-20 blur-2xl pointer-events-none" />
        {/* Own instance — own avatarOpen state + avatarRef */}
        <SidebarInner
          collapsed={!desktopOpen}
          location={location}
          onLinkClick={undefined}
          onLogout={handleLogout}
        />
      </aside>

      {/* ── Right side ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Header ── */}
        <header className="flex items-center gap-3 px-4 sm:px-5 py-3 bg-white shadow-sm shrink-0">

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Desktop collapse */}
          <button
            onClick={() => setDesktopOpen(o => !o)}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg
              bg-primary text-white font-bold text-sm shadow hover:text-black hover:bg-secondary transition"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden xl:inline">Menu</span>
          </button>

          {/* Search */}
          <div className="flex items-center gap-2 flex-1 max-w-xs bg-gray-100 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search item..."
              className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder-gray-400"
            />
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}