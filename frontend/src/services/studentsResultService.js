// StudentsResultService.js

import apiClient from './api';


const normalizeStudentsResult = (result) => {

    const totalMarks = Object.values(
        result.subjects || {}
    ).reduce((sum, subject) => {

        return sum + Number(subject.total || 0);

    }, 0);

    const subjectCount = Object.keys(
        result.subjects || {}
    ).length;

    const percentage = subjectCount
        ? ((totalMarks / (subjectCount * 100)) * 100)
        : 0;

    return {
        ...result,
        totalMarks,
        percentage: percentage.toFixed(2)
    };
};


export const StudentsResultService = {


    // GET RESULTS
    getStudentsResult: async (params = {}) => {

        const query = new URLSearchParams(
            params
        ).toString();

        const response = await apiClient.get(
            `/students-results${
                query ? `?${query}` : ''
            }`
        );

        return (response.data.data || [])
            .map(normalizeStudentsResult);
    },


    // CREATE RESULT
    createStudentsResult: async (data) => {

        const formData = new FormData();

        formData.append(
            'studentName',
            data.studentName
        );

        formData.append(
            'rollNo',
            Number(data.rollNo)
        );

        formData.append(
            'year',
            Number(data.year)
        );

        formData.append(
            'stream',
            data.stream
        );

        formData.append(
            'section',
            data.section
        );

        // SUBJECTS
        formData.append(
            'subjects',
            JSON.stringify(data.subjects)
        );

        // IMAGE
        if (data.studentImage) {

            formData.append(
                'studentImage',
                data.studentImage
            );
        }

        const response = await apiClient.post(
            '/students-results',
            formData,
            {
                headers: {
                    'Content-Type':
                        'multipart/form-data'
                }
            }
        );

        return response.data;
    },


    // UPDATE RESULT
    updateStudentsResult: async (id, data) => {

        const formData = new FormData();

        formData.append(
            'studentName',
            data.studentName
        );

        formData.append(
            'rollNo',
            Number(data.rollNo)
        );

        formData.append(
            'year',
            Number(data.year)
        );

        formData.append(
            'stream',
            data.stream
        );

        formData.append(
            'section',
            data.section
        );

        // SUBJECTS
        formData.append(
            'subjects',
            JSON.stringify(data.subjects)
        );

        // IMAGE
        if (data.studentImage) {

            formData.append(
                'studentImage',
                data.studentImage
            );
        }

        const response = await apiClient.put(
            `/students-results/${id}`,
            formData,
            {
                headers: {
                    'Content-Type':
                        'multipart/form-data'
                }
            }
        );

        return response.data;
    },


    // DELETE
    deleteStudentsResult: async (id) => {

        const response = await apiClient.delete(
            `/students-results/${id}`
        );

        return response.data;
    }
};