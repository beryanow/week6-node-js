import proxy from "express-http-proxy";

export default function appSrc(express, bodyParser, createReadStream, crypto, http, mongoose, fetch, pug, puppeteer) {
    const UserSchema = mongoose.Schema({login: String, password: String})
    const UserModel = mongoose.model('User', UserSchema);

    const receiveQueryAddrData = (addrQueryParam, res) => {
        http.get(addrQueryParam, (queryRes) => {
            queryRes.setEncoding('utf8');
            let queryData = '';

            queryRes.on('data', (queryDataChunk) => {
                queryData += queryDataChunk;
            });

            queryRes.on('end', () => {
                res.end(queryData);
            });
        });
    };

    const setHeaders = (res) => {
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE'
        });
    };

    const app = express();

    app.use(bodyParser());

    app.use('/login/', proxy('http://34.125.115.36'));

    app.get('/test/', proxy('http://34.125.115.36'));

    app.post('/insert/', proxy('http://34.125.115.36'));

    app.post('/render/', (req, res) => {
        const random2 = req.body.random2;
        const random3 = req.body.random3;
        const addr = req.query.addr;

        fetch(addr).then(async content => {
            const template = await content.text();
            const render = pug.render(template,{random2, random3});

            setHeaders(res);
            res.end(render);
        });
    });

    app.use('/code/', proxy('http://34.125.115.36'));

    app.use('/sha1/:input/', proxy('http://34.125.115.36'));

    app.use('/req/', proxy('http://34.125.115.36'));

    app.use('/wordpress/', proxy('https://35.244.37.27', {
        proxyReqPathResolver: (req) => {
            console.log(req.url);
            console.log(req.url.replace("/wordpress/", "/"));
            return req.url.replace("/wordpress/", "/");
        },
        userResDecorator: (proxyRes, proxyResData) => {
            console.log(proxyResData.toString());
            return proxyResData;
        }
    }));

    app.use('/wordpress/*', proxy('https://35.244.37.27', {
        proxyReqPathResolver: (req) => {
            console.log(req.url);
            console.log(req.url.replace("/wordpress/", "/"));
            return req.url.replace("/wordpress/", "/");
        },
        userResDecorator: (proxyRes, proxyResData) => {
            console.log(proxyResData.toString());
            return proxyResData;
        }
    }));

    app.use((_, res) => {
        setHeaders(res);
        res.end('itmo337221');
    });

    return app;
}