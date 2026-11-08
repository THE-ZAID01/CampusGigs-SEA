const router = require('express').Router();
const auth = require('../middleware/auth');
const env = require('../config/env');
const { CATEGORIES } = require('../controllers/gigController');
const { XP_PER_LEVEL, XP_REWARDS } = require('../utils/levels');

const a = require('../controllers/authController');
const u = require('../controllers/userController');
const g = require('../controllers/gigController');
const b = require('../controllers/bidController');
const e = require('../controllers/escrowController');
const w = require('../controllers/walletController');
const h = require('../controllers/historyController');

router.get('/health', (_req, res) => res.json({ ok: true }));
router.get('/meta', (_req, res) =>
  res.json({
    categories: CATEGORIES,
    allowedDomains: env.allowedDomains,
    feePercent: env.feePercent,
    minWithdraw: env.minWithdraw,
    xpPerLevel: XP_PER_LEVEL,
    xpRewards: XP_REWARDS,
  })
);

// auth
router.post('/auth/register', a.register);
router.post('/auth/login', a.login);
router.post('/auth/forgot', a.forgot);
router.post('/auth/reset', a.reset);
router.get('/auth/me', auth, a.me);

// users
router.get('/users/me', auth, u.getMe);
router.put('/users/me', auth, u.updateMe);
router.get('/users/:id', auth, u.getPublic);

// gigs
router.get('/gigs', auth, g.list);
router.post('/gigs', auth, g.create);
router.get('/gigs/:id', auth, g.get);
router.put('/gigs/:id', auth, g.update);
router.delete('/gigs/:id', auth, g.cancel);

// bids
router.post('/gigs/:id/bids', auth, b.place);
router.get('/bids/mine', auth, b.mine);
router.delete('/bids/:id', auth, b.withdraw);
router.post('/bids/:id/accept', auth, b.accept);

// escrow actions
router.post('/gigs/:id/deliver', auth, e.deliver);
router.post('/gigs/:id/revision', auth, e.revision);
router.post('/gigs/:id/confirm', auth, e.confirm);
router.post('/gigs/:id/leave', auth, e.leave);

// wallet
router.get('/wallet', auth, w.summary);
router.get('/wallet/analytics', auth, w.analytics);
router.get('/wallet/transactions', auth, w.transactions);
router.post('/wallet/topup', auth, w.topup);
router.post('/wallet/withdraw', auth, w.withdraw);

// history
router.get('/history', auth, h.list);

module.exports = router;
