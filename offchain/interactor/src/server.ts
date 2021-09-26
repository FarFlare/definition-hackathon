process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import 'reflect-metadata';
import App from '@/app';
import { BuyoutController, HealthController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([BuyoutController, HealthController]);
app.listen();
