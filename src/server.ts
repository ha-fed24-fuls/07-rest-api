import express from "express";
import type { Express, RequestHandler } from "express";
import fruitsRouter from "./routes/fruits.js";

const app: Express = express();
const port = 1337; // byt portnummer om den är upptagen på din dator

const logger: RequestHandler = (req, res, next) => {
  console.log(`${req.method}  ${req.url}`, req.body);
  next();
};

app.use("/", express.json()); // express kan hantera body
app.use("/", logger);
app.use("/fruits", fruitsRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
