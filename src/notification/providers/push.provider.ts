import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class PushProvider {
  private readonly logger = new Logger(PushProvider.name);
  private readonly firebaseInitialized: boolean;

  constructor(private configService: ConfigService) {
    // Initialize Firebase if not already initialized
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: this.configService.get('FIREBASE_PROJECT_ID'),
            clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
            privateKey: this.configService
              .get('FIREBASE_PRIVATE_KEY')
              ?.replace(/\\n/g, '\n'),
          }),
          databaseURL: this.configService.get('FIREBASE_DATABASE_URL'),
        });
        this.firebaseInitialized = true;
      } else {
        this.firebaseInitialized = true;
      }
    } catch (error) {
      this.logger.error(
        `Failed to initialize Firebase: ${error.message}`,
        error.stack,
      );
      this.firebaseInitialized = false;
    }
  }

  async sendPushNotification(
    deviceToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<boolean> {
    if (!this.firebaseInitialized) {
      this.logger.error('Firebase not initialized');
      return false;
    }

    try {
      const message = {
        notification: {
          title,
          body,
        },
        data: data || {},
        token: deviceToken,
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Push notification sent successfully: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send push notification: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }
}
