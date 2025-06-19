'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function UpdatePassword() {
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Try to get access_token from query params first
        let token = searchParams.get('access_token');
        // If not found, try to get it from the hash fragment
        if (!token && typeof window !== 'undefined') {
            const hash = window.location.hash;
            const match = hash.match(/access_token=([^&]+)/);
            if (match) {
                token = match[1];
            }
        }
        if (!token) {
            router.replace('/login');
        } else {
            setAccessToken(token);
        }
    }, [searchParams, router]);

    const handleUpdate = async () => {
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });
        setLoading(false);
        if (error) {
            alert(error.message);
        } else {
            setShowModal(true);
            router.push('/login');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Reset Your Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleUpdate} disabled={loading || !password}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                </CardFooter>
            </Card>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow">
                        <p>Password updated successfully!</p>
                        <Button onClick={() => setShowModal(false)}>Close</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
function setShowModal(arg0: boolean) {
    throw new Error('Function not implemented.');
}

