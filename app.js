import mongoose from 'mongoose';

export default function appSrc(express, bodyParser, createReadStream, crypto, http) {
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

    app.use('/login/', (_, res) => {
        setHeaders(res);
        res.end('itmo337221');
    });

    app.post('/insert/', (req, res) => {
        const login = decodeURIComponent(req.body.login);
        const password = decodeURIComponent(req.body.password);
        const url = decodeURIComponent(req.body.URL);

        mongoose.connect(url).then(async () => {
            const user = new UserModel({login, password});
            const response = await user.save();

            setHeaders(res);
            res.end(JSON.stringify(response._doc));
        });
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