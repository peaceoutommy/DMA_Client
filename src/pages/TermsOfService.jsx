import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="space-y-4 mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                    <p className="text-lg text-muted-foreground">
                        Last updated: November 11, 2025
                    </p>
                </div>

                {/* Introduction */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Agreement to Terms
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground">
                            Welcome to the Donation Management Platform ("Platform", "we", "us", or "our").
                            By accessing or using our Platform, you agree to be bound by these Terms of Service
                            and all applicable laws and regulations. If you do not agree with any of these terms,
                            you are prohibited from using or accessing this Platform.
                        </p>
                    </CardContent>
                </Card>

                {/* Main Terms */}
                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Use of Platform</h2>
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">1.1 Eligibility</h3>
                                    <p className="text-muted-foreground text-sm">
                                        You must be at least 18 years old to use this Platform. By using the Platform,
                                        you represent and warrant that you meet this age requirement.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-2">1.2 Account Registration</h3>
                                    <p className="text-muted-foreground text-sm">
                                        To access certain features, you must register for an account. You agree to
                                        provide accurate, current, and complete information during registration and
                                        to update such information to keep it accurate, current, and complete.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-2">1.3 Account Security</h3>
                                    <p className="text-muted-foreground text-sm">
                                        You are responsible for maintaining the confidentiality of your account
                                        credentials and for all activities that occur under your account.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. Donations and Payments</h2>
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">2.1 Processing Donations</h3>
                                    <p className="text-muted-foreground text-sm">
                                        All donations made through the Platform are final and non-refundable unless
                                        otherwise required by law or stated in our refund policy. We use secure
                                        third-party payment processors to handle all transactions.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-2">2.2 Fees and Charges</h3>
                                    <p className="text-muted-foreground text-sm">
                                        The Platform may charge processing fees on donations. All applicable fees
                                        will be clearly disclosed before you complete a transaction.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-2">2.3 Tax Receipts</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Tax receipts will be issued in accordance with applicable laws. We are not
                                        responsible for providing tax advice. Please consult with a tax professional
                                        regarding the deductibility of your donations.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Intellectual Property</h2>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground text-sm mb-4">
                                    The Platform and its entire contents, features, and functionality are owned by
                                    us or our licensors and are protected by international copyright, trademark,
                                    patent, trade secret, and other intellectual property laws.
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    You may not reproduce, distribute, modify, create derivative works of, publicly
                                    display, publicly perform, republish, download, store, or transmit any of the
                                    material on our Platform without our prior written consent.
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. User Content</h2>
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">4.1 Content Responsibility</h3>
                                    <p className="text-muted-foreground text-sm">
                                        You are solely responsible for any content you submit, post, or display on
                                        the Platform. You retain all rights to your content but grant us a license
                                        to use, display, and distribute it as necessary to provide our services.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-2">4.2 Prohibited Content</h3>
                                    <p className="text-muted-foreground text-sm mb-2">
                                        You may not post content that:
                                    </p>
                                    <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                                        <li className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                            <span>Is illegal, harmful, threatening, abusive, or hateful</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                            <span>Infringes on intellectual property rights</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                            <span>Contains malware or harmful code</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                            <span>Misrepresents your identity or affiliation</span>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Privacy and Data Protection</h2>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground text-sm mb-4">
                                    Your use of the Platform is also governed by our Privacy Policy. We are
                                    committed to protecting your personal information and complying with all
                                    applicable data protection laws, including GDPR.
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    For more information about how we collect, use, and protect your data,
                                    please review our Privacy Policy.
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    <section id="guidelines">
                        <h2 className="text-2xl font-bold mb-4">6. Campaign Guidelines</h2>
                        <Card>
                            <CardHeader>
                                <CardDescription>
                                    Additional terms for organizations creating fundraising campaigns
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">6.1 Campaign Creation Requirements</h3>
                                    <p className="text-muted-foreground text-sm mb-2">
                                        Organizations creating campaigns must:
                                    </p>
                                    <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                            <span>Be a registered nonprofit or charitable organization</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                            <span>Provide accurate and truthful information about their campaigns</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                            <span>Use donated funds solely for the stated campaign purpose</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                            <span>Provide regular updates on campaign progress</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                            <span>Comply with all applicable laws and regulations</span>
                                        </li>
                                    </ul>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-2">6.2 Prohibited Campaigns</h3>
                                    <p className="text-muted-foreground text-sm mb-2">
                                        Campaigns may not be created for:
                                    </p>
                                    <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                                        <li className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                            <span>Illegal activities or purposes</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                            <span>Fraudulent or misleading causes</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                            <span>Political campaigns or lobbying activities</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                            <span>Hate groups or discriminatory organizations</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                            <span>Personal gain or profit</span>
                                        </li>
                                    </ul>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-2">6.3 Fund Distribution</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Donated funds will be transferred to campaign organizations according to our
                                        standard payout schedule, minus applicable fees. Organizations are responsible
                                        for proper accounting and use of all funds received.
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-2">6.4 Campaign Monitoring</h3>
                                    <p className="text-muted-foreground text-sm">
                                        We reserve the right to review, monitor, and remove campaigns that violate
                                        these guidelines or our Terms of Service. We may also suspend or terminate
                                        accounts that repeatedly violate our policies.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground text-sm mb-4">
                                    To the fullest extent permitted by law, we shall not be liable for any indirect,
                                    incidental, special, consequential, or punitive damages, or any loss of profits
                                    or revenues, whether incurred directly or indirectly, or any loss of data, use,
                                    goodwill, or other intangible losses.
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    We are not responsible for the actions of campaign organizers or the use of
                                    donated funds. Donors should conduct their own due diligence before making
                                    donations.
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">8. Dispute Resolution</h2>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground text-sm">
                                    Any disputes arising from these Terms or your use of the Platform shall be
                                    resolved through binding arbitration in accordance with the rules of the
                                    Netherlands Arbitration Institute, and shall be governed by Dutch law.
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground text-sm">
                                    We reserve the right to modify these Terms at any time. We will notify users
                                    of any material changes by posting the new Terms on the Platform and updating
                                    the "Last updated" date. Your continued use of the Platform after such changes
                                    constitutes acceptance of the new Terms.
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground text-sm mb-4">
                                    If you have any questions about these Terms of Service, please contact us at:
                                </p>
                                <div className="space-y-1 text-sm">
                                    <p className="font-medium">Donation Management Platform</p>
                                    <p className="text-muted-foreground">Email: legal@dmaplatform.com</p>
                                    <p className="text-muted-foreground">Address: Eindhoven, Netherlands</p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>

                {/* Footer Note */}
                <div className="mt-12 p-6 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground text-center">
                        These Terms of Service constitute the entire agreement between you and the
                        Donation Management Platform regarding your use of the Platform.
                    </p>
                </div>
            </div>
        </div>
    );
}