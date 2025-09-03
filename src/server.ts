import express from 'express'
import type { Express } from 'express'
import fruitsRouter from './routes/fruits.js'

const app: Express = express()
const port = 1337  // byt portnummer om den är upptagen på din dator


app.use('/fruits', fruitsRouter)


app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`)
})

