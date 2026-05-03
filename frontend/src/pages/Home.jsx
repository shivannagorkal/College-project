import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementTicker } from '@/components/shared/AnnouncementTicker';
import { EventCard } from '@/components/shared/EventCard';
import { TopperCard } from '@/components/shared/TopperCard';
import { Users, Award, TrendingUp, BookOpen } from 'lucide-react';
import { COLLEGE_NAME, COLLEGE_FOUNDED } from '@/utils/constants';

const announcements = [
  'Admissions open for 2024-25 academic year',
  'Annual sports day on March 15th, 2026',
  'Results published for 2nd PUC January exam',
  'Parent-teacher meeting scheduled for March 1st',
  'Admissions open for 2024-25 academic year',
  'Annual sports day on March 15th, 2026',
  'Results published for 2nd PUC January exam',
  'Parent-teacher meeting scheduled for March 1st',
];

const stats = [
  { icon: BookOpen, label: 'Founded', value: COLLEGE_FOUNDED },
  { icon: Users, label: 'Students', value: '2000+' },
  { icon: Award, label: 'Faculty', value: '80+' },
  { icon: TrendingUp, label: 'Pass %', value: '92%' },
];

const recentEvents = [
  {
    id: 1,
    title: 'Annual Sports Day',
    date: '2026-03-15',
    description: 'Grand sports event featuring various athletic competitions and team events.',
  },
  {
    id: 2,
    title: 'Science Exhibition',
    date: '2026-02-28',
    description: 'Students showcase innovative science projects and experiments.',
  },
  {
    id: 3,
    title: 'Founders Day Celebration',
    date: '2026-04-10',
    description: 'Celebrating the foundation and achievements of AKRDevi PU College.',
  },
];

const recentToppers = [
  { id: 1, name: 'Rahul Kumar', rank: 1, stream: 'Science', group: 'PCMB', percentage: 99.2, topperType: 'Board', year: 2025 },
  { id: 2, name: 'Priya Singh', rank: 2, stream: 'Science', group: 'PCMC', percentage: 98.5, topperType: 'Board', year: 2025 },
  { id: 3, name: 'Arjun Sharma', rank: 3, stream: 'Commerce', group: 'Commerce', percentage: 97.8, topperType: 'Board', year: 2025 },
];

export function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{COLLEGE_NAME}</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Quality Education in Science & Commerce Streams
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/admissions">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary">
                Apply Now
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Announcement Ticker */}
      <AnnouncementTicker announcements={announcements} />

      {/* Stats Section */}
      <section className="py-12 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6 text-center">
                    <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Events */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Latest Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {recentEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/events">
              <Button variant="outline">View All Events</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Toppers Highlight */}
      <section className="py-12 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Hall of Fame</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {recentToppers.map((topper) => (
              <TopperCard key={topper.id} topper={topper} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/toppers">
              <Button variant="outline">See All Toppers</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>About AKRDevi PU College</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                AKRDevi PU College, founded in {COLLEGE_FOUNDED}, is one of the top educational institutions
                in Koppala district. We are committed to providing quality education in Science and Commerce streams
                with a focus on holistic development of students. Our experienced faculty and modern infrastructure
                ensure an excellent learning environment.
              </p>
              <p className="text-gray-700">
                With a consistent pass rate of over 90%, we have produced many toppers and meritorious students.
                We believe in nurturing talent and building character for a better tomorrow.
              </p>
              <Link to="/about">
                <Button>Read More About Us</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
