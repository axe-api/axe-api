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
