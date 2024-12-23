import {Request, Response, Router} from 'express';
import {updateDevice} from "../services/heatzy";

const router = Router();

/**
 * @swagger
 * /device/{deviceId}/lock:
 *   post:
 *     summary: Locks the physical interface of a specific device.
 *     description: Locks the physical interface of a specific device. This doesn't affect the device in the dashboard.
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The device has been locked
 */
router.post('/device/:deviceId/lock', function (req: Request, res: Response) {
    updateDevice(req.params.deviceId, {
        attrs: {
            lock_switch: 1
        }
    }).then(() => {
        res.send();
    }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;