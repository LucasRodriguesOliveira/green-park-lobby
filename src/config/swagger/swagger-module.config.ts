import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger/dist';
import { SwaggerConfig } from '../env/swagger.config';
import { swaggerTags } from './swagger-tags.config';

export function createSwaggerConfig(
  app: INestApplication,
  configService: ConfigService,
): OpenAPIObject {
  const { appName, description, version } =
    configService.get<SwaggerConfig>('swagger');

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth({
      type: 'http',
      description: 'token',
      bearerFormat: 'JWT',
      scheme: 'bearer',
    });

  swaggerTags.forEach((tag) => {
    config.addTag(tag);
  });

  return SwaggerModule.createDocument(app, config.build());
}
