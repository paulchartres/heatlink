import {Request, Response, Router} from 'express';
import {getWeatherInRange} from "../services/open-meteo";

const router = Router();

/**
 * @swagger
 * /weather/range:
 *   post:
 *     summary: Retrieves weather data in a specific range.
 *     description: Retrieves weather data in a specific range at the location provided in the environment variables. If no variables are set, returns an error code in order not to display the values in the webapp.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTimestamp:
 *                 type: integer
 *                 description: The start of the interval as a timestamp in seconds
 *                 example: 1672444800
 *               endTimestamp:
 *                 type: integer
 *                 description: The end of the interval as a timestamp in seconds
 *                 example: 1672531200
 *               deviceId:
 *                 type: string
 *                 description: The device whose history is being viewed. Used to prevent extra past data from being loaded.
 *                 example: DEVICE_ID
 *     responses:
 *       200:
 *         description: The weather data in the provided range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WeatherHistory'
 */
router.post('/weather/range', function (req: Request, res: Response) {
    const startTimestamp: number = req.body?.startTimestamp;
    const endTimestamp: number = req.body?.endTimestamp;
    const deviceId: string = req.body?.deviceId;

    if (!startTimestamp || !endTimestamp || !deviceId) {
        res.sendStatus(400);
        return;
    }

    getWeatherInRange(startTimestamp, endTimestamp, deviceId).then((weatherHistory) => {
        if (!weatherHistory) {
            res.sendStatus(404);
        } else {
            res.send(weatherHistory);
        }
    });
});

export default router;