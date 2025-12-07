import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion } from 'framer-motion';

const Login = () => {
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = await login(email, password, role);
    if (user) {
      if (user.role === 'doctor') {
          navigate('/doctor/dashboard');
      } else {
          navigate('/patient/dashboard');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50 dark:bg-black/20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-100/40 dark:bg-purple-900/10 rounded-full blur-3xl -z-10" />

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md"
        >
            <div className="text-center mb-8">
                <Link to="/" className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    DOXY
                </Link>
                <p className="text-muted-foreground mt-2">Welcome back</p>
            </div>

            <Tabs value={role} onValueChange={setRole} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <TabsTrigger value="patient" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">Patient</TabsTrigger>
                    <TabsTrigger value="doctor" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">Doctor</TabsTrigger>
                </TabsList>

                <Card className="border-border/50 shadow-medium backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-xl font-bold">Sign in</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your {role} account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="name@example.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                    className="rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all dark:bg-gray-800/50 dark:border-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link to="#" className="text-xs text-blue-600 hover:underline font-medium">Forgot password?</Link>
                                </div>
                                <Input 
                                    id="password" 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                    className="rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all dark:bg-gray-800/50 dark:border-gray-700"
                                />
                            </div>
                            <Button className="w-full rounded-xl h-11 text-base shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                                {loading ? 'Logging in...' : 'Sign In'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pt-2">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                                Create an account
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </Tabs>
        </motion.div>
    </div>
  );
};

export default Login;
