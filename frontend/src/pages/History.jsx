import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { TimelineItem } from '@/components/shared/TimelineItem';
import { COLLEGE_FOUNDED } from '@/utils/constants';

const milestones = [
  {
    year: COLLEGE_FOUNDED,
    title: 'College Established',
    description: 'AKRDevi PU College is founded with vision to provide quality education in Koppala district.',
  },
  {
    year: 2014,
    title: 'First Batch Graduates',
    description: 'First batch of students successfully complete PUC with 85% pass rate.',
  },
  {
    year: 2015,
    title: 'Infrastructure Expansion',
    description: 'New science laboratories and computer lab inaugurated with modern equipment.',
  },
  {
    year: 2016,
    title: 'Recognition Achievement',
    description: 'College recognized as Best PU College in district for consistent performance.',
  },
  {
    year: 2017,
    title: 'First Rank Holder',
    description: 'College produces first state-level rank holder with 98% marks.',
  },
  {
    year: 2018,
    title: 'Sports Excellence',
    description: 'Won inter-college sports championship with gold medals in multiple events.',
  },
  {
    year: 2019,
    title: 'Digital Learning Initiative',
    description: 'Introduced smart classrooms and online learning platform for students.',
  },
  {
    year: 2020,
    title: 'Covid Adaptation',
    description: 'Successfully transitioned to online teaching ensuring continuity of education.',
  },
  {
    year: 2021,
    title: 'Hybrid Learning Model',
    description: 'Implemented hybrid learning combining online and offline classes.',
  },
  {
    year: 2022,
    title: '10 Years Milestone',
    description: 'Celebrated college decennial with 90%+ pass rate and multiple toppers.',
  },
  {
    year: 2023,
    title: 'Expansion & Growth',
    description: 'Increased capacity and introduced new optional subjects for students.',
  },
  {
    year: 2024,
    title: 'Academic Excellence',
    description: 'Produced 15 rank holders with 92% overall pass percentage.',
  },
  {
    year: 2025,
    title: 'Research Initiative',
    description: 'Launched student research programs and innovation hubs for holistic development.',
  },
  {
    year: 2026,
    title: 'Future Ready',
    description: 'Continuing commitment to excellence and preparing students for global opportunities.',
  },
];

export function History() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader title="Our Journey" subtitle="From 2013 to Present - A Legacy of Excellence" />

      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-300 transform md:-translate-x-1/2"></div>

            {/* Timeline items */}
            <div className="space-y-12 pl-0 md:pl-0">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2'}`}>
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1.5 md:translate-x-1/2 -translate-y-1/2 top-2 border-4 border-white"></div>
                  <div className={`ml-20 md:ml-0 ${index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2'}`}>
                    <div className="bg-secondary p-4 rounded-lg hover:shadow-lg transition">
                      <h3 className="font-bold text-xl text-primary mb-1">{milestone.year}</h3>
                      <h4 className="font-bold text-lg mb-2">{milestone.title}</h4>
                      <p className="text-gray-700">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div className="mt-16 p-8 bg-primary text-primary-foreground rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">A Decade of Excellence</h2>
            <p className="mb-4">
              Over the past years, AKRDevi PU College has established itself as a beacon of educational excellence
              in Koppala district. Our commitment to quality education, infrastructure development, and student
              welfare has made us the preferred choice for hundreds of families.
            </p>
            <p>
              As we look to the future, we remain dedicated to nurturing talent, building character, and preparing
              students for a bright and successful tomorrow.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
