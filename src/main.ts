import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {JwtAuthGuard} from "./auth/auth.guard";

async function bootstrap() {

  process.env.TZ = 'UTC';

  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.setGlobalPrefix('/api/v1');
  app.enableCors();
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  await app.listen(process.env.PORT || 9001);
}
bootstrap();
