import {Request, Response, Router} from 'express';
import {updateDevice} from "../services/heatzy";

const router = Router();

/**
 * @swagger
 * /device/{deviceId}/vacancy:
 *   post:
 *     summary: Enables vacancy mode for a specific device.
 *     description: Enables vacancy mode for a specific device, for a certain amount of time (in days).
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device that should be set to vacancy mode.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               duration:
 *                 type: integer
 *                 description: The duration (in days) of the vacancy
 *                 example: 7
 *     responses:
 *       200:
 *         description: Vacancy mode has been enabled
 */
router.post('/device/:deviceId/vacancy', function (req: Request, res: Response) {
    const duration: number = parseFloat(req.body?.duration);

    if (!duration) {
        res.sendStatus(400);
        return;
    }

    updateDevice(req.params.deviceId, {
        attrs: {
            derog_mode: 1,
            derog_time: duration
        }
    }).then(() => {
        res.send();
    }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;