import express from 'express'
import type { Request, Response, Router } from 'express'
import * as z from 'zod'

const router: Router = express.Router()

interface Fruit {
	id: string;
	name: string;
	price: number;
}
// TODO: lägg till striktare regler. T.ex minst två tecken i namnet, inga negativa priser osv.
const FruitSchema = z.object({
	id: z.string(),
	name: z.string(),
	price: z.number()
})

let data: Fruit[] = [
	{ id: 'q1', name: 'purjolök', price: 12 },
	{ id: 'q2', name: 'banan', price: 77 },
	{ id: 'q3', name: 'melon', price: 20 },
]
router.get('/', (req, res) => {
	res.send(data)
})
interface IdParam {
	id: string;
}
router.get('/:id', (req: Request<IdParam>, res: Response<Fruit>) => {
	const id: string = req.params.id
	const maybeFruit: Fruit | undefined = data.find(fruit => fruit.id === id)
	// Två möjligheter: antingen finns frukten med "id" eller inte
	if( maybeFruit ) {
		res.send(maybeFruit)   // status 200 OK

	} else {
		res.sendStatus(404)  // 404 Not Found
	}
})



router.post('/', (req: Request<{}, void, Fruit>, res) => {
	// Vi vet inte vad vi faktiskt får i body - måste validera det
	try {
		let newFruit: Fruit = FruitSchema.parse(req.body)
		data.push(newFruit)
		res.sendStatus(201)  // 201 Created, resurs skapad på servern
	} catch(error) {
		res.sendStatus(400)  // 400 Bad request, dåligt utformat request eftersom det inte är ett korrekt frukt-objekt
	}
})



router.delete('/:id', (req: Request<IdParam>, res: Response<void>) => {
	const id: string = req.params.id
	const maybeFruit: Fruit | undefined = data.find(fruit => fruit.id === id)

	if( maybeFruit ) {
		data = data.filter(fruit => fruit.id !== id)
		res.sendStatus(200)  // 200 OK
	} else {
		res.sendStatus(404)  // 404 Not found, det fanns ingen frukt med detta id
	}
})


// Hur löser man PUT?
// Använd URL-parameter för att välja ut vilken frukt som ska ändras
// Använd BODY för att skicka det nya objektet som vi ska ersätta det gamla med
// Möjliga resultat:
// 200 om allt är grönt
// 400 - om body inte är ett frukt-objekt
// 404 - om man skriver ett id som det inte finns en frukt för


export default router
