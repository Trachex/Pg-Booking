const app = require('./lib/middleware');
const config = require('./config');

app.listen(config.app.port, () => {
    console.log(`Server is running on port: ${config.app.port}`);
});