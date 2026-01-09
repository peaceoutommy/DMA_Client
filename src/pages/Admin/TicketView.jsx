import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Image, Video, File, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { useTicket } from '@/hooks/useTicket';
import { useCloseTicket } from '@/hooks/useTicket';

export default function TicketView() {
    const { id } = useParams();
    const { data, isLoading } = useTicket(id);
    const [processing, setProcessing] = useState(false);

    console.log(data)

    const [ticketCloseDto, setTicketCloseDto] = useState({
        id: id,
        message: '',
        status: ''
    });

    const closeTicketMutation = useCloseTicket();

    const getFileIcon = (fileType) => {
        switch (fileType) {
            case 'IMAGE' || 'CAMPAIGN_IMAGE':
                return <Image className="w-5 h-5" />;
            case 'VIDEO':
                return <Video className="w-5 h-5" />;
            case 'DOCUMENT':
                return <FileText className="w-5 h-5" />;
            default:
                return <File className="w-5 h-5" />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleApprove = async () => {
        if (!ticketCloseDto.message.trim()) {
            return;
        }

        setTicketCloseDto({ ...ticketCloseDto, status: 'APPROVED' });
        await closeTicketMutation.mutateAsync(ticketCloseDto);
    };

    const handleReject = async () => {
        if (!ticketCloseDto.message.trim()) {
            return;
        }
        setTicketCloseDto({ ...ticketCloseDto, status: 'REJECTED' });
        await closeTicketMutation.mutateAsync(ticketCloseDto);
    };

    if (isLoading) {
        return <div>Loading ticket details...</div>;
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Ticket Details</h1>
                        <p className="text-gray-500 mt-1">Review and manage ticket submission</p>
                    </div>
                    <Badge className="text-sm px-4 py-2">
                        {data.ticket.status}
                    </Badge>
                </div>

                {/* Ticket Information Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-xl">{data.ticket.name}</CardTitle>
                                <CardDescription className="mt-2 space-y-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-medium">Type:</span>
                                        <span>{data.ticket.type}</span>
                                    </div>
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Created:</span>
                                <span className="text-gray-600">{formatDate(data.ticket.createDate)}</span>
                            </div>

                            {data.ticket.closeDate && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="font-medium text-gray-700">Closed:</span>
                                    <span className="text-gray-600">{formatDate(data.ticket.closeDate)}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="font-semibold text-sm text-gray-700 mb-2">Additional information:</h3>
                            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm leading-relaxed">
                                {data.ticket.additionalInfo || <div className="text-gray-400 italic">No additional information provided.</div>}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-sm text-gray-700 mb-2">Close message</h3>
                            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm leading-relaxed">
                                {data.ticket.message}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attached Files Card */}
                {data.files.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Attached Files ({data.files.length})</CardTitle>
                            <CardDescription>Documents and media submitted with this ticket</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {data.files.map((file) => (
                                    <div
                                        key={file.id}
                                        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        {file.fileType === 'IMAGE' || file.fileType === 'CAMPAIGN_IMAGE' ? (
                                            <img
                                                src={file.url}
                                                alt={`Attachment ${file.id}`}
                                                className="w-full h-48 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                                                {getFileIcon(file.fileType)}
                                            </div>
                                        )}
                                        <div className="p-3 bg-white">
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-600">{file.fileType}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Action Card */}
                {data.ticket.status === 'PENDING' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Take Action</CardTitle>
                            <CardDescription>Approve or reject this ticket with a closing message</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label htmlFor="closeMessage" className="block text-sm font-medium text-gray-700 mb-2">
                                    Close Message *
                                </label>
                                <Textarea
                                    id="closeMessage"
                                    placeholder="Enter a message explaining your decision..."
                                    value={ticketCloseDto.message}
                                    onChange={(e) => setTicketCloseDto({ ...ticketCloseDto, message: e.target.value })}
                                    rows={4}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={handleApprove}
                                    disabled={processing}
                                    variant="default"
                                    className="flex-1"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    {processing ? 'Processing...' : 'Approve Ticket'}
                                </Button>
                                <Button
                                    onClick={handleReject}
                                    disabled={processing}
                                    variant="destructive"
                                    className="flex-1"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    {processing ? 'Processing...' : 'Reject Ticket'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
};