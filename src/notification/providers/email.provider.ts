import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class EmailProvider {
  private readonly logger = new Logger(EmailProvider.name);
  private ses: AWS.SES;

  constructor(private configService: ConfigService) {
    this.ses = new AWS.SES({
      region: this.configService.get('AWS_REGION'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    try {
      const params = {
        Source: this.configService.get('EMAIL_FROM_ADDRESS'),
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: body,
              Charset: 'UTF-8',
            },
          },
        },
      };

      await this.ses.sendEmail(params).promise();
      this.logger.log(`Email sent successfully to: ${to}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }
}
