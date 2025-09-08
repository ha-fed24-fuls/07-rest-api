import express from "express";
import type { Request, Response, Router } from "express";
// import * as z from "zod";

const router: Router = express.Router();

const secretData: number[] = [1, 2, 5]

router.get('/', (req, res: Response<number[]>) => {
	res.send(secretData)
})


export default router
