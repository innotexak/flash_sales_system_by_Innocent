import axios, { AxiosResponse } from 'axios';
import { PAYSTACK_BASE_URL, PAYSTACK_SECRET_KEY } from "../config/config.js";
import __Payment, { IPayment, ITransactionEnum } from "../models/payment.js";
import __Purchase, {IPurchase} from '../models/purchase.js'



class PaystackPaymentService {
    
    private async makeRequest(method: string, path: string, data?: any): Promise<any> {
        console.log(`${PAYSTACK_BASE_URL}${path}`, )
        try {
            const response = await axios({
                method,
                url: `${PAYSTACK_BASE_URL}${path}`, 
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
                data,
            });
            return response.data.data; // Access data property
        } catch (error: any) {
            console.error(`Paystack API error (${method} ${path}):`, error.response?.data || error.message);
            throw error; // Re-throw for handling at the caller level
        }
    }

    async processWebhook(payload: { event: string, data: any }): Promise<void> {
        const reference = payload.data.reference;
        switch (payload.event) {
            case 'charge.success':
                return this.processData(payload.data);
            case 'charge.failed':
                await __Payment.updateOne({ _id: reference }, { $set: { status: ITransactionEnum.Failed } });
                break;

            default:
                console.log("Unable to process webhook");
                break;
        }
    }

    //In code 
    async InitializePurchasePayment(payload: { email: string; amount:number, metadata?: any }): Promise<any> {
        try {
            const { email, metadata, amount } = payload;
            const initResponse = await this.makeRequest('POST', '/transaction/initialize', {
                email,
                amount:amount * 100,
                currency:"NGN",
                metadata,
                
            });

            return initResponse;

        } catch (error) {
            console.error("Error creating Paystack subscription:", error);
            throw error;
        }
    }


    async verifyTransaction(reference: string): Promise<any> {
        try {
            const response: AxiosResponse<any> = await axios.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.data; // Access data property
        } catch (error) {
            console.log(error);
            throw new Error('Failed to verify transaction');
        }
    }

    async processData(data: Record<string, any>) {
        const isTransaction = await __Payment.findById(data.reference);
        if (!isTransaction) {
            console.log(JSON.stringify(data, null, 2), "Error processing payment");
            return;
        }

        const formattedPayload: Record<string, any> = {
            userId: isTransaction.userId,
            paymentId: isTransaction._id,
            amount: isTransaction.amount,
        };

        try {
            await __Purchase.create(formattedPayload);

            isTransaction.status = ITransactionEnum.Success;
            await isTransaction.save();
        } catch (error) {
            console.error("Error processing subscription:", error);
        }
    }

}

export default PaystackPaymentService;