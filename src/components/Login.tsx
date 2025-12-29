"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { Ghost } from "lucide-react";

function Login() {
  return (
    <div>
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader>
          <motion.h1
            className="text-2xl font-bold mb-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Login
          </motion.h1>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.form
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  Enter Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  className=" border-2 border-blue-600 w-80"
                />
              </div>
              <Button type="submit" className="w-full mt-4 cursor-pointer">
                Login
              </Button>
            </motion.form>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
