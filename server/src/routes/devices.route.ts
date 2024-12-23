import {Request, Response, Router} from 'express';
import {getDevices} from "../services/heatzy";
import {DeviceStripped} from "../models/device.stripped";
import {convertHeatzyDeviceToReadable} from "../converters/device";

const router = Router();

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Retrieves the stripped and readable list of devices associated to your account.
 *     description: Retrieves the stripped and readable list of devices linked to your account. Another endpoint is available to retrieve unaltered Heatzy data.
 *     responses:
 *       200:
 *         description: A list of stripped devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeviceStripped'
 */
router.get('/devices', function (req: Request, res: Response) {
    getDevices().then((devices) => {
        res.send(
            devices.map((device): DeviceStripped => {
                return convertHeatzyDeviceToReadable(device);
            })
        );
    }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;