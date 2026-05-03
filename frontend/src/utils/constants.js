export const COLLEGE_NAME = 'AKRDevi PU College';
export const COLLEGE_SHORT_NAME = 'AKRD';
export const COLLEGE_LOGO = '';
export const COLLEGE_LOCATION = 'Sriramnagara, Taluk Gangavathi, District Koppala, Karnataka';
export const COLLEGE_PHONE = '+91-8386-271234';
export const COLLEGE_EMAIL = 'info@akrdevi.edu.in';
export const COLLEGE_FOUNDER = 'AL Prasad';
export const COLLEGE_FOUNDED = 2013;

export const SCIENCE_SUBJECTS = [
  'Physics',
  'Chemistry',
  'Biology',
  'Mathematics',
  'Computer Science',
  'English',
  'Kannada',
];

export const COMMERCE_SUBJECTS = [
  'Accountancy',
  'Business Studies',
  'Economics',
  'English',
  'Kannada',
  'Statistics',
];

export const DEPARTMENTS = ['Science', 'Commerce', 'Languages'];

export const GALLERY_CATEGORIES = ['Sports', 'Cultural', 'Academic', 'Annual Day'];

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Academics', href: '/academics' },
  { name: 'Results', href: '/results' },
  { name: 'Toppers', href: '/toppers' },
  { name: 'Events', href: '/events' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Faculty', href: '/faculty' },
  { name: 'Admissions', href: '/admissions' },
  { name: 'Announcements', href: '/announcements' },
  { name: 'History', href: '/history' },
  { name: 'Contact', href: '/contact' },
];

export const YEARS = Array.from(
  { length: new Date().getFullYear() - COLLEGE_FOUNDED + 1 },
  (_, i) => COLLEGE_FOUNDED + i
).reverse();
