const express = require('express');
const swap = require('../models/swap');
const router = express.Router();
const {authMiddleware} = require('./user');

router.post('/change', authMiddleware, async (req, res) => {
  const { receiverid, skilloffer, skillgiven } = req.body;
  const swaps = await swap.create({
    senderid: req.user.id,
    receiverid,
    skilloffer,
    skillgiven,
  });
  res.json(swaps);
});

router.get('/change', authMiddleware, async (req, res) => {
  const swaps = await swap.findAll({
    where: { senderid: req.user.id },
  });
  res.json(swaps);
});

//sent 
router.get('/sent', authMiddleware, async (req, res) => {
  const sent = await swap.findAll({ where: { senderid: req.user.id } });
  res.json(sent);
});

//received
router.get('/received', authMiddleware, async (req, res) => {
  const received = await swap.findAll({ where: { receiverid: req.user.id } });
  res.json(received);
});


module.exports = router;