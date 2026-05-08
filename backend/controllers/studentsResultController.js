import StudentsResult from '../models/StudentsResult.js';


// GET ALL STUDENTS
export const getStudentsResult = async (req, res) => {

    try {

        const { year, stream, section } = req.query;

        let filter = {};

        if (year) {
            filter.year = Number(year);
        }

        if (stream) {
            filter.stream = stream;
        }

        if (section) {
            filter.section = section;
        }

        const results = await StudentsResult.find(filter)
            .sort({ year: -1 });

        res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// CREATE STUDENT RESULT
export const createStudentResult = async (req, res) => {

    try {

        const data = { ...req.body };

        data.rollNo = Number(data.rollNo);
        data.year = Number(data.year);

        // CLOUDINARY IMAGE URL
        if (req.file) {
            data.studentImage = req.file.path;
        }

        // convert subjects string to object
        if (typeof data.subjects === 'string') {
            data.subjects = JSON.parse(data.subjects);
        }

        // calculate totals automatically
        if (data.subjects) {

            Object.keys(data.subjects).forEach(subject => {

                const sub = data.subjects[subject];

                sub.theory = Number(sub.theory || 0);
                sub.practical = Number(sub.practical || 0);

                sub.total = sub.theory + sub.practical;

            });
        }

        const result = await StudentsResult.create(data);

        res.status(201).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE STUDENT RESULT
export const updateStudentsResult = async (req, res) => {

    try {
        const data = { ...req.body };

        if (data.rollNo) {
            data.rollNo = Number(data.rollNo);
        }

        if (data.year) {
            data.year = Number(data.year);
        }

        // UPDATE CLOUDINARY IMAGE URL
        if (req.file) {
            data.studentImage = req.file.path || req.file.secure_url;
        }

        // convert subjects string to object
        if (typeof data.subjects === 'string') {
            data.subjects = JSON.parse(data.subjects);
        }

        // calculate totals automatically
        if (data.subjects) {

            Object.keys(data.subjects).forEach(subject => {

                const sub = data.subjects[subject];

                sub.theory = Number(sub.theory || 0);
                sub.practical = Number(sub.practical || 0);

                sub.total = sub.theory + sub.practical;

            });
        }

        const result = await StudentsResult.findById(req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Student Result Not Found'
            });
        }

        Object.assign(result, data);

        await result.save();

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE STUDENT RESULT
export const deleteStudentsResult = async (req, res) => {

    try {

        const result = await StudentsResult.findByIdAndDelete(
            req.params.id
        );

        if (!result) {

            return res.status(404).json({
                success: false,
                message: 'Student Result Not Found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Deleted Successfully'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};