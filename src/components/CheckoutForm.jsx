import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { toast } from 'sonner';

export default function CheckoutForm({ campaignId, onPayment }) {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        // Confirm the payment
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required'
        });

        if (error) {
            console.error(error.message);
        } else if (paymentIntent.status === 'succeeded') {
            await onPayment();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement className='bg-background' />
            {stripe &&
                <Button variant="outline" className="mt-2 w-full" disabled={!stripe}>Pay</Button>
            }
        </form>
    );
}