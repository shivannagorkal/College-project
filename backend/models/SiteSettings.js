import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    default: 'AKRDevi PU College'
  },
  tagline: {
    type: String,
    default: 'Quality Education in Science & Commerce Streams'
  },
  aboutParagraph: {
    type: String,
    default: 'AKRDevi PU College, founded in 2013, is one of the top educational institutions in Koppala district.'
  },
  address: {
    type: String,
    default: 'Sriramnagara, Taluk Gangavathi, District Koppala, Karnataka'
  },
  phone: { type: String, default: '+91-8386-271234' },
  email: { type: String, default: 'info@akrdevi.edu.in' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  youtube: { type: String, default: '' },
  studentsCount: { type: String, default: '5,000+' },
  facultyCount: { type: String, default: '50+' },
  foundedYear: { type: Number, default: 2013 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('SiteSettings', siteSettingsSchema);
