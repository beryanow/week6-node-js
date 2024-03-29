import express from 'express';
import fs from 'fs';
import crypto from 'crypto';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import fetch from "node-fetch";
import pug from 'pug';
import puppeteer from 'puppeteer';
import appSrc from './app.js';

const app = appSrc(express, bodyParser, fs.createReadStream, crypto, http, mongoose, fetch, pug, puppeteer);

app.listen(8080);