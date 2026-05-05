import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementTicker } from '@/components/shared/AnnouncementTicker';
import { TopperCard } from '@/components/shared/TopperCard';
import { PageCarousel } from '@/components/shared/PageCarousel';
import { Bell, Calendar } from 'lucide-react';
import { siteSettingsService } from '@/services/siteSettingsService';
import { announcementService } from '@/services/announcementService';
import { topperService } from '@/services/topperService';
import { eventService } from '@/services/eventService';
import { formatDate } from '@/utils/formatDate';

export function Home() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [toppers, setToppers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, a, t, e] = await Promise.all([
          siteSettingsService.getSettings(),
          announcementService.getAnnouncements(),
          topperService.getToppers({ topperType: 'Board' }),
          eventService.getEvents(),
        ]);
        setSettings(s || {});
        setAnnouncements(Array.isArray(a) ? a.slice(0, 4) : []);

        const latestYear = Math.max(...(t || []).map(tp => tp.year || 0));
        const latestToppers = (t || [])
          .filter(tp => tp.year === latestYear)
          .slice(0, 4);
        setToppers(latestToppers);

        setEvents(Array.isArray(e) ? e.slice(0, 3) : []);
      } catch (err) {
        console.error('Error fetching home data:', err);
        setSettings({});
        setAnnouncements([]);
        setToppers([]);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const yearsOfExcellence = settings.foundedYear
    ? new Date().getFullYear() - settings.foundedYear
    : 10;

  const announcementTitles = announcements.map(a => a.title || a.description || '');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero with Carousel */}
      <PageCarousel page="home" height="600px">
        <div className="text-left text-white px-5 max-w-4xl">
          <div className="flex items-center gap-1 w-fit bg-white/5 backdrop-blur border border-white/30 px-4 py-1 rounded-full mb-6">
            <div className='bg-primary/10 rounded-full p-1 mr-2 inline-block border border-primary/10'>
              <div className='bg-primary rounded-full p-1 border border-primary/50 animate-ping animate-reverse'>
              </div>
            </div>
            <p className="text-sm font-semibold text-white">
              {announcementTitles[1] || "Admission open for 2025-26" }
            </p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4"> Welcome to 
            <span className="text-primary/80"> {settings.collegeName || 'AKRDevi PU College'} </span>
          </h1>
          <p className="text-xl md:text-2xl mb-6 font-light">
            {settings.tagline || 'Quality Education in Science & Commerce Streams'}
          </p>
          {settings.aboutParagraph && (
            <p className="text-base md:text-lg mb-8 opacity-90 max-h-20 overflow-hidden">
              {settings.aboutParagraph}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-x-10 justify-center mb-8">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/results')}
              className="text-base hover:bg-primary hover:text-white transition-colors"
            >
              View Results →
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/about')}
              className="text-base border-white text-black hover:text-white hover:bg-primary/10 transition-colors"
            >
              About College
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-sm md:text-base">
            <div>
              <p className="text-xl md:text-2xl font-bold">{settings.studentsCount}</p>
              <p className="opacity-75">Students</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">{settings.facultyCount}</p>
              <p className="opacity-75">Faculty</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">{yearsOfExcellence}+</p>
              <p className="opacity-75">Years</p>
            </div>
          </div>
        </div>
      </PageCarousel>
      {/* Announcement Ticker */}
      {announcementTitles.length > 0 && (
        <AnnouncementTicker announcements={announcementTitles} />
      )}

      {/* Latest Updates */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Latest Updates</h2>
            <p className="text-gray-600">Highlights & Announcements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {announcements.length > 0 ? (
              announcements.map((announcement, idx) => (
                <div
                  key={announcement._id || idx}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-2 mt-1 shrink-0">
                      <Bell className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                        {announcement.title || 'Announcement'}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {announcement.description || ''}
                      </p>
                      <p className="text-xs text-primary mt-2">
                        {formatDate(announcement.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No announcements at the moment
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Academic Excellence */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Academic Excellence</h2>
            <p className="text-gray-600">Star Performers</p>
            <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
              Our students consistently achieve outstanding results in board examinations and competitive entrance tests.
            </p>
          </div>

          {toppers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {toppers.map((topper) => (
                  <TopperCard key={topper._id} topper={topper} />
                ))}
              </div>
              <div className="text-center">
                <Button variant="outline" onClick={() => navigate('/results')}>
                  View All Results
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Topper information will be updated after results
            </div>
          )}
        </div>
      </section>

      {/* What's Happening */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">What's Happening</h2>
            <p className="text-gray-600">Upcoming Events</p>
            <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
              Stay updated with the latest events and activities at {settings.collegeName || 'AKRDevi PU College'}.
            </p>
          </div>

          {events.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <div className="h-48 w-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Calendar className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Button onClick={() => navigate('/events')}>
                  View All Events
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No upcoming events at the moment
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
