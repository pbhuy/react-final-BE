function paginate(params) {
  const { data = [], page = 1, limit = 20 } = params;
  // Validate inputs
  if (
    !Array.isArray(data) ||
    !Number.isInteger(page) ||
    !Number.isInteger(limit) ||
    page < 1 ||
    limit < 1
  ) {
    throw new Error("Invalid input parameters");
  }

  // Calculate start and end indices for the specified page and limit
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  console.log(startIndex, endIndex);

  // Slice the data=[] based on the calculated indices
  const paginatedArray = data.slice(startIndex, endIndex);

  return paginatedArray;
}

module.exports = { paginate };
