import { useEffect, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';

import { StudentsResultService } from '@/services/StudentsResultService';


export function Results() {

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  const [searchedStudent, setSearchedStudent] =
    useState(null);

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );


  // FETCH RESULTS
  useEffect(() => {

    const fetchResults = async () => {

      try {

        const data =
          await StudentsResultService
            .getStudentsResult();

        setResults(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

    fetchResults();

  }, []);


  // SEARCH STUDENT
  const handleSearch = () => {

    const query =
      searchQuery.trim().toLowerCase();

    if (!query) return;

    const found = results.find((student) =>

      student.year?.toString() === selectedYear

      &&

      (
        student.studentName
          ?.toLowerCase()
          .includes(query)

        ||

        student.rollNo
          ?.toString() === query
      )
    );

    setSearchedStudent(found || null);
  };


  return (

    <div className="min-h-screen flex flex-col">

      <Navbar />

      <PageHeader
        title="Results"
        page="results"
        subtitle="Search Student Results"
      />


      <div className="flex-1">

        <div className="max-w-6xl mx-auto px-4 py-10">


          {/* YEAR SELECT */}

          <div className="mb-6 flex items-center gap-3">

            <label className="font-semibold">
              Select Year:
            </label>

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(e.target.value)
              }
              className="border rounded-md px-3 py-2"
            >

              {[2026, 2025, 2024, 2023].map((year) => (

                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>

              ))}

            </select>

          </div>


          {/* SEARCH CARD */}

          <Card className="mb-8">

            <CardContent className="pt-6">

              <div className="flex gap-3">

                <input
                  type="text"
                  placeholder="Enter Roll No or Student Name"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="flex-1 border rounded-md px-4 py-2"
                />

                <button
                  onClick={handleSearch}
                  className="bg-primary text-white px-6 py-2 rounded-md"
                >
                  Search
                </button>

              </div>

            </CardContent>

          </Card>


          {/* LOADING */}

          {loading && (

            <div className="text-center py-10">

              Loading Results...

            </div>
          )}


          {/* STUDENT RESULT */}

          {!loading && searchedStudent && (

            <Card>

              <CardContent className="pt-6">


                {/* STUDENT INFO */}

                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">

                  <img
                    src={searchedStudent.studentImage}
                    alt={searchedStudent.studentName}
                    className="w-40 h-40 object-cover rounded-lg border"
                  />

                  <div className="space-y-2">

                    <h2 className="text-2xl font-bold">
                      {searchedStudent.studentName}
                    </h2>

                    <p>
                      <span className="font-semibold">
                        Roll No:
                      </span>{' '}
                      {searchedStudent.rollNo}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Year:
                      </span>{' '}
                      {searchedStudent.year}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Stream:
                      </span>{' '}
                      {searchedStudent.stream}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Section:
                      </span>{' '}
                      {searchedStudent.section}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Percentage:
                      </span>{' '}
                      {searchedStudent.percentage}%
                    </p>

                    <p>
                      <span className="font-semibold">
                        Total Marks:
                      </span>{' '}
                      {searchedStudent.totalMarks}
                    </p>

                  </div>

                </div>


                {/* RESULT TABLE */}

                <div className="border rounded-lg overflow-hidden">

                  <Table>

                    <TableHeader>

                      <TableRow>

                        <TableHead>
                          Subject
                        </TableHead>

                        <TableHead>
                          Theory
                        </TableHead>

                        <TableHead>
                          Practical
                        </TableHead>

                        <TableHead>
                          Total
                        </TableHead>

                        <TableHead>
                          Result
                        </TableHead>

                      </TableRow>

                    </TableHeader>


                    <TableBody>

                      {Object.entries(
                        searchedStudent.subjects || {}
                      ).map(([subject, marks]) => (

                        <TableRow key={subject}>

                          <TableCell className="font-medium">
                            {subject}
                          </TableCell>

                          <TableCell>
                            {marks.theory}
                          </TableCell>

                          <TableCell>
                            {marks.practical}
                          </TableCell>

                          <TableCell>
                            {marks.total}
                          </TableCell>

                          <TableCell>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                marks.result === 'Pass'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {marks.result}
                            </span>

                          </TableCell>

                        </TableRow>

                      ))}

                    </TableBody>

                  </Table>

                </div>

              </CardContent>

            </Card>
          )}


          {/* NO RESULT */}

          {!loading &&
            searchQuery &&
            !searchedStudent && (

            <div className="text-center text-red-500 py-6">

              Student Result Not Found

            </div>
          )}

        </div>

      </div>

      <Footer />

    </div>
  );
}