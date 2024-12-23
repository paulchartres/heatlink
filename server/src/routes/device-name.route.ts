import {Request, Response, Router} from 'express';
import {updateDeviceName} from "../services/heatzy";

const router = Router();

/**
 * @swagger
 * /device/{deviceId}/name:
 *   post:
 *     summary: Updates the name of a specific device.
 *     description: Updates the name of a specific device.
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
 *               name:
 *                 type: string
 *                 description: The new name of the device
 *                 example: The Office
 *     responses:
 *       200:
 *         description: The device name has been updated
 */
router.post('/device/:deviceId/name', function (req: Request, res: Response) {
    const name: string = req.body?.name;

    if (!name) {
        res.sendStatus(400);
        return;
    }

    updateDeviceName(req.params.deviceId, name)
        .then(() => {
            res.send();
        }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;