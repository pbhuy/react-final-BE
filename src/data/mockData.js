module.exports = MockData = {
  getScoreStructure: () => {
    return {
      subjectId: 123,
      teacherId: 123,
      semester: {},
      scoreTypeId: 1,
      percentage: 0.2,
    };
  },
  getMockScores: () => {
    return [
      {
        subjectId: "123",
        studentId: 123,
        teacherId: 456,
        semester: {},
        scoreTypeId: 1,
        scoreValue: 1.2,
      },
    ];
  },
  getStudent: () => {
    return {
      id: 123,
      name: "student 1",
    };
  },
  getTeacher: () => {
    return {
      id: 123,
      name: "student 1",
    };
  },
  getSemesters: () => {
    return [
      {
        id: "sem12023",
        name: "Sem 1 2023",
      },
      {
        id: "sem22023",
        name: "Sem 2 2023",
      },
    ];
  },

  getScoreTypes: () => {
    return [
      {
        id: 1,
        name: "Diem mieng",
      },
      {
        id: 2,
        name: "Diem giua ki",
      },
      {
        id: 3,
        name: "Diem cuoi ki",
      },
    ];
  },

  getSubjects: (params) => {
    if (!params) {
      return [];
    }
    const { teacherId, semesterId } = params;

    if (!teacherId || !semesterId) {
      return [];
    }

    return [
      {
        id: 123,
        teacherId: 1,
        semesterId: 1,
        scores: MockData.getMockScores(),
        scoreStructure: MockData.getScoreStructure(),
        isPublished: false,
      },
    ];
  },
};
