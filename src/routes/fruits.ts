import express from 'express'
import type { Router } from 'express'

const router: Router = express.Router()

interface Fruit {
	id: string;
	name: string;
	price: number;
}
const data: Fruit[] = []
router.get('/', (req, res) => {
	res.send(data)
})

export default router
