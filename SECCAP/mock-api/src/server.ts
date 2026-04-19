import { app } from './app.js';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = parseInt(process.env.MOCK_API_PORT ?? '3002', 10);

app.listen(PORT, () => {
  console.log(`Mock API del Área de Personal escuchando en puerto ${PORT}`);
});
