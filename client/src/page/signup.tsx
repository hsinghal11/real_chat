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
import { useState, type ChangeEvent } from "react";
import { generateKeyPair, exportKeyToPem } from "@/lib/cryptoUtils"; // Import crypto utils
import BASE_URL from "@/BackendUrl";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [pic, setPic] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading indicator
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // New state for error messages

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setPic(event.target.files[0]);
    } else {
      setPic(null);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true); // Set loading state
    setErrorMessage(null); // Clear previous errors

    try {
      // 1. Generate key pair
      const keyPair = await generateKeyPair();
      const publicKeyPem = await exportKeyToPem(keyPair.publicKey, "public");
      const privateKeyPem = await exportKeyToPem(keyPair.privateKey, "private");

      console.log({
        publicKeyPem: publicKeyPem,
        privateKeyPem: privateKeyPem,
      });

      // Store private key securely (e.g., in localStorage or IndexedDB)
      localStorage.setItem("userPrivateKey", privateKeyPem);

      // 2. Prepare FormData for sending data including the file
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("name", name);
      formData.append("publicKey", publicKeyPem);

      if (pic) {
        formData.append("avatar", pic); // Append the File object if it exists
      }
      /**
       *  @check only how form data has the data or not 
       */
      // @ts-ignore
      function logFormData(){
      console.log("\n--- FormData Contents (Method 2) ---");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
      }
      
      // 3. Send data to your backend
      const response = await fetch(
        `${BASE_URL}/api/v1/user/register`,
        {
          // Adjust endpoint as needed
          method: "POST",
          body: formData, // Use FormData directly as the body
          // When using FormData, the browser automatically sets the
          // 'Content-Type' header to 'multipart/form-data' with the correct boundary.
          // DO NOT set 'Content-Type': 'application/json' here.
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("User registered successfully:", data);
        alert("Signup successful! Please login.");
        navigate("/login"); // Redirect to login after successful signup
      } else {
        console.error("Registration failed:", data.message);
        setErrorMessage(
          data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage(
        `An error occurred during registration: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  const login = () => {
    console.log("Navigating to login...");
    navigate("/login");
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-yellow-100 to-rose-200">
        <Card className="w-full max-w-xl ">
          <CardHeader>
            <CardTitle>Signup to your account</CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
            <CardAction>
              <Button variant="link" onClick={login}>
                Login
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pic">Profile Picture (Optional)</Label>
                  <Input
                    id="pic"
                    type="file"
                    name="avatar"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <CardFooter className="flex-col gap-2 mt-6">
                {" "}
                {/* Added margin-top for spacing */}
                {errorMessage && (
                  <p className="text-red-500 text-m">{errorMessage}</p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={login}
                  disabled={isSubmitting}
                >
                  Already have an account?
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
