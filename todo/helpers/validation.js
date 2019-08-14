// Reduces validation errors to a single message
exports.reduceValidationErrors = errors => {
  return errors
    .array()
    .map(x => `${x.param}: ${x.msg}`)
    .join('; ');
};
