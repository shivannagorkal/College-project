import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { COLLEGE_NAME, COLLEGE_FOUNDER, COLLEGE_FOUNDED } from '@/utils/constants';

export function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader title="About Us" page="about" subtitle="Know more about our institution" />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Founder Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Founder</h2>
            <div className="bg-secondary p-8 rounded-lg">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <Avatar className="w-32 h-32">
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                    AP
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{COLLEGE_FOUNDER}</h3>
                  <p className="text-gray-700 mb-4">
                    Visionary educationist and founder of {COLLEGE_NAME}, established in {COLLEGE_FOUNDED}.
                  </p>
                  <p className="text-gray-700">
                    With a passion for quality education and a vision to uplift the community, AL Prasad founded
                    this institution to provide accessible and quality education in science and commerce streams.
                    His dedication has made the college one of the most respected institutions in the district.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Principal Message */}
          <section className="mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Principal's Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">PR</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-bold mb-2">Dr. Principal Name</h4>
                    <p className="text-gray-700">
                      Welcome to AKRDevi PU College. We are committed to fostering an environment where every
                      student can excel academically and develop as responsible citizens. Our holistic approach to
                      education integrates academic excellence with character building and skill development. We
                      believe that quality education is the key to a better future, and we work tirelessly to provide
                      the best learning experience to our students.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Vision & Mission */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Vision & Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    To be a premier institution providing quality education and fostering excellence in academics,
                    character development, and social responsibility, creating responsible global citizens.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    To provide accessible, affordable, and quality education in science and commerce streams,
                    nurturing talent, building character, and empowering students for a bright future.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Infrastructure */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Infrastructure Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Modern Laboratory', desc: 'Fully equipped physics, chemistry, and biology labs' },
                { title: 'Computer Lab', desc: 'Latest computers with high-speed internet connectivity' },
                { title: 'Library', desc: '5000+ books and digital resources for student learning' },
                { title: 'Sports Facilities', desc: 'Indoor and outdoor sports grounds and facilities' },
                { title: 'Auditorium', desc: 'Multipurpose hall for seminars, events, and gatherings' },
                { title: 'Canteen', desc: 'Hygienic and affordable food services for students' },
              ].map((infra, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{infra.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{infra.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Awards & Achievements */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Awards & Achievements</h2>
            <div className="bg-secondary p-8 rounded-lg">
              <ul className="space-y-4">
                {[
                  'Recognized as Best PU College in Koppala District (2022-2023)',
                  'Consistent pass percentage above 90% for 5 consecutive years',
                  'Produced 15+ rank holders in recent years',
                  'Active participation in National Science Olympiad',
                  'Winner of Inter-College Sports Championship 2023',
                  'Awarded for Best Environmental Practices 2023',
                ].map((achievement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">✓</span>
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
