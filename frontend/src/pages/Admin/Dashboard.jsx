import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Image as ImageIcon, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const statCards = [
  { icon: CalendarDays, label: 'Events', value: '12', href: '/admin/manage-events' },
  { icon: ImageIcon, label: 'Gallery Images', value: '48', href: '/admin/manage-gallery' },
  { icon: Bell, label: 'Announcements', value: '6', href: '/admin/manage-announcements' },
];

const quickActions = [
  { label: 'Site Settings', href: '/admin/site-settings' },
  { label: 'Manage Carousel', href: '/admin/manage-carousel' },
  { label: 'Manage Events', href: '/admin/manage-events' },
  { label: 'Manage Results', href: '/admin/manage-results' },
  { label: 'Manage Toppers', href: '/admin/manage-toppers' },
  { label: 'Manage Gallery', href: '/admin/manage-gallery' },
  { label: 'Manage Faculty', href: '/admin/manage-faculty' },
  { label: 'Manage Announcements', href: '/admin/manage-announcements' },
];

export function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="secondary" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.href} to={stat.href}>
                  <Card className="hover:shadow-lg transition cursor-pointer h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold text-primary">{stat.value}</p>
                        </div>
                        <Icon className="w-8 h-8 text-primary opacity-50" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} to={action.href}>
                <Button variant="outline" className="w-full justify-start">
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <Card>
            <CardHeader>
              <CardTitle>Latest Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'New event created', time: '2 hours ago' },
                  { action: 'Gallery updated with 5 new images', time: '5 hours ago' },
                  { action: 'Result published for 2nd PUC', time: '1 day ago' },
                  { action: 'New announcement posted', time: '2 days ago' },
                  { action: 'Faculty profile updated', time: '3 days ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                    <span className="text-gray-700">{activity.action}</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
