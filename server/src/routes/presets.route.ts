import {Request, Response, Router} from 'express';
import {getPresets} from "../services/database";

const router = Router();

/**
 * @swagger
 * /presets:
 *   get:
 *     summary: Retrieves all previously saved presets.
 *     description: Retrieves all previously saved presets.
 *     responses:
 *       200:
 *         description: The presets stored for this instance.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Preset'
 */
router.get('/presets', function (req: Request, res: Response) {
    getPresets().then((presets) => {
        res.send(presets);
    });
});

export default router;