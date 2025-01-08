const app = require('./src/app');
const config = require('./src/config/config');

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    console.log(`Preview URL: http://localhost:${config.port}/api/preview/{pkgid}`);
    console.log(`Download PDF URL: http://localhost:${config.port}/api/download/{pkgid}`);
});