import {Request, Response, Router} from 'express';
import {getCurrentWeather} from "../services/open-meteo";

const router = Router();

/**
 * @swagger
 * /weather:
 *   get:
 *     summary: Retrieves the current external temperature at the location set in the environment variables.
 *     description: Retrieves the current external temperature at the location set in the environment variables. If no variables are set, returns an error code in order not to display the values in the webapp.
 *     responses:
 *       200:
 *         description: The current weather
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Weather'
 */
router.get('/weather', function (req: Request, res: Response) {
    getCurrentWeather().then((weather) => {
        if (!weather) {
            res.sendStatus(404);
        } else {
            res.send(weather);
        }
    });
});

export default router;