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

    app.use('/render/*', (req, res) => {
        console.log("--- start render here");

        console.log("headers: ", req.headers);
        console.log("method:", req.method);
        console.log("body: ", req.body);
        console.log("query: ", req.query);

        let random2 = req.body.random2;
        let random3 = req.body.random3;
        const addr = req.query.addr;

        console.log("random2: ", random2);
        console.log("random3: ", random3);
        console.log("addr: ", addr);

        if (random2 === undefined) {
            random2 = '0.4433';
        }

        if (random3 === undefined) {
            random3 = '0.1199';
        }

        fetch(addr).then(async content => {
            const template = await content.text();

            console.log("template: ", template);

            const render = pug.render(template, {random2, random3});

            setHeaders(res);
            res.set({'Content-Type': 'text/html; charset=utf-8'});

            console.log(render);

            res.end(render);
        }).catch(e => console.error(e));
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