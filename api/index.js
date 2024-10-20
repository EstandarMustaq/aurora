const express = require('express');
const app = require('../app');
const serverless = require('serverless-http');

module.exports = serverless(app);

