import {Request, Response, Router} from 'express';
import {getPreset, savePreset} from "../services/database";

const router = Router();

/**
 * @swagger
 * /preset:
 *   post:
 *     summary: Saves a new heating schedule preset.
 *     description: Saves a new heating schedule preset. The name acts as the identification key, so duplicates aren't allowed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PresetRequest'
 *     responses:
 *       200:
 *         description: The preset has been saved
 *       409:
 *         description: Preset name already in use
 */
router.post('/preset', function (req: Request, res: Response) {
    const name = req.body?.name;
    const description = req.body?.description;
    const schedule = req.body?.schedule;

    if (!name || !schedule) {
        res.sendStatus(400);
    }

    getPreset(name).then((preset) => {
        if (preset) {
            res.sendStatus(409);
        } else {
            savePreset(name, description, JSON.stringify(schedule)).then(() => {
                res.send();
            }).catch(() => {
                res.sendStatus(404);
            });
        }
    })

});

export default router;