import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, Loader2, User, Building2 } from 'lucide-react';

export default function Authenticate() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        middleNames: '',
        email: '',
        address: '',
        username: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        companyAccount: false
    });

    const [errors, setErrors] = useState({});

    const loginMutation = useLogin();
    const registerMutation = useRegister();


    const checkPasswordStrength = (password) => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };
        const strength = Object.values(checks).filter(Boolean).length;
        return { checks, strength };
    };

    useEffect(() => {
        if (loginMutation.isSuccess || registerMutation.isSuccess) {
            navigate('/');
        }
    }, [loginMutation.isSuccess, registerMutation.isSuccess, navigate]);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateLoginForm = () => {
        const newErrors = {};
        if (!loginData.email) newErrors.email = 'Email or username is required';
        if (!loginData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateRegisterForm = () => {
        const newErrors = {};
        if (!registerData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!registerData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!registerData.middleNames.trim()) newErrors.middleNames = 'Middle names are required';
        if (!registerData.username.trim()) newErrors.username = 'Username is required';
        if (!registerData.phoneNumber.trim()) newErrors.phoneNumber = 'Valid phone number is required';
        if (!registerData.email || !validateEmail(registerData.email)) {
            newErrors.email = 'Valid email is required';
        }

        if (!registerData.address.trim()) newErrors.address = 'Address is required';
        if (!registerData.password) {
            newErrors.password = 'Password is required';
        } else if (registerData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (registerData.password !== registerData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = () => {
        if (validateLoginForm()) {
            loginMutation.mutate(loginData);
        }
    };

    const handleRegister = () => {
        if (validateRegisterForm()) {
            registerMutation.mutate(registerData);
        }
    };

    const passwordStrength = registerData.password ? checkPasswordStrength(registerData.password) : { checks: {}, strength: 0 };

    return (
        <Card className="w-full max-w-md shadow-2xl border-0">
            <CardHeader className="space-y-1 pb-3 pt-4">
                <CardTitle className="text-xl font-bold text-center">Welcome</CardTitle>
                <CardDescription className="text-center text-sm">
                    Sign in to your account or create a new one
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-3">
                        {loginMutation.isError && (
                            <Alert variant="destructive">
                                <XCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Invalid credentials. Please try again.
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="login-email">Username / Email</Label>
                            <Input
                                id="login-email"
                                type="text"
                                placeholder="yourusername"
                                value={loginData.email}
                                data-test="usernameOrEmail"
                                onChange={(e) => {
                                    setLoginData({ ...loginData, email: e.target.value });
                                    setErrors({ ...errors, email: '' });
                                }}
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="login-password">Password</Label>
                            <Input
                                id="login-password"
                                type="password"
                                placeholder="•••••••••••"
                                data-test="loginPassword"
                                value={loginData.password}
                                onChange={(e) => {
                                    setLoginData({ ...loginData, password: e.target.value });
                                    setErrors({ ...errors, password: '' });
                                }}
                                className={errors.password ? 'border-red-500' : ''}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        <Button
                            onClick={handleLogin}
                            className="w-full"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </TabsContent>

                    <TabsContent value="register" className="space-y-3">
                        {registerMutation.isError && (
                            <Alert variant="destructive">
                                <XCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {registerMutation.error?.message || 'Registration failed. Please try again.'}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Account Type Selection */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Account Type *</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRegisterData({ ...registerData, companyAccount: false })}
                                    className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
                                        !registerData.companyAccount
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                                >
                                    <User className={`h-8 w-8 mb-2 ${!registerData.companyAccount ? 'text-primary' : 'text-gray-400'}`} />
                                    <span className={`text-sm font-medium ${!registerData.companyAccount ? 'text-primary' : 'text-gray-700'}`}>
                                        Donor Account
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1 text-center">
                                        For individuals
                                    </span>
                                    {!registerData.companyAccount && (
                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setRegisterData({ ...registerData, companyAccount: true })}
                                    className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
                                        registerData.companyAccount
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                                >
                                    <Building2 className={`h-8 w-8 mb-2 ${registerData.companyAccount ? 'text-primary' : 'text-gray-400'}`} />
                                    <span className={`text-sm font-medium ${registerData.companyAccount ? 'text-primary' : 'text-gray-700'}`}>
                                        Company Account
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1 text-center">
                                        For organizations
                                    </span>
                                    {registerData.companyAccount && (
                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="register-first-name">First name *</Label>
                            <Input
                                id="register-first-name"
                                placeholder="John"
                                value={registerData.firstName}
                                onChange={(e) => {
                                    setRegisterData({ ...registerData, firstName: e.target.value });
                                    setErrors({ ...errors, firstName: '' });
                                }}
                                className={errors.firstName ? 'border-red-500' : ''}
                            />
                            {errors.firstName && (
                                <p className="text-sm text-red-500">{errors.firstName}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="register-last-name">Last name *</Label>
                            <Input
                                id="register-last-name"
                                placeholder="Doe"
                                value={registerData.lastName}
                                onChange={(e) => {
                                    setRegisterData({ ...registerData, lastName: e.target.value });
                                    setErrors({ ...errors, lastName: '' });
                                }}
                                className={errors.lastName ? 'border-red-500' : ''}
                            />
                            {errors.lastName && (
                                <p className="text-sm text-red-500">{errors.lastName}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="register-middle-names">Middle names *</Label>
                            <Input
                                id="register-middle-names"
                                placeholder="Michael"
                                value={registerData.middleNames}
                                onChange={(e) => {
                                    setRegisterData({ ...registerData, middleNames: e.target.value });
                                    setErrors({ ...errors, middleNames: '' });
                                }}
                                className={errors.middleNames ? 'border-red-500' : ''}
                            />
                            {errors.middleNames && (
                                <p className="text-sm text-red-500">{errors.middleNames}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="register-username">Username *</Label>
                            <Input
                                id="register-username"
                                placeholder="johndoe"
                                value={registerData.username}
                                onChange={(e) => {
                                    setRegisterData({ ...registerData, username: e.target.value });
                                    setErrors({ ...errors, username: '' });
                                }}
                                className={errors.username ? 'border-red-500' : ''}
                            />
                            {errors.username && (
                                <p className="text-sm text-red-500">{errors.username}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="register-email">Email *</Label>
                            <Input
                                id="register-email"
                                type="email"
                                placeholder="you@example.com"
                                value={registerData.email}
                                onChange={(e) => {
                                    setRegisterData({ ...registerData, email: e.target.value });
                                    setErrors({ ...errors, email: '' });
                                }}
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="register-phone-number">Phone number *</Label>
                            <Input
                                id="register-phone-number"
                                placeholder="123-456-7890"
                                value={registerData.phoneNumber}
                                onChange={(e) => {
                                    setRegisterData({ ...registerData, phoneNumber: e.target.value });
                                    setErrors({ ...errors, phoneNumber: '' });
                                }}
                                className={errors.phoneNumber ? 'border-red-500' : ''}
                            />
                            {errors.phoneNumber && (
                                <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="register-address">Address *</Label>
                            <Input
                                id="register-address"
                                placeholder="123 Main St"
                                value={registerData.address}
                                onChange={(e) => {
                                    setRegisterData({ ...registerData, address: e.target.value });
                                    setErrors({ ...errors, address: '' });
                                }}
                                className={errors.address ? 'border-red-500' : ''}
                            />
                            {errors.address && (
                                <p className="text-sm text-red-500">{errors.address}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="register-password">Password *</Label>
                            <Input
                                id="register-password"
                                type="password"
                                placeholder="••••••••"
                                value={registerData.password}
                                onChange={(e) => {
                                    setRegisterData({ ...registerData, password: e.target.value });
                                    setErrors({ ...errors, password: '' });
                                }}
                                className={errors.password ? 'border-red-500' : ''}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password}</p>
                            )}
                            {registerData.password && (
                                <div className="space-y-1 mt-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded ${level <= passwordStrength.strength
                                                    ? passwordStrength.strength <= 2
                                                        ? 'bg-red-500'
                                                        : passwordStrength.strength === 3
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'
                                                    : 'bg-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-xs space-y-0.5">
                                        <p className={passwordStrength.checks.length ? 'text-green-600' : 'text-gray-500'}>
                                            ✓ At least 8 characters
                                        </p>
                                        <p className={passwordStrength.checks.uppercase && passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-500'}>
                                            ✓ Upper and lowercase letters
                                        </p>
                                        <p className={passwordStrength.checks.number ? 'text-green-600' : 'text-gray-500'}>
                                            ✓ At least one number
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="register-confirm">Confirm password *</Label>
                            <Input
                                id="register-confirm"
                                type="password"
                                placeholder="••••••••"
                                value={registerData.confirmPassword}
                                onChange={(e) => {
                                    setRegisterData({ ...registerData, confirmPassword: e.target.value });
                                    setErrors({ ...errors, confirmPassword: '' });
                                }}
                                className={errors.confirmPassword ? 'border-red-500' : ''}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <Button
                            onClick={handleRegister}
                            className="w-full"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </TabsContent>
                </Tabs>

                <div className="mt-4 text-center text-xs text-gray-600">
                    By continuing, you agree to our{' '}
                    <button className="text-blue-600 hover:underline">Terms of Service</button>
                    {' '}and{' '}
                    <button className="text-blue-600 hover:underline">Privacy Policy</button>
                </div>
            </CardContent>
        </Card>
    );
}