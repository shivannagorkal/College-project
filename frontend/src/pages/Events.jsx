import { useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { EventCard } from '@/components/shared/EventCard';
import { Spinner } from '@/components/ui/spinner';
import { useFetch } from '@/hooks/useFetch';
import { eventService } from '@/services/eventService';

const mockEvents = [
  {
    id: 1,
    title: 'Annual Sports Day',
    date: '2026-03-15',
    description: 'Grand sports event with various athletic competitions and team activities.',
  },
  {
    id: 2,
    title: 'Science Exhibition',
    date: '2026-02-28',
    description: 'Students showcase innovative science projects and experimental work.',
  },
  {
    id: 3,
    title: 'Cultural Fest',
    date: '2026-04-20',
    description: 'Celebration of diverse cultures with music, dance, and art performances.',
  },
  {
    id: 4,
    title: 'Founders Day',
    date: '2025-12-15',
    description: 'Celebrating college foundation and felicitating achievements.',
  },
  {
    id: 5,
    title: 'Study Tour',
    date: '2025-11-10',
    description: 'Educational field trip to historical and scientific locations.',
  },
];

export function Events() {
  const { data: events, loading } = useFetch(eventService.getEvents);

  const displayEvents = Array.isArray(events) ? events : [];

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = displayEvents.filter((e) => new Date(e.date) >= now);
    const past = displayEvents.filter((e) => new Date(e.date) < now);
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [displayEvents]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader title="Events" page="events" subtitle="Explore college events and activities" />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <>
              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-primary">Upcoming Events</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                      <EventCard key={event.id || event._id} {...event} />
                    ))}
                  </div>
                </section>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6 text-primary">Past Events</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.map((event) => (
                      <EventCard key={event.id || event._id} {...event} />
                    ))}
                  </div>
                </section>
              )}

              {upcomingEvents.length === 0 && pastEvents.length === 0 && (
                <p className="text-center text-gray-500 py-12">No events available</p>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
