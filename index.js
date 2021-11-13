import express from 'express';
import fs from 'fs';
import crypto from 'crypto';
import http from 'http';
import https from 'https';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import fetch from "node-fetch";
import pug from 'pug';
import puppeteer from 'puppeteer';
import appSrc from './app.js';

const privateKey = fs.readFileSync('key.pem');
const certificate = fs.readFileSync('cert.pem');

const app = appSrc(express, bodyParser, fs.createReadStream, crypto, http, mongoose, fetch, pug, puppeteer);

app.listen(80);

https.createServer({key: privateKey, cert: certificate, passphrase: 'wow123'}, app).listen(443);