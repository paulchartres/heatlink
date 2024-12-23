import {Request, Response, Router} from 'express';
import {getDevices} from "../services/heatzy";

const router = Router();

/**
 * @swagger
 * /raw/devices:
 *   get:
 *     summary: Retrieves the raw Heazty list of devices associated to your account.
 *     description: Retrieves the full, unaltered list of devices linked to your account. Another endpoint is available with more concise and readable data.
 *     responses:
 *       200:
 *         description: A list of raw devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 */
router.get('/raw/devices', function (req: Request, res: Response) {
    getDevices().then((devices) => {
        res.send(devices);
    }).catch(() => {
        res.sendStatus(404);
    });
});

export default router;