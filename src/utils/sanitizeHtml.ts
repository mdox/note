import sanitize from "sanitize-html";

const sanitizeConfig: sanitize.IOptions = {
  allowedAttributes: {
    "*": ["style", "class"],
    a: ["href", "target", "rel"],
  },
};

const sanitizeHtml = (dirty: string, options?: sanitize.IOptions) =>
  sanitize(dirty, { ...sanitizeConfig, ...options });

export default sanitizeHtml;
