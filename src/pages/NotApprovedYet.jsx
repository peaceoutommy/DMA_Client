import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NotApprovedYet() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) return <div>Loading...</div>

    return (
        <div className="flex justify-center px-4">
            <Card className="max-w-lg w-full border-2">
                <CardHeader className="text-center space-y-4">
                    <Badge variant="outline" className="mx-auto w-fit">
                        <Clock className="h-3 w-3 mr-2" />
                        Approval Pending
                    </Badge>

                    <CardTitle className="text-3xl font-bold">
                        Your company is not approved yet
                    </CardTitle>

                    <CardDescription className="text-base">
                        Hi {user.firstName}, thanks for signing up!
                        Your company is currently under review by our team.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 text-center">
                    <p className="text-muted-foreground">
                        This usually doesn’t take long. You’ll get access to all features as soon as your company is approved
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Button variant="outline" onClick={() => navigate('/')}>
                            Back to home
                        </Button>
                        <Button onClick={() => window.location.reload()}>
                            Refresh status
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
