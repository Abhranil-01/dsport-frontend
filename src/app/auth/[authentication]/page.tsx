"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// OTP Components
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// RHF
import { Controller, useForm } from "react-hook-form";

// API
import {
  useRegisterUserMutation,
  useResendOtpMutation,
  useUserLoginMutation,
  useUserOtpVerificationMutation,
} from "@/services/apiSlice";

export default function AuthPage() {
  const router = useRouter();

  /* ---------------- STATE ---------------- */
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [purpose, setPurpose] = useState<"login" | "register" | null>(null);
  const [timer, setTimer] = useState(120);

  /* ---------------- API ---------------- */
  const [registerUser, { isLoading: registerLoading }] =
    useRegisterUserMutation();
  const [userLogin, { isLoading: loginLoading }] =
    useUserLoginMutation();
  const [verifyOtp, { isLoading: otpLoading }] =
    useUserOtpVerificationMutation();
  const [resendOtp] = useResendOtpMutation();

  /* ---------------- FORMS ---------------- */
  const loginForm = useForm({ defaultValues: { email: "" } });
  const registerForm = useForm({ defaultValues: { fullname: "", email: "" } });
  const otpForm = useForm({ defaultValues: { otp: "" } });

  /* ---------------- PROTECT AUTH ROUTE ---------------- */
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
      router.replace("/");
    }
  }, []);

  /* ---------------- OTP TIMER ---------------- */
  useEffect(() => {
    if (!showOtp) return;

    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [showOtp, timer]);

  const resetTimer = () => setTimer(120);

  /* ---------------- LOGIN ---------------- */
  const onSubmitLogin = async (data: any) => {
    try {
     const res= await userLogin(data).unwrap();


      setUserEmail(data.email);
      setPurpose("login");
      setShowOtp(true);
      resetTimer();

      toast.success("OTP sent to your email 📩");
    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  /* ---------------- REGISTER ---------------- */
  const onSubmitRegister = async (data: any) => {
    try {
      await registerUser(data).unwrap();

      setUserEmail(data.email);
      setPurpose("register");
      setShowOtp(true);
      resetTimer();

      toast.success("Account created! OTP sent 📩");
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const verifyOtpHandler = async (otp: string) => {
    try {
      const response = await verifyOtp({
        email: userEmail,
        otp,
      }).unwrap();
      console.log(response,"kejfhfhurfe");
      console.log(response.data.accessToken,"accessToken");
      console.log(response.data.refreshToken,"refreshToken");
      // localStorage.setItem("accessToken", response.data.accessToken);
      // localStorage.setItem("refreshToken", response.data.refreshToken);
      // localStorage.setItem("loggedIn", "true");
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success("Login successful 🎉");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid OTP");
    }
  };

  /* ---------------- AUTO SUBMIT OTP ---------------- */
  const handleOtpChange = (value: string) => {
    otpForm.setValue("otp", value);
    if (value.length === 6) {
      verifyOtpHandler(value);
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const handleResendOtp = async () => {
    try {
      await resendOtp({
        email: userEmail,
        purpose,
      }).unwrap();

      resetTimer();
      toast.success("OTP resent 📩");
    } catch (err: any) {
      toast.error("Failed to resend OTP");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT IMAGE */}
      <div className="hidden md:block w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a"
          alt="sports"
          fill
          className="object-cover"
        />
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <h2 className="text-3xl font-bold">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {!showOtp ? (
                isLogin ? (
                  <motion.form
                    key="login"
                    onSubmit={loginForm.handleSubmit(onSubmitLogin)}
                    className="space-y-5"
                  >
                    <Input
                      type="email"
                      placeholder="Email"
                      {...loginForm.register("email", { required: true })}
                    />
                    <Button className="w-full" disabled={loginLoading}>
                      {loginLoading ? "Sending OTP..." : "Login"}
                    </Button>
                    <p className="text-center text-sm">
                      No account?{" "}
                      <Button
                        variant="link"
                        onClick={() => setIsLogin(false)}
                      >
                        Register
                      </Button>
                    </p>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    onSubmit={registerForm.handleSubmit(onSubmitRegister)}
                    className="space-y-5"
                  >
                    <Input
                      placeholder="Full Name"
                      {...registerForm.register("fullname", { required: true })}
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      {...registerForm.register("email", { required: true })}
                    />
                    <Button className="w-full" disabled={registerLoading}>
                      {registerLoading ? "Creating..." : "Register"}
                    </Button>
                    <p className="text-center text-sm">
                      Already have an account?{" "}
                      <Button
                        variant="link"
                        onClick={() => setIsLogin(true)}
                      >
                        Login
                      </Button>
                    </p>
                  </motion.form>
                )
              ) : (
                <motion.div key="otp" className="space-y-5 ">
                  <h3 className="text-center text-xl font-bold">
                    Enter OTP
                  </h3>

                  <p className="text-center text-sm text-gray-500">
                    OTP sent to {userEmail}
                  </p>
<div className="flex justify-center">
        <Controller
                    name="otp"
                    control={otpForm.control}
                    render={({ field }) => (
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={handleOtpChange}
                      >
                        <InputOTPGroup>
                          {[...Array(6)].map((_, i) => (
                            <InputOTPSlot key={i} index={i} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                  />
</div>
            

                  <p className="text-center text-sm text-gray-600">
                    {timer > 0
                      ? `Resend OTP in ${timer}s`
                      : (
                        <Button
                          variant="link"
                          onClick={handleResendOtp}
                        >
                          Resend OTP
                        </Button>
                      )}
                  </p>

                  <Button className="w-full" disabled={otpLoading}>
                    {otpLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
