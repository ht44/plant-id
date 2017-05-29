'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('auth/login.html');
});

router.post('/', (req, res) => {
  router.post('/', (req, res) => {
    res.render('index.html', { title: 'Node SDK' });
  });});

module.exports = router;
