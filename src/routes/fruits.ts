import express from "express";
import type { Request, Response, Router } from "express";
import * as z from "zod";

const router: Router = express.Router();

interface Fruit {
  id: string;
  name: string;
  price: number;
}

// Skicka ett meddelande om något går fel med requestet
type ErrorRes = { error: string };

// TODO: lägg till striktare regler. T.ex minst två tecken i namnet, inga negativa priser osv.
const FruitSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
});

let data: Fruit[] = [
  { id: "q1", name: "purjolök", price: 12 },
  { id: "q2", name: "banan", price: 77 },
  { id: "q3", name: "melon", price: 20 },
];

interface IdParam {
  id: string;
}


// GET /    (lägg till "/fruits/" först på alla URL)
router.get("/", (req, res: Response<Fruit[]>) => {
  res.send(data);
});

// GET /:id  URL-parameter
router.get("/:id", (req: Request<IdParam>, res: Response<Fruit>) => {
  const id: string = req.params.id;
  const maybeFruit: Fruit | undefined = data.find((fruit) => fruit.id === id);
  // Två möjligheter: antingen finns frukten med "id" eller inte
  if (maybeFruit) {
    res.send(maybeFruit); // status 200 OK
  } else {
    res.sendStatus(404); // 404 Not Found
  }
});

// POST /    Request<URL-parameter, response type, body type>
router.post("/", (req: Request<{}, void | ErrorRes, Fruit>, res) => {
  // Vi vet inte vad vi faktiskt får i body - måste validera det
  try {
    let newFruit: Fruit = FruitSchema.parse(req.body);
    data.push(newFruit);
    res.sendStatus(201); // 201 Created, resurs skapad på servern
  } catch (error) {
    let message: ErrorRes = {
      error: 'Send a valid Fruit object.'
    }
    res.status(400).send(message)
    // 400 Bad request, dåligt utformat request eftersom det inte är ett korrekt frukt-objekt
  }
});

// DELETE /id   välj ut med URL-parameter
router.delete("/:id", (req: Request<IdParam>, res: Response<void | ErrorRes>) => {
  const id: string = req.params.id;
  const maybeFruit: Fruit | undefined = data.find((fruit) => fruit.id === id);

  if (maybeFruit) {
    data = data.filter((fruit) => fruit.id !== id);
    res.sendStatus(200); // 200 OK
  } else {
    res.status(404).send({ error: 'Id does not match any fruit.' })
    // 404 Not found, det fanns ingen frukt med detta id
  }
});

// Hur löser man PUT?
// Använd URL-parameter för att välja ut vilken frukt som ska ändras
// Använd BODY för att skicka det nya objektet som vi ska ersätta det gamla med
// Möjliga resultat:
// 200 om allt är grönt
// 400 - om body inte är ett frukt-objekt
// 404 - om man skriver ett id som det inte finns en frukt för
router.put(
  "/:id",
  (
    //  Request< URL-parameter, response type, body type>
    req: Request<IdParam, Fruit | ErrorRes, Fruit>,
    res: Response<Fruit | ErrorRes>
  ) => {
    const id = req.params.id;

    const index = data.findIndex((fruit) => fruit.id === id);
    // findIndex returnerar -1 om den inte hittar något matchande element
    if (index === -1) {
      // För nyare versioner av Express gör .send och .json samma sak
      return res.status(404).json({ error: "Fruit not found in the DB" });
    }

    let updated: Fruit;

    try {
      updated = FruitSchema.parse(req.body);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Invalid body or wrong data type." });
    }

    if (updated.id !== id) {
      return res
        .status(400)
        .json({ error: "Body.id must match with id from the URL." });
    }

    // if (
    //   data[index]?.id === updated.id &&
    //   data[index]?.name === updated.name &&
    //   data[index]?.price === updated.price
    // ) {
    //   // Identisk payload → inget att uppdatera
    //   return res.sendStatus(204); // eller return res.status(200).json(updated);
    // }

    if (JSON.stringify(data[index]) === JSON.stringify(updated)) {
      return res.sendStatus(204);
    }

    data[index] = updated;
    console.log("updated.id och id: ", updated.id, id);

    return res.status(200).json(updated);
  }
);

/*
const response = await fetch(url, { method: 'PUT', body: myBody })
if( response.status === 204 ) ...
*/


export default router;
