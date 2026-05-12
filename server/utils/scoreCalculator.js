const calculateScore = (passed, total, marks) => {
  return (passed / total) * marks;
};

module.exports = calculateScore;