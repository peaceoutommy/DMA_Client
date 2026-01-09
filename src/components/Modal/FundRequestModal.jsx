import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EuroIcon } from 'lucide-react';

export default function FundRequestModal({ open, onClose, campaign, fundRequest, setFundRequest, onSubmit, isLoading }) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Request Funding</DialogTitle>
                    <DialogDescription>
                        Submit a funding request for {campaign?.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Message Field */}
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Explain why you need this funding..."
                            value={fundRequest?.message || ''}
                            onChange={(e) => setFundRequest({ ...fundRequest, message: e.target.value })}
                            className="min-h-[100px]"
                        />
                    </div>

                    {/* Amount Field */}
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount Requested (€)</Label>
                        <div className="relative">
                            <EuroIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                value={fundRequest?.amount || ''}
                                onChange={(e) => setFundRequest({ ...fundRequest, amount: parseFloat(e.target.value) || '' })}
                                className="pl-9"
                                min="1"
                                step="0.01"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isLoading}>Cancel</Button>
                    </DialogClose>
                    <Button
                        onClick={onSubmit}
                        disabled={!fundRequest?.message || !fundRequest?.amount || fundRequest.amount <= 0 || isLoading}
                        isLoading={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Request'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
