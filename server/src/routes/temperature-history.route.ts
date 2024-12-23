import {Request, Response, Router} from 'express';
import {getTemperatureHistory} from "../services/database";

const router = Router();

/**
 * @swagger
 * /device/{deviceId}/history/temperature:
 *   post:
 *     summary: Retrieves the temperature history of a device in a requested interval.
 *     description: Retrieves the temperature history of a device in a requested interval. The start and end values should be specified as timestamps (seconds).
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device whose temperature history should be retrieved
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
 *     responses:
 *       200:
 *         description: Temperature history for the requested device
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TemperatureHistory'
 */
router.post('/device/:deviceId/history/temperature', function (req: Request, res: Response) {
    const startTimestamp: number = req.body?.startTimestamp;
    const endTimestamp: number = req.body?.endTimestamp;

    if (!startTimestamp || !endTimestamp) {
        res.sendStatus(400);
        return;
    }

    getTemperatureHistory(startTimestamp, endTimestamp, req.params.deviceId).then((history) => {
        res.send(history);
    });
});

export default router;