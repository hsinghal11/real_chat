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
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {

  const navigate = useNavigate();

  const login = () => {
    console.log("login hoja ");
    navigate("/login");
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-yellow-100 to-rose-200">
      <Card className="w-full max-w-xl ">
        <CardHeader>
          <CardTitle>Signup to your account</CardTitle>
          <CardDescription>
            Enter your details below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={login}>Login</Button>
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
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" placeholder="********" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full" onClick={login}>
            already have an account?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
