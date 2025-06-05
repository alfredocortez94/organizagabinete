import helmet from "helmet";
import rateLimit from "express-rate-limit";
import app from './config/express';

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Organiza Gabinete API rodando na porta ${PORT}`);
});
