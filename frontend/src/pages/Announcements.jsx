import { formatDate } from '@/utils/formatDate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui/spinner';
import { useFetch } from '@/hooks/useFetch';
import { announcementService } from '@/services/announcementService';
import { Download, Calendar } from 'lucide-react';

const mockAnnouncements = [
  {
    id: 1,
    title: 'Admissions Open for 2024-25',
    description: 'Online applications for PUC admissions are now open. Apply now to secure your seat.',
    date: '2026-02-15',
    file: '/files/admissions-notice.pdf',
  },
  {
    id: 2,
    title: 'Results Announced - 2nd PUC January Exam',
    description: 'Results for the January PUC examinations are now available on the college portal.',
    date: '2026-02-10',
    file: '/files/results-2026.pdf',
  },
  {
    id: 3,
    title: 'Annual Sports Day Postponed',
    description: 'The annual sports day has been rescheduled to March 20th due to weather conditions.',
    date: '2026-02-08',
  },
  {
    id: 4,
    title: 'Parent-Teacher Meeting',
    description: 'All parents are requested to attend the PTM scheduled for March 5th, 2026.',
    date: '2026-01-30',
    file: '/files/ptm-notice.pdf',
  },
  {
    id: 5,
    title: 'Holiday Notification',
    description: 'College will remain closed on March 8th for womens day celebration.',
    date: '2026-01-28',
  },
  {
    id: 6,
    title: 'New Computer Lab Inaugurated',
    description: 'Our newly upgraded computer lab with the latest systems is now open for students.',
    date: '2026-01-20',
    file: '/files/lab-inauguration.pdf',
  },
];

export function Announcements() {
  const { data: announcements, loading } = useFetch(announcementService.getAnnouncements);

  const displayAnnouncements = Array.isArray(announcements) ? announcements : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader title="Announcements" subtitle="Latest notices and circulars" />

      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : displayAnnouncements.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No announcements available</p>
          ) : (
            <div className="space-y-4">
              {displayAnnouncements.map((announcement) => (
                <Card key={announcement.id || announcement._id} className="hover:shadow-lg transition">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(announcement.date)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{announcement.description}</p>
                    {announcement.file && (
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = announcement.file;
                            link.download = announcement.file.split('/').pop();
                            link.click();
                          }}
                        >
                          <Download className="w-4 h-4" />
                          Download File
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
