import express from "express";
import type { Express, RequestHandler } from "express";
import cors from 'cors'
import fruitsRouter from "./routes/fruits.js";
import secretsRouter from './routes/secret.js'
import { authenticate } from "./middleware/auth.js";

const app: Express = express();
const port = 1337; // byt portnummer om den är upptagen på din dator

const logger: RequestHandler = (req, res, next) => {
  console.log(`${req.method}  ${req.url}`, req.body);
  next();
};

app.use("/", cors())
app.use("/", express.json()); // express kan hantera body
app.use("/", logger);
app.use("/", express.static('./static-frontend/'))
app.use('/', authenticate)
app.use("/fruits", fruitsRouter);
app.use("/secret", secretsRouter)

/* Don't do this!! Use express.static instead.
app.get('/index.html', (req, res) => {
  res.sendFile('path to my index.html')
})
*/

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
