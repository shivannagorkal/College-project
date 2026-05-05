import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CircleCheck as CheckCircle } from 'lucide-react';
import { validateForm, validatePhone } from '@/utils/validators';

const admissionSteps = [
  {
    step: 1,
    title: 'Application Submission',
    description: 'Fill and submit the online application form with required documents',
  },
  {
    step: 2,
    title: 'Document Verification',
    description: 'Submit original documents for verification at the college office',
  },
  {
    step: 3,
    title: 'Counseling & Merit List',
    description: 'Attend counseling session and check merit list for admission confirmation',
  },
  {
    step: 4,
    title: 'Fee Payment & Enrollment',
    description: 'Pay admission fee and complete enrollment procedures',
  },
];

const eligibility = {
  Science: {
    intro: '10th Pass with minimum 60% marks',
    requirements: [
      'English: 45/100',
      'Mathematics: 40/100',
      'Science: 40/100',
      'Overall: 165/300',
    ],
  },
  Commerce: {
    intro: '10th Pass with minimum 55% marks',
    requirements: [
      'English: 40/100',
      'Mathematics: 40/100',
      'Social Science: 40/100',
      'Overall: 150/300',
    ],
  },
};

const feeStructure = [
  { description: 'Tuition Fee (per year)', amount: '₹12,000' },
  { description: 'Laboratory Fee', amount: '₹2,000' },
  { description: 'Sports Fee', amount: '₹1,000' },
  { description: 'Library Fee', amount: '₹1,000' },
  { description: 'Development Fund', amount: '₹3,000' },
  { description: 'Total (per year)', amount: '₹19,000' },
];

export function Admissions() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    stream: 'Science',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateForm(formData, ['name', 'phone', 'email']);

    if (!isValid || !validatePhone(formData.phone)) {
      setErrors({
        ...validationErrors,
        ...(formData.phone && !validatePhone(formData.phone) && { phone: 'Invalid phone number' }),
      });
      return;
    }

    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', stream: 'Science', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader title="Admissions" page="admissions" subtitle="Join AKRDevi PU College" />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Admission Process */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Admission Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {admissionSteps.map((item, index) => (
                <div key={index} className="relative">
                  {index < admissionSteps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-1 bg-gray-300"></div>
                  )}
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                        {item.step}
                      </div>
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </section>

          {/* Eligibility */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Eligibility Criteria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(eligibility).map(([stream, data]) => (
                <Card key={stream}>
                  <CardHeader>
                    <CardTitle>{stream} Stream</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-semibold text-primary">{data.intro}</p>
                    <div>
                      <h4 className="font-bold mb-2">Minimum Subject Marks:</h4>
                      <ul className="space-y-1">
                        {data.requirements.map((req, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Fee Structure */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Fee Structure</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feeStructure.map((item, index) => (
                        <TableRow key={index} className={index === feeStructure.length - 1 ? 'bg-primary/5' : ''}>
                          <TableCell
                            className={index === feeStructure.length - 1 ? 'font-bold' : ''}
                          >
                            {item.description}
                          </TableCell>
                          <TableCell
                            className={`text-right ${index === feeStructure.length - 1 ? 'font-bold text-primary' : ''}`}
                          >
                            {item.amount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Online Enquiry Form */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Online Enquiry Form</h2>
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                  {submitted && (
                    <div className="p-4 bg-green-100 text-green-700 rounded-lg">
                      Thank you! We'll contact you soon with more information.
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Phone *</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Interested Stream</label>
                    <Select value={formData.stream} onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, stream: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="Commerce">Commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message or questions..."
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Enquiry
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
