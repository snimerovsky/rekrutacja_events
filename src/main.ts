import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule, { cors: false });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true
    }))

    app.use(cookieParser());

    const config = new DocumentBuilder()
        .setTitle("Rekrutacja")
        .setDescription("REST Api Documentation")
        .addBearerAuth()
        .setVersion('1.0.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
}
bootstrap();
