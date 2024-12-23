import {Request, Response, Router} from 'express';
import {getDeviceInfo} from "../services/heatzy";

const router = Router();

/**
 * @swagger
 * /raw/device/{deviceId}:
 *   get:
 *     summary: Retrieves the stripped and readable information relative to a specific device.
 *     description: Retrieves the raw Heatzy information relative to a specific device, using the device's did (device ID). Another endpoint is available to retrieve stripped and readable data. The heating schedule is expressed in readable hours in this payload.
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device to retrieve
 *     responses:
 *       200:
 *         description: Readable device information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeviceInfo'
 */
router.get('/raw/device/:deviceId', function (req: Request, res: Response) {
    getDeviceInfo(req.params.deviceId).then((deviceInfo) => {
        res.send(deviceInfo);
    }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;