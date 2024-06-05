import express from 'express';
import controller from '../controllers/posts';
const router = express.Router();

router.get('/getClockAngle', (req, res) => {
    const { hh_mm } = req.body
    const response = controller.getClockAngle(hh_mm)

    return res.status(200).json({
        response: response
    });
});

router.get('/getQuestionPart', (req, res) => {
    const { phrases } = req.body
    const response = controller.getQuestionPart(phrases)

    return res.status(200).json({
        response: response
    });
});

router.get('/quickestPath', (req, res) => {
    const { ladders, snakes } = req.body
    const response = controller.quickestPath({ ladders, snakes })

    return res.status(200).json({
        response: response
    });
});


router.get('/minEnergy', (req, res) => {
    const { start, shops, stations, target } = req.body
    const response = controller.minEnergy(start, shops, stations, target)

    return res.status(200).json({
        response: response
    });
});


export = router;