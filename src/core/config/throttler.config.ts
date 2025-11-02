import { registerAs } from '@nestjs/config';

export default registerAs('throttler', () => ({
  ttl: parseInt(process.env.THROTTLER_TTL || '60', 10), // default: 60 seconds
  limit: parseInt(process.env.THROTTLER_LIMIT || '10', 10), // default: 10 requests
}));
