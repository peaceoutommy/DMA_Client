import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { Separator } from '@/components/ui/separator';
import { EuroIcon } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';

export default function DonationModal({ open, onClose, onSave, campaign, newDonation, setNewDonation, clientSecret, stripePromise, onPayment }) {
    const presetAmounts = [5, 25, 50, 100, 250, 500];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Support This Campaign</DialogTitle>
                    <DialogDescription>
                        Choose an amount to donate to {campaign?.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Preset Amounts */}
                    <div className="space-y-3">
                        <Label>Select Amount</Label>
                        <div className="grid grid-cols-3 gap-3">
                            {presetAmounts.map((amount) => (
                                <Button
                                    key={amount}
                                    variant={newDonation?.amount === amount ? 'default' : 'outline'}
                                    onClick={() => setNewDonation({ ...newDonation, amount: amount })}
                                    className="h-16 text-lg font-semibold"
                                >
                                    €{amount}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Custom Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="custom-amount">Or Enter Custom Amount</Label>
                        <div className="relative">
                            <EuroIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="custom-amount"
                                type="number"
                                placeholder="0.00"
                                value={newDonation?.amount || ''}
                                onChange={(e) => setNewDonation({ ...newDonation, amount: e.target.value })}
                                className="pl-9"
                                min="1"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        onClick={onSave}
                        disabled={!newDonation?.amount || parseFloat(newDonation?.amount) <= 0}
                    >
                        Procceed to payment
                    </Button>
                </DialogFooter>

                {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm campaignId={campaign.id} onPayment={onPayment} />
                    </Elements>
                )}

            </DialogContent>
        </Dialog>
    );
}