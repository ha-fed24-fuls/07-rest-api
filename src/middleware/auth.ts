import type { RequestHandler } from "express";

const authenticate: RequestHandler = ( req, res, next ) => {

	// Om vi är autentiserade: fortsätt (next)
	// Annars: svara med statuskod 401

	// Extra övning: gör så att man kan skicka med användarnamn+lösenord i body

	const forbidden: string[] = ['/secret']

	// Avbryt request-kedjan om vi inte är autentiserade och försöker komma åt en hemlig resurs
	for( let i=0; i<forbidden.length; i++ ) {
		// forbidden[i] kan i teorin vara undefined - använd ! för att säga till typescript att bortse från möjligheten
		if( req.url.startsWith(forbidden[i]!) ) {
			res.sendStatus(401)
			return
		}
	}

	// Fortsätt med nästa middleware/endpoint
	next()
}

export { authenticate }
