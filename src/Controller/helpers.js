const getInputFromBody = (body, field) => {
  if (!body) {
    return null;
  }
  let value = null;
  for (const key of Object.keys(body)) {
    if (key.trim() === field.trim()) {
      value = body[key];
      break;
    }
  }
  return value;
};

export const getFormData = (request, fillable) => {
  let fields = fillable;
  if (!Array.isArray(fillable)) {
    fields = fillable[request.method] ? fillable[request.method] : [];
  }

  const filtered = {};
  for (const field of fields) {
    filtered[field] = getInputFromBody(request.body, field);
  }

  return filtered;
};

export const getFormValidation = (method, validations) => {
  if (!validations) {
    return undefined;
  }

  if (validations[method]) {
    return validations[method];
  }

  if (validations.POST || validations.PUT) {
    return undefined;
  }

  return validations;
};

export const callHooks = async (model, type, data) => {
  if (model.hooks[type]) {
    await model.hooks[type](data);
  }

  if (model.events[type]) {
    model.events[type](data);
  }
};

export const getParentColumn = (request) => {
  const sections = request.route.path
    .replace("/api/", "")
    .split("/")
    .filter((item) => item !== ":id" && item.indexOf(":") > -1);
  if (sections.length > 0) {
    return sections[sections.length - 1].replace(":", "");
  }
  return null;
};
