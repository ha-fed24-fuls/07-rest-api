import express from 'express'
import type { Request, Response, Router } from 'express'

const router: Router = express.Router()

interface Fruit {
	id: string;
	name: string;
	price: number;
}
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

export default router
