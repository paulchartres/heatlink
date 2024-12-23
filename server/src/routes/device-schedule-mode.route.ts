import {Request, Response, Router} from 'express';
import {updateDevice} from "../services/heatzy";

const router = Router();

/**
 * @swagger
 * /device/{deviceId}/schedule-mode:
 *   post:
 *     summary: Sets the schedule mode of a specific device.
 *     description: Sets the schedule mode of a specific device.
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enable:
 *                 type: boolean
 *                 description: Whether the scheduling mode should be enabled
 *                 example: true
 *     responses:
 *       200:
 *         description: The device's schedule mode has been updated
 */
router.post('/device/:deviceId/schedule-mode', function (req: Request, res: Response) {
    const enable: boolean = req.body?.enable;

    if (enable == null) {
        res.sendStatus(400);
        return;
    }

    updateDevice(req.params.deviceId, {
        attrs: {
            timer_switch: enable ? 1 : 0
        }
    }).then(() => {
        res.send();
    }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;