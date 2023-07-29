import AxeRequest from "../Services/AxeRequest";
import AxeResponse from "../Services/AxeResponse";

const CLOUD_FRONT_DOMAIN = "https://dw7lgbuj348m4.cloudfront.net/v1";

export default async (req: AxeRequest, res: AxeResponse) => {
  try {
    const result = await fetch(`${CLOUD_FRONT_DOMAIN}/index.html`);
    const content = (await result.text())
      .replaceAll(`src="`, `src="${CLOUD_FRONT_DOMAIN}`)
      .replaceAll(`href="`, `href="${CLOUD_FRONT_DOMAIN}`);

    res.send(content);
  } catch (error) {
    res.send("404");
  }
};
