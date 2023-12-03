const semesters = [
  {
    id: 1,
    semesterName: "Sem 1 2023",
  },
  {
    id: 2,
    semesterName: "Sem 2 2023",
  },
];

const subjects = [
  {
    subjectId: 1,
    subjectName: "Math",
    teacherId: 1,
    semesterId: 1,
  },
  {
    subjectId: 2,
    subjectName: "Science",
    teacherId: 1,
    semesterId: 1,
  },
];

const scoreTypes = [
  {
    scoreTypeId: 1,
    scoreTypeName: "Mid",
  },
  {
    scoreTypeId: 2,
    scoreTypeName: "Final",
  },
  {
    scoreTypeId: 3,
    scoreTypeName: "Test exam",
  },
];

const comments = [
  {
    userId: 1,
    comment: "abc",
    reviewId: 1,
  },
  {
    userId: 2,
    comment: "cxde",
    reviewId: 1,
  },
];

const scoresRequested = [
  {
    id: 1,
    student: {
      id: 1,
      name: "Nguyen Van A",
    },
    teacher: {
      id: 1,
      name: "Nguyen Van A",
    },
    subjectId: 1,
    semesterId: 1,
    scoreTypeId: 1,
    expectedScore: 10,
    expectedPercent: 0.1,
    explain: "abc",
  },
  {
    id: 2,
    student: {
      id: 1,
      name: "Nguyen Van A",
    },
    teacher: {
      id: 1,
      name: "Nguyen Van A",
    },
    subjectId: 2,
    semesterId: 1,
    scoreTypeId: 1,
    expectedScore: 10,
    expectedPercent: 0.1,
    explain: "abc",
  },
];

const mockScoreStructure = [
  {
    scoreTypeId: 1,
    scoreTypeName: "Mid",
    percentage: 0.5,
    isPublish: false,
  },
  {
    scoreTypeId: 2,
    scoreTypeName: "Final",
    percentage: 0.5,
    isPublish: false,
  },
];

const scores = [
  {
    studentId: 1,
    teacherId: 1,
    semesterId: 1,
    subjectId: 1,
    scoreTypeId: 1,
    scoreValue: 9.2,
  },
  {
    studentId: 1,
    teacherId: 1,
    semesterId: 1,
    subjectId: 1,
    scoreTypeId: 2,
    scoreValue: 8.2,
  },
];

const scoresBoard = {
  subjectId: 1,
  teacherId: 2,
  semesterId: 3,
  studentsScores: [
    {
      studentId: 1,
      studentName: "Nguyen Van A",
      scores: scores,
    },
  ],
  total: 9.2,
};

module.exports = MockData = {
  getScoreStructure: (params) => {
    if (!params) {
      return;
    }
    const { teacherId, subjectId, semesterId } = params;

    // get all scorestructure with params in DB
    const data = mockScoreStructure;

    return data;
  },
  addScoreStructure: (params) => {
    if (!params) {
      return;
    }
    const { subjectId, teacherId, semester, scoreTypeId, percentage } = params;

    let addedItem = scoreTypes[2];
    console.log(addedItem);

    // @todo: calculate to ensure total percentage is 100%

    addedItem.percentage = percentage || 0.5;
    return [...mockScoreStructure, addedItem];
  },

  removeScoreStructure: (params) => {
    if (!params) {
      return;
    }
    const { subjectId, teacherId, semester, scoreTypeId } = params;

    // @todo: calculate to ensure total percentage is 100%

    return mockScoreStructure.slice(0, 2);
  },

  updateScoreStructure: (params) => {
    if (!params) {
      return;
    }
    const { subjectId, teacherId, semester, scoreTypeId, percentage } = params;

    // @todo: calculate to ensure total percentage is 100%

    return mockScoreStructure;
  },

  getScores: (params) => {
    if (!params) {
      return;
    }
    const { subjectId, teacherId, semester } = params;

    // @todo: calculate to ensure total percentage is 100%
    // @todo: handle get score only isPushlish

    return scoresBoard;
  },

  getSemesters: (params) => {
    return semesters;
  },

  getScoreTypes: (params) => {
    return scoreTypes;
  },

  getSubjects: (params) => {
    const { teacherId, semesterId } = params;
    return subjects;
  },

  getScoresRequested: (params) => {
    const { subjectId, teacherId, semesterId } = params;

    return scoresRequested;
  },

  getScoresRequestedDetail: (params) => {
    return {
      requestDetail: scoresRequested[0],
      comments: comments,
    };
  },

  commentReview: (params) => {
    return comments;
  },

  updateScore: (params) =>{
    return scores[0]
  }
};
