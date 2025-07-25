import BASE_URL from "@/BackendUrl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("heeellll");
    
    setIsLoggingIn(true); // Set loading state
    setErrorMessage(null); // Clear previous errors

    try {
      // 1. Authenticate with backend (email/password)
      const response = await fetch(`${BASE_URL}/api/v1/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if(response.ok){
        console.log("Login successful:", data);
        localStorage.setItem("authToken", data.token);
        navigate('/dashboard'); 
      }else {
        console.error("Login failed:", data.message);
        setErrorMessage(data.message || "Login failed. Please check your credentials.");
      }
    }catch (error) {
      console.error("Error during login:", error);
      setErrorMessage(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoggingIn(false);
    }
  }

  const signUp = () => {
    console.log("clicked to kara h");
    navigate("/signUp");
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-rose-100 via-orange-100 to-yellow-200">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl">Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={signUp}>
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 mt-6">
          {" "}
          {/* Added margin-top for spacing */}
          {errorMessage && (
            <p className="text-red-500 text-m">{errorMessage}</p>
          )}
          <Button type="submit" className="w-full hover:cursor-pointer" disabled={isLoggingIn} onClick={handleLogin} >
            {isLoggingIn ? "logging  In..." : "Login"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={signUp}
            disabled={isLoggingIn}
          >
            Create an account?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
