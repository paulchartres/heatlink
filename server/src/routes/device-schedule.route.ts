import {Request, Response, Router} from 'express';
import {updateDevice} from "../services/heatzy";
import {convertReadableScheduleToHeatzyFormat} from "../converters/schedule";

const router = Router();

/**
 * @swagger
 * /device/{deviceId}/schedule:
 *   post:
 *     summary: Updates the heating schedule of a specific device.
 *     description: Updates the heating schedule of a specific device.
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device whose schedule should be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/HeatingSchedule'
 *     responses:
 *       200:
 *         description: The heating schedule has been updated
 */
router.post('/device/:deviceId/schedule', function (req: Request, res: Response) {
    updateDevice(req.params.deviceId, {
        attrs: {
            ...convertReadableScheduleToHeatzyFormat(req.body)
        }
    }).then(() => {
        res.send();
    }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;