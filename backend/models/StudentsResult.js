import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema({
    theory: {
        type: Number,
        default: 0
    },

    practical: {
        type: Number,
        default: 0
    },

    total: {
        type: Number,
        default: 0
    }
}, { _id: false });

const sectionSubjects = {

    // SCIENCE
    PCMB: [
        'Kannada',
        'English',
        'Physics',
        'Chemistry',
        'Mathematics',
        'Biology'
    ],

    PCMC: [
        'Kannada',
        'English',
        'Physics',
        'Chemistry',
        'Mathematics',
        'Computer Science'
    ],

    // COMMERCE
    CEBA: [
        'Kannada',
        'English',
        'Computer Science',
        'Economics',
        'Business Studies',
        'Accountancy'
    ]
};

const studentsResultSchema = new mongoose.Schema({

    studentImage: {
        type: String,
        default: ''
    },

    studentName: {
        type: String,
        required: true
    },

    rollNo: {
        type: Number,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    stream: {
        type: String,
        enum: ['Science', 'Commerce'],
        required: true
    },

    section: {
        type: String,
        required: true
    },

    subjects: {
        type: Map,
        of: marksSchema,
        default: {}
    }

});

studentsResultSchema.pre('save', function(next) {

    const allowedSubjects = sectionSubjects[this.section];

    if (!allowedSubjects) {
        return next(new Error('Invalid Section'));
    }

    const existing = new Map(this.subjects);
    this.subjects.clear();

    for (const subject of allowedSubjects) {
        if (existing.has(subject)) {
            this.subjects.set(subject, existing.get(subject));
        }
    }

    next();
});

export default mongoose.model(
    'StudentsResult',
    studentsResultSchema
);