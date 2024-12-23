import {Request, Response, Router} from 'express';
import {updateDevice} from "../services/heatzy";

const router = Router();

/**
 * @swagger
 * /device/{deviceId}/boost:
 *   post:
 *     summary: Enables boost mode for a specific device.
 *     description: Enables boost mode for a specific device, for a certain amount of time (in minutes).
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device that should be set to boost mode.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               duration:
 *                 type: integer
 *                 description: The duration (in minutes) of the boost
 *                 example: 60
 *     responses:
 *       200:
 *         description: Boost mode has been enabled
 */
router.post('/device/:deviceId/boost', function (req: Request, res: Response) {
    const duration: number = parseFloat(req.body?.duration);

    if (!duration) {
        res.sendStatus(400);
        return;
    }

    updateDevice(req.params.deviceId, {
        attrs: {
            derog_mode: 2,
            derog_time: duration
        }
    }).then(() => {
        res.send();
    }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;