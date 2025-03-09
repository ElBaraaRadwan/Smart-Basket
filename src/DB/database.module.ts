import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: `mongodb+srv://${config.get('DB_USER')}:${config.get('DB_PASS')}@cluster0.ubrki.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('✅ Successfully connected to MongoDB!');
          });

          connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err.message}`);
          });

          return connection;
        },
        serverApi: {
          version: '1', // Equivalent to `ServerApiVersion.v1`
          strict: true,
          deprecationErrors: true,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
