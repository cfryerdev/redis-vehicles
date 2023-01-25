import UseExpress from './config/express-config';
import UseErrorHandling from './config/error-config';
import UseLogging from './config/logging-config';
import UseSwagger from './config/swagger-config';
import UseRedis from './config/redis-config';
import UseHealthController from './controllers/health-controller';
import UseVehicleController from './controllers/vehicle-controller';
import UseSearchController from './controllers/search-controller';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const port = process.env.PORT || 3000;
const app = UseExpress();
UseSwagger(app);
UseErrorHandling(app);
UseLogging(app);

UseRedis().then(client => {
    UseHealthController(app, client);
    UseVehicleController(app, client);
    UseSearchController(app, client);
});

app.listen(port, () => {
    console.log(`Server running: http://localhost:${port}/api-docs/`)
});