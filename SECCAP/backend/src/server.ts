import { app } from './app.js';
import { config } from './config.js';
import { logger } from './logger.js';

app.listen(config.PORT, () => {
  logger.info(`SECCAP Backend escuchando en puerto ${config.PORT}`);
});
