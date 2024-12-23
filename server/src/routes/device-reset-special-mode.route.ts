import {Request, Response, Router} from 'express';
import {updateDevice} from "../services/heatzy";

const router = Router();

/**
 * @swagger
 * /device/{deviceId}/reset-special-mode:
 *   post:
 *     summary: Disables any kind of special mode for a specific device.
 *     description: Disables any kind of special mode for a specific device. Includes motion detection, boost or vacancy.
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Special modes have been reset
 */
router.post('/device/:deviceId/reset-special-mode', function (req: Request, res: Response) {
    updateDevice(req.params.deviceId, {
        attrs: {
            derog_mode: 0
        }
    }).then(() => {
        res.send();
    }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;