import {Request, Response, Router} from 'express';
import {updateDevice} from "../services/heatzy";

const router = Router();

/**
 * @swagger
 * /device/{deviceId}/target/comfort:
 *   post:
 *     summary: Changes the target comfort temperature of a specific device.
 *     description: Changes the target comfort temperature of a specific device.
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device whose target comfort temperature should be changed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperature:
 *                 type: number
 *                 format: float
 *                 description: The target temperature of the comfort mode
 *                 example: 18
 *     responses:
 *       200:
 *         description: The comfort target temperature has been updated
 */
router.post('/device/:deviceId/target/comfort', function (req: Request, res: Response) {
    const targetTemperature: number = parseFloat(req.body?.temperature);

    if (!targetTemperature) {
        res.sendStatus(400);
        return;
    }

    updateDevice(req.params.deviceId, {
        attrs: {
            cft_temp: targetTemperature * 10
        }
    }).then(() => {
        res.send();
    }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;