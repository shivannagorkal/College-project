import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SCIENCE_SUBJECTS, COMMERCE_SUBJECTS } from '@/utils/constants';

export function Academics() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader title="Academics" page="academics" subtitle="Explore our academic programs and subjects" />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Science Stream */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Science Stream</h2>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Subjects Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {SCIENCE_SUBJECTS.map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-base py-2 px-4">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Program Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Our Science stream is designed for students passionate about exploring the natural world and its
                  phenomena. With a focus on practical learning and laboratory work, students develop critical thinking
                  and problem-solving skills.
                </p>
                <div>
                  <h4 className="font-bold mb-2">Duration:</h4>
                  <p className="text-gray-700">2 Years (Post 10th)</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Career Options:</h4>
                  <p className="text-gray-700">
                    Engineering, Medicine, Research, Environmental Science, Technology, and many more fields.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Commerce Stream */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Commerce Stream</h2>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Subjects Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {COMMERCE_SUBJECTS.map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-base py-2 px-4">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Program Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Our Commerce stream equips students with knowledge and skills in business, economics, and
                  accounting. Ideal for students interested in building careers in finance, business, and related
                  fields.
                </p>
                <div>
                  <h4 className="font-bold mb-2">Duration:</h4>
                  <p className="text-gray-700">2 Years (Post 10th)</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Career Options:</h4>
                  <p className="text-gray-700">
                    CA, CS, Banking, Finance, Entrepreneurship, Business Management, and many more fields.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Teaching Methodology */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Teaching Methodology</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Student-Centered Learning</AccordionTrigger>
                <AccordionContent>
                  We emphasize student participation and engagement. Our teaching methods focus on helping students
                  develop critical thinking, problem-solving, and analytical skills through interactive sessions and
                  group discussions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Practical Training</AccordionTrigger>
                <AccordionContent>
                  Hands-on laboratory work and practical sessions form an integral part of our curriculum. Students
                  gain real-world experience and develop practical skills relevant to their future careers.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Digital Learning</AccordionTrigger>
                <AccordionContent>
                  We integrate technology into our teaching methods. Students have access to online resources, digital
                  platforms, and multimedia content to enhance their learning experience.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Personalized Guidance</AccordionTrigger>
                <AccordionContent>
                  Our experienced faculty provides personalized guidance and counseling to each student. We understand
                  individual learning styles and adapt our teaching approach accordingly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Competitive Exam Preparation</AccordionTrigger>
                <AccordionContent>
                  Special coaching and guidance are provided to students preparing for competitive exams like JEE, NEET,
                  and entrance exams for professional courses.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Examination Pattern */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-primary">Examination Pattern</h2>
            <Card>
              <CardHeader>
                <CardTitle>Assessment Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-bold mb-2">Internal Assessment (40%)</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Class tests and quizzes</li>
                      <li>• Practical work and projects</li>
                      <li>• Seminars and presentations</li>
                      <li>• Participation in class</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-bold mb-2">External Examination (60%)</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• PUC Board Examination</li>
                      <li>• Written test</li>
                      <li>• Practical examination</li>
                      <li>• Viva-voce (for practical subjects)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
