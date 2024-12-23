import {Request, Response, Router} from 'express';
import {deletePreset, getPreset} from "../services/database";

const router = Router();

/**
 * @swagger
 * /preset:
 *   delete:
 *     summary: Deletes a heating schedule preset.
 *     description: Deletes a heating schedule preset. The name acts as the identification key.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The preset name
 *                 example: Weekends
 *     responses:
 *       200:
 *         description: The preset has been deleted
 *       404:
 *         description: Preset does not exist
 */
router.delete('/preset', function (req: Request, res: Response) {
    const name = req.body?.name;

    if (!name) {
        res.sendStatus(400);
    }

    getPreset(name).then((preset) => {
        if (!preset) {
            res.sendStatus(404);
        } else {
            deletePreset(name).then(() => {
                res.send();
            }).catch(() => {
                res.sendStatus(404);
            });
        }
    })

});

export default router;