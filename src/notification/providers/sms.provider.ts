import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class SmsProvider {
  private readonly logger = new Logger(SmsProvider.name);
  private sns: AWS.SNS;

  constructor(private configService: ConfigService) {
    this.sns = new AWS.SNS({
      region: this.configService.get('AWS_REGION'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async sendSms(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const params = {
        PhoneNumber: phoneNumber,
        Message: message,
        MessageAttributes: {
          'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: this.configService.get('SMS_SENDER_ID'),
          },
          'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional',
          },
        },
      };

      await this.sns.publish(params).promise();
      this.logger.log(`SMS sent successfully to: ${phoneNumber}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send SMS to ${phoneNumber}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }
}
