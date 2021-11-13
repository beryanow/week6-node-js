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

    app.post('/render/', proxy('http://34.125.115.36'));

    app.use('/code/', proxy('http://34.125.115.36'));

    app.use('/sha1/:input/', proxy('http://34.125.115.36'));

    app.use('/req/', proxy('http://34.125.115.36'));

    app.use('/wordpress/*', proxy('http://35.244.37.27/wp-json/wp/v2/'));

    app.use((_, res) => {
        setHeaders(res);
        res.end('itmo337221');
    });

    return app;
}