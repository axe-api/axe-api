export const getFormData = (request, fillable) => {
  let fields = fillable;
  if (!Array.isArray(fillable)) {
    fields = fillable[request.method] ? fillable[request.method] : [];
  }

  const filtered = {};

  for (const field of fields) {
    filtered[field] = request.body[field] ? request.body[field] : null;
  }

  return filtered;
};

export const getFormValidation = (request, validations) => {
  if (!validations) {
    return null;
  }

  if (validations[request.method]) {
    return validations[request.method];
  }

  if (validations.POST || validations.PUT) {
    return null;
  }

  return validations;
};
