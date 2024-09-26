import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS
    app.enableCors({
        origin: 'http://localhost:3000', // Allow requests from this origin
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
        credentials: true, // Allow credentials if needed
    });

    await app.listen(8082, () => console.log(`Server running on port 8082`));
}

bootstrap();
