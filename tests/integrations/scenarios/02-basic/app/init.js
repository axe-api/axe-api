export default async ({ app }) => {
  app.get("/api/health", (req, res) => {
    res.json({
      status: true,
    });
  });
};
