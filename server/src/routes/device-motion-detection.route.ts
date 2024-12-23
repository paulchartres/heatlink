import {Request, Response, Router} from 'express';
import {updateDevice} from "../services/heatzy";

const router = Router();

/**
 * @swagger
 * /device/{deviceId}/motion-detection:
 *   post:
 *     summary: Enables motion detection mode for a specific device.
 *     description: Enables motion detection mode for a specific device.
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Motion detection mode for the selected device has been enabled
 */
router.post('/device/:deviceId/motion-detection', function (req: Request, res: Response) {
    updateDevice(req.params.deviceId, {
        attrs: {
            derog_mode: 3
        }
    }).then(() => {
        res.send();
    }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;