
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Heart, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: ""
  });
  
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    verificationCode: ""
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password || !loginData.role) {
      toast.error("All fields are required");
      return;
    }

    if (loginData.email === "wrong@email.com") {
      toast.error("Incorrect email or password");
      return;
    }

    toast.success("Login successful!");
    
    // Navigate based on role
    switch (loginData.role) {
      case "patient":
        navigate("/patient-dashboard");
        break;
      case "doctor":
        navigate("/doctor-dashboard");
        break;
      case "staff":
        navigate("/emergency");
        break;
      default:
        navigate("/");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { fullName, email, password, confirmPassword, role, verificationCode } = signupData;
    
    if (!fullName || !email || !password || !confirmPassword || !role) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (role === "doctor" && !verificationCode) {
      toast.error("Verification code is required for doctors");
      return;
    }

    toast.success("Account created successfully! Please login to continue.");
    
    // Reset form and switch to login tab
    setSignupData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      verificationCode: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Heart className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">MediAid</span>
          </Link>
          <p className="text-gray-600 mt-2">Access your healthcare dashboard</p>
        </div>

        <Card className="rounded-2xl shadow-lg border-0">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Signup
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      placeholder="Enter your email"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      placeholder="Enter your password"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="login-role">Role</Label>
                    <Select value={loginData.role} onValueChange={(value) => setLoginData({...loginData, role: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                  New to MediAid?{" "}
                  <button className="text-blue-600 hover:underline">
                    Sign up and start managing your health.
                  </button>
                </p>
              </CardContent>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Create Account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      placeholder="Enter your email"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-role">Role</Label>
                    <Select value={signupData.role} onValueChange={(value) => setSignupData({...signupData, role: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {signupData.role === "doctor" && (
                    <div>
                      <Label htmlFor="verification-code">Verification Code</Label>
                      <Input
                        id="verification-code"
                        value={signupData.verificationCode}
                        onChange={(e) => setSignupData({...signupData, verificationCode: e.target.value})}
                        placeholder="Enter doctor verification code"
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      placeholder="Create a password"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      placeholder="Confirm your password"
                      className="mt-1"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </Button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{" "}
                  <button className="text-blue-600 hover:underline">
                    Login here.
                  </button>
                </p>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
