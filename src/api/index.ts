import { respond } from "../common/ApiResponse";
import { routes } from "./routes";

const express = require("express");
const bodyParser = require("body-parser");

export const startup = (port: number = 3001) => {
  const app = express();
  app.use(bodyParser.json());
  app.use((req: any, res: any, next: () => void) => {
    res.set(
      `Access-Control-Allow-Origin`,
      (process.env.CORS_URL || req.headers["origin"]).replace(/ /g, "")
    );
    res.set(
      `Access-Control-Allow-Methods`,
      process.env.CORS_METHODS || "GET, POST, DELETE, OPTIONS"
    );
    res.set(`Access-Control-Allow-Headers`, process.env.CORS_HEADERS || "Content-Type");
    next();
  });

  routes(app);

  // CORS Preflight
  app.options("*", (req: any, res: any) => res.status(200).send());

  // 404 catch all
  app.use((req: any, res: any, next: () => void) => {
    respond(res, {}, 404, "Not Found");
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(`API listening on port ${port}`);
  });
};

startup(parseInt(process.env.PORT || "3001"));
