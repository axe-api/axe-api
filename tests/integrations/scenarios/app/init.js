import cors from "cors";

const onBeforeInit = async ({ app }) => {
  app.use(
    cors({
      origin: true,
    })
  );
  app.get("/health/v1", (req, res) => res.json({ health: true }));
};

const onAfterInit = async ({ app }) => {
  app.get("/health/v2", (req, res) => res.json({ health: true }));
};

export { onBeforeInit, onAfterInit };
