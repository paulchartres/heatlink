import {Request, Response, Router} from 'express';
import {HeatingMode} from "../enums/heating-mode";
import {updateDevice} from "../services/heatzy";
import {heatingModeEnumToNumber} from "../converters/enums";

const router = Router();

/**
 * @swagger
 * /device/{deviceId}/mode:
 *   post:
 *     summary: Changes the current heating mode of a specific device.
 *     description: Changes the current heating mode of a specific device.
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device whose mode should be changed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mode:
 *                 $ref: '#/components/schemas/HeatingMode'
 *     responses:
 *       200:
 *         description: The heating mode has been updated
 */
router.post('/device/:deviceId/mode', function (req: Request, res: Response) {
    const mode: HeatingMode = req.body?.mode as HeatingMode;

    if (!mode) {
        res.sendStatus(400);
        return;
    }

    updateDevice(req.params.deviceId, {
        attrs: {
            mode: heatingModeEnumToNumber(mode)
        }
    }).then(() => {
        res.send();
    }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;