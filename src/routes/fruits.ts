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

const data: Fruit[] = [
	{ id: 'q1', name: 'purjolök', price: 12 },
	{ id: 'q2', name: 'banan', price: 77 },
	{ id: 'q3', name: 'melon', price: 20 },
]
router.get('/', (req, res) => {
	res.send(data)
})
interface Params {
	id: string;
}
router.get('/:id', (req: Request<Params>, res: Response<Fruit>) => {
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



export default router
