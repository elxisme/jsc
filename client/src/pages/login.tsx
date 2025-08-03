import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scale, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Login() {
  const [, setLocation] = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      setLocation('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const createTestAccount = async () => {
    setError('');
    setCreating(true);
    
    try {
      const response = await fetch('/api/auth/create-test-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@jsc.gov.ng',
          password: 'jsc2025admin',
          role: 'Super Admin'
        })
      });
      
      if (response.ok) {
        setEmail('admin@jsc.gov.ng');
        setPassword('jsc2025admin');
        setError('Test account created! You can now sign in with the credentials above.');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create test account');
      }
    } catch (err: any) {
      setError('Failed to create test account. ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <Scale className="text-primary-foreground h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">JSC Payroll System</CardTitle>
          <p className="text-gray-600">Sign in to your account</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || creating}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-4">
            <div className="text-center text-sm text-gray-500 mb-3">
              For testing purposes
            </div>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={createTestAccount}
              disabled={loading || creating}
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Test Account...
                </>
              ) : (
                'Create Test Admin Account'
              )}
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Judicial Service Committee</p>
            <p>Payroll Management System</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
