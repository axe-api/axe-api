import cors from "cors";

const onBeforeInit = async ({ app }) => {
  app.use(
    cors({
      origin: true,
    })
  );
};

const onAfterInit = async () => {};

export { onBeforeInit, onAfterInit };
