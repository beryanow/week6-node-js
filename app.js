import mongoose from 'mongoose';

export default function appSrc(express, bodyParser, createReadStream, crypto, http) {
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

    app.use('/login/', (_, res) => {
        setHeaders(res);
        res.end('itmo337221');
    });

    app.post('/insert/', (req, _) => {
        const login = req.body.login;
        const password = req.body.password;
        const url = req.body.URL;

        mongoose.connect(url).then(async () => {
                const User = mongoose.model('User', {login: String, password: String});
                const user = new User({login, password});
                await user.save();
            }
        );
    });

    app.use('/code/', (_, res) => {
        const currentFilePath = import.meta.url.substring(7);
        const readStream = createReadStream(currentFilePath);

        setHeaders(res);
        readStream.on('open', () => readStream.pipe(res));
    });

    app.use('/sha1/:input/', (req, res) => {
        const sha1Creator = crypto.createHash('sha1');
        const inputParam = req.params.input;

        sha1Creator.update(inputParam);

        setHeaders(res);
        res.end(sha1Creator.digest('hex'));
    });

    app.use('/req/', (req, res) => {
        let addrQueryParam;

        if (req.method === 'GET') {
            addrQueryParam = req.query.addr;
        } else if (req.method === 'POST') {
            addrQueryParam = req.body.addr;
        }

        setHeaders(res);
        receiveQueryAddrData(addrQueryParam, res);
    });

    app.use((_, res) => {
        setHeaders(res);
        res.end('itmo337221');
    });

    return app;
}