import express from 'express';
import {createReadStream} from 'fs';
import crypto from 'crypto';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import fetch from "node-fetch";
import pug from 'pug';
import puppeteer from 'puppeteer';
import appSrc from './app.js';

const app = appSrc(express, bodyParser, createReadStream, crypto, http, mongoose, fetch, pug, puppeteer);

app.listen(process.env.PORT || 3000);