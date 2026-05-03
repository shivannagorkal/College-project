import Result from '../models/Result.js';

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeResultData = (body) => {
  const data = { ...body };

  if (data.year !== undefined) data.year = toNumber(data.year);
  if (data.totalStudents !== undefined) data.totalStudents = toNumber(data.totalStudents);
  if (data.passedStudents !== undefined) data.passedStudents = toNumber(data.passedStudents);
  if (data.firstClass !== undefined) data.firstClass = toNumber(data.firstClass);
  if (data.distinction !== undefined) data.distinction = toNumber(data.distinction);
  if (data.highestPercentageInStream !== undefined) {
    data.highestPercentageInStream = toNumber(data.highestPercentageInStream);
  }
  if (data.totalAppeared !== undefined) data.totalAppeared = toNumber(data.totalAppeared);
  if (data.totalQualified !== undefined) data.totalQualified = toNumber(data.totalQualified);

  if (data.highestScore !== undefined) {
    data.highestScore = toNumber(data.highestScore);
    data.topScore = data.highestScore;
  } else if (data.topScore !== undefined) {
    data.topScore = toNumber(data.topScore);
    data.highestScore = data.topScore;
  }

  if (data.totalStudents > 0) {
    data.passPercentage = Math.round((data.passedStudents / data.totalStudents) * 100);
  }

  if (data.totalAppeared > 0) {
    data.qualifiedPercentage = Math.round(
      (data.totalQualified / data.totalAppeared) * 100
    );
  }

  if (typeof data.subjects === 'string') {
    data.subjects = JSON.parse(data.subjects);
  }

  if (Array.isArray(data.subjects)) {
    data.subjects = data.subjects.map((subject) => ({
      subject: subject.subject,
      totalOutOf: toNumber(subject.totalOutOf, 100),
      highestScore: toNumber(subject.highestScore),
      passPercentage: toNumber(subject.passPercentage),
    }));
  }

  return data;
};

export const getResults = async (req, res) => {
  try {
    const { year, resultType, stream, className } = req.query;
    const filter = {};

    if (year) filter.year = Number(year);
    if (resultType) filter.resultType = resultType;
    if (stream) filter.stream = stream;
    if (className) filter.className = className;

    const results = await Result.find(filter).sort({
      year: -1,
      resultType: 1,
      stream: 1,
      className: 1,
    });

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createResult = async (req, res) => {
  try {
    const result = await Result.create(normalizeResultData(req.body));
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      normalizeResultData(req.body),
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
