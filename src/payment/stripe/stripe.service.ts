import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

// Create an interface that extends PaymentIntent to include expanded fields
interface PaymentIntentWithExpanded extends Stripe.PaymentIntent {
  charges?: Stripe.ApiList<Stripe.Charge>;
}

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2025-03-31.basil', // Use the latest API version
    });
  }

  /**
   * Create a payment intent
   * @param amount The amount in dollars (will be converted to cents for Stripe)
   * @param currency The currency code (default: usd)
   * @param metadata Optional metadata to attach to the payment intent
   * @returns A Stripe payment intent object
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata: Record<string, string> = {},
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert dollars to cents
        currency,
        metadata,
        // You can add automatic_payment_methods: { enabled: true } for automatic payment method selection
      });

      this.logger.log(`Created payment intent: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Error creating payment intent: ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieve a payment intent by ID
   * @param paymentIntentId The ID of the payment intent to retrieve
   * @returns A Stripe payment intent object
   */
  async getPaymentIntent(
    paymentIntentId: string,
  ): Promise<PaymentIntentWithExpanded> {
    try {
      return (await this.stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['charges'], // This adds the charges property to the response
      })) as PaymentIntentWithExpanded;
    } catch (error) {
      this.logger.error(`Error retrieving payment intent: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a payment intent
   * @param paymentIntentId The ID of the payment intent to update
   * @param updateData The data to update
   * @returns The updated payment intent
   */
  async updatePaymentIntent(
    paymentIntentId: string,
    updateData: Stripe.PaymentIntentUpdateParams,
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.update(
        paymentIntentId,
        updateData,
      );
    } catch (error) {
      this.logger.error(`Error updating payment intent: ${error.message}`);
      throw error;
    }
  }

  /**
   * Confirm a payment intent with a payment method
   * @param paymentIntentId The ID of the payment intent to confirm
   * @param paymentMethodId The ID of the payment method to use
   * @returns The confirmed payment intent
   */
  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });
    } catch (error) {
      this.logger.error(`Error confirming payment intent: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cancel a payment intent
   * @param paymentIntentId The ID of the payment intent to cancel
   * @returns The canceled payment intent
   */
  async cancelPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error) {
      this.logger.error(`Error canceling payment intent: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a refund for a payment intent
   * @param paymentIntentId The ID of the payment intent to refund
   * @param amount Optional amount to refund (in dollars). If not specified, the entire payment will be refunded.
   * @returns A Stripe refund object
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
  ): Promise<Stripe.Refund> {
    try {
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundParams.amount = Math.round(amount * 100); // Convert dollars to cents
      }

      const refund = await this.stripe.refunds.create(refundParams);
      this.logger.log(
        `Created refund: ${refund.id} for payment intent: ${paymentIntentId}`,
      );
      return refund;
    } catch (error) {
      this.logger.error(`Error creating refund: ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieve a refund by ID
   * @param refundId The ID of the refund to retrieve
   * @returns A Stripe refund object
   */
  async getRefund(refundId: string): Promise<Stripe.Refund> {
    try {
      return await this.stripe.refunds.retrieve(refundId);
    } catch (error) {
      this.logger.error(`Error retrieving refund: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a customer in Stripe
   * @param email The customer's email
   * @param name Optional customer name
   * @param metadata Optional metadata to attach to the customer
   * @returns A Stripe customer object
   */
  async createCustomer(
    email: string,
    name?: string,
    metadata?: Record<string, string>,
  ): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata,
      });
      this.logger.log(`Created customer: ${customer.id}`);
      return customer;
    } catch (error) {
      this.logger.error(`Error creating customer: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a customer in Stripe
   * @param customerId The ID of the customer to update
   * @param updateData The data to update
   * @returns The updated customer
   */
  async updateCustomer(
    customerId: string,
    updateData: Stripe.CustomerUpdateParams,
  ): Promise<Stripe.Customer> {
    try {
      return await this.stripe.customers.update(customerId, updateData);
    } catch (error) {
      this.logger.error(`Error updating customer: ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieve a customer by ID
   * @param customerId The ID of the customer to retrieve
   * @returns A Stripe customer object
   */
  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);

      // Type narrowing: check if customer is not deleted
      if ((customer as Stripe.DeletedCustomer).deleted) {
        throw new Error(`Customer with ID ${customerId} has been deleted`);
      }

      return customer as Stripe.Customer;
    } catch (error) {
      this.logger.error(`Error retrieving customer: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a payment method in Stripe
   * @param paymentMethodData The payment method data
   * @returns A Stripe payment method object
   */
  async createPaymentMethod(
    paymentMethodData: Stripe.PaymentMethodCreateParams,
  ): Promise<Stripe.PaymentMethod> {
    try {
      return await this.stripe.paymentMethods.create(paymentMethodData);
    } catch (error) {
      this.logger.error(`Error creating payment method: ${error.message}`);
      throw error;
    }
  }

  /**
   * Attach a payment method to a customer
   * @param paymentMethodId The ID of the payment method to attach
   * @param customerId The ID of the customer to attach the payment method to
   * @returns The attached payment method
   */
  async attachPaymentMethodToCustomer(
    paymentMethodId: string,
    customerId: string,
  ): Promise<Stripe.PaymentMethod> {
    try {
      return await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
    } catch (error) {
      this.logger.error(`Error attaching payment method: ${error.message}`);
      throw error;
    }
  }

  /**
   * Detach a payment method from a customer
   * @param paymentMethodId The ID of the payment method to detach
   * @returns The detached payment method
   */
  async detachPaymentMethod(
    paymentMethodId: string,
  ): Promise<Stripe.PaymentMethod> {
    try {
      return await this.stripe.paymentMethods.detach(paymentMethodId);
    } catch (error) {
      this.logger.error(`Error detaching payment method: ${error.message}`);
      throw error;
    }
  }

  /**
   * List payment methods for a customer
   * @param customerId The ID of the customer
   * @param type The type of payment method to list (e.g., 'card')
   * @returns A list of payment methods
   */
  async listPaymentMethods(
    customerId: string,
    type:
      | 'card'
      | 'sepa_debit'
      | 'acss_debit'
      | 'au_becs_debit'
      | 'bacs_debit'
      | 'bancontact' = 'card',
  ): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
    try {
      return await this.stripe.customers.listPaymentMethods(customerId, {
        type,
      });
    } catch (error) {
      this.logger.error(`Error listing payment methods: ${error.message}`);
      throw error;
    }
  }

  /**
   * Construct an event from a webhook payload
   * @param payload The raw request body from Stripe
   * @param signature The Stripe signature from the request headers
   * @param webhookSecret The webhook secret for validation
   * @returns A validated Stripe event
   */
  async constructEventFromPayload(
    payload: Buffer,
    signature: string,
    webhookSecret: string,
  ): Promise<Stripe.Event> {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (error) {
      this.logger.error(`Error constructing webhook event: ${error.message}`);
      throw error;
    }
  }
}
