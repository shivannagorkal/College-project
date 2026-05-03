import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { FacultyCard } from '@/components/shared/FacultyCard';
import { Spinner } from '@/components/ui/spinner';
import { useFetch } from '@/hooks/useFetch';
import { facultyService } from '@/services/facultyService';
import { DEPARTMENTS } from '@/utils/constants';

const mockFaculty = [
  {
    id: 1,
    name: 'Dr. Ramesh Kumar',
    subject: 'Physics',
    qualification: 'PhD',
    department: 'Science',
  },
  {
    id: 2,
    name: 'Prof. Meera Singh',
    subject: 'Chemistry',
    qualification: 'M.Sc',
    department: 'Science',
  },
  {
    id: 3,
    name: 'Dr. Anil Sharma',
    subject: 'Biology',
    qualification: 'PhD',
    department: 'Science',
  },
  {
    id: 4,
    name: 'Prof. Priya Desai',
    subject: 'Accountancy',
    qualification: 'M.Com, CA',
    department: 'Commerce',
  },
  {
    id: 5,
    name: 'Prof. Akshay Patel',
    subject: 'Business Studies',
    qualification: 'M.Com',
    department: 'Commerce',
  },
  {
    id: 6,
    name: 'Dr. Harsha Sharma',
    subject: 'English',
    qualification: 'PhD',
    department: 'Languages',
  },
];

export function Faculty() {
  const [selectedDept, setSelectedDept] = useState('Science');
  const { data: faculty, loading } = useFetch(facultyService.getFaculty);

  const displayFaculty = Array.isArray(faculty) ? faculty : [];
  const filtered = displayFaculty.filter((f) => f.department === selectedDept);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader title="Faculty" subtitle="Meet our experienced teaching staff" />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <Tabs value={selectedDept} onValueChange={setSelectedDept}>
              <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
                {DEPARTMENTS.map((dept) => (
                  <TabsTrigger key={dept} value={dept}>
                    {dept}
                  </TabsTrigger>
                ))}
              </TabsList>

              {DEPARTMENTS.map((dept) => (
                <TabsContent key={dept} value={dept}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.length === 0 ? (
                      <p className="col-span-full text-center text-gray-500 py-12">
                        No faculty found for this department
                      </p>
                    ) : (
                      filtered.map((member) => (
                        <FacultyCard key={member.id || member._id} {...member} />
                      ))
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
