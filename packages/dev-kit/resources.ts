import { createResources } from "./resource";
import user from "./user";
import post from "./posts";

export const resources = createResources(user, post);
