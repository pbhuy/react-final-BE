const sendRes = (res, status, data, message) => {
  let dataReturn = {
    success: true,
  };

  if (data) {
    dataReturn.data = data;
  }

  if (message) {
    dataReturn.message = message;
  }

  return res.status(status).json(dataReturn);
};

const sendErr = (res, err) => {
  return res.status(err.status).json({
    success: false,
    error: {
      message: err.message,
    },
  });
};

module.exports = { sendRes, sendErr };
