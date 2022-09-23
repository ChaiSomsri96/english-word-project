import { Router } from "express";
import auth from "./auth";
import category from "./category";
import problem from "./problem";

const routes = Router();

routes.use("/auth", auth);
routes.use("/category", category);
routes.use("/problem", problem);

export default routes;