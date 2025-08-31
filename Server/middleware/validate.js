export default function isValidate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      console.log("Validation failed:", errors); 
      return res.status(400).json({ error: errors[0].message });
    }

    req.validated = result.data;
    next();
  };
}