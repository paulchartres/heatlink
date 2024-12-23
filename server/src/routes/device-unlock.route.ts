import {Request, Response, Router} from 'express';
import {updateDevice} from "../services/heatzy";

const router = Router();

/**
 * @swagger
 * /device/{deviceId}/unlock:
 *   post:
 *     summary: Unlocks the physical interface of a specific device.
 *     description: Unlocks the physical interface of a specific device. This doesn't affect the device in the dashboard.
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The device has been unlocked
 */
router.post('/device/:deviceId/unlock', function (req: Request, res: Response) {
    updateDevice(req.params.deviceId, {
        attrs: {
            lock_switch: 0
        }
    }).then(() => {
        res.send();
    }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;