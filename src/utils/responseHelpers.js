  module.exports.resReturn = (res, code, data) => {
    return res.status(code).json(data);
  };
  