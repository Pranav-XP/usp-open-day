"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { KeyRound, Lock, Unlock, Send, User, Shield } from "lucide-react";

const generateKeyPair = () => {
  // Use small primes for educational purposes (still demonstrative but with random values)
  const primes = [
    11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83,
    89, 97,
  ];

  // Randomly select two different primes
  const p = primes[Math.floor(Math.random() * primes.length)];
  let q = primes[Math.floor(Math.random() * primes.length)];
  while (q === p) {
    q = primes[Math.floor(Math.random() * primes.length)];
  }

  const n = p * q;
  const phi = (p - 1) * (q - 1);

  // Common public exponents that work well
  const possibleE = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
  let e = possibleE[Math.floor(Math.random() * possibleE.length)];

  // Ensure e is coprime with phi
  while (gcd(e, phi) !== 1) {
    e = possibleE[Math.floor(Math.random() * possibleE.length)];
  }

  // Calculate private exponent d
  const d = modInverse(e, phi);

  return {
    publicKey: { n, e },
    privateKey: { n, d },
  };
};

const gcd = (a: number, b: number): number => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

const modInverse = (a: number, m: number): number => {
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return 1;
};

const modPow = (base: number, exp: number, mod: number): number => {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
};

const encryptMessage = (
  message: string,
  publicKey: { n: number; e: number }
) => {
  return message.split("").map((char) => {
    const charCode = char.charCodeAt(0);
    return modPow(charCode, publicKey.e, publicKey.n);
  });
};

const decryptMessage = (
  encryptedData: number[],
  privateKey: { n: number; d: number }
) => {
  return encryptedData
    .map((num) => {
      const decrypted = modPow(num, privateKey.d, privateKey.n);
      return String.fromCharCode(decrypted);
    })
    .join("");
};

export default function AsymmetricKeyVisualizer() {
  const [aliceKeys, setAliceKeys] = useState(generateKeyPair());
  const [bobKeys, setBobKeys] = useState(generateKeyPair());
  const [message, setMessage] = useState("Hello Bob!");
  const [encryptedMessage, setEncryptedMessage] = useState<number[]>([]);
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [] = useState(true);
  const [demoComplete, setDemoComplete] = useState(false);

  const steps = [
    "Alice and Bob generate their key pairs",
    "Alice gets Bob's public key",
    "Alice encrypts her message with Bob's public key",
    "Alice sends the encrypted message to Bob",
    "Bob decrypts the message with his private key",
  ];

  const resetDemo = () => {
    setCurrentStep(0);
    setEncryptedMessage([]);
    setDecryptedMessage("");
    setIsAnimating(false);
    setDemoComplete(false);
    setAliceKeys(generateKeyPair());
    setBobKeys(generateKeyPair());
  };

  const runStep = async (step: number) => {
    setIsAnimating(true);
    setCurrentStep(step);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    switch (step) {
      case 0:
        // Keys are already generated
        break;
      case 1:
        // Alice gets Bob's public key (visual only)
        break;
      case 2:
        // Encrypt message
        const encrypted = encryptMessage(message, bobKeys.publicKey);
        setEncryptedMessage(encrypted);
        break;
      case 3:
        // Message is "sent" (visual only)
        break;
      case 4:
        // Decrypt message
        const decrypted = decryptMessage(
          encryptedMessage.length > 0
            ? encryptedMessage
            : encryptMessage(message, bobKeys.publicKey),
          bobKeys.privateKey
        );
        setDecryptedMessage(decrypted);
        break;
    }

    setIsAnimating(false);
  };

  const runFullDemo = async () => {
    resetDemo();
    for (let i = 0; i <= 4; i++) {
      await runStep(i);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    setCurrentStep(5);
    setDemoComplete(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Shield className="text-blue-600" />
            Asymmetric Key Encryption Visualizer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch how Alice and Bob can communicate securely using public and
            private keys!
          </p>
        </div>

        {/* Controls */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="">
            <CardTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="text-green-600" size={20} />
              Enter the message to send Bob securely!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-48">
                <Input
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  className="mt-1 h-10 text-base"
                />
              </div>
              <Button
                onClick={runFullDemo}
                disabled={isAnimating}
                className="bg-blue-600 hover:bg-blue-700 h-10 px-4 text-base"
              >
                {isAnimating ? "Sending..." : "Send message"}
              </Button>
              <Button
                onClick={resetDemo}
                variant="outline"
                className="h-10 px-4 text-base bg-transparent"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        <Card className="bg-white/80 backdrop-blur-sm px-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Process Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {steps.map((step, index) => {
                const shouldShow =
                  demoComplete ||
                  index === currentStep ||
                  (currentStep === 0 && index === 0);

                if (!shouldShow) return null;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-500 ${
                      index === currentStep
                        ? "bg-blue-100 border-2 border-blue-300 scale-105"
                        : index < currentStep ||
                          (index === 4 && currentStep === 5)
                        ? "bg-green-100 border border-green-300"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-base font-bold ${
                        index === currentStep
                          ? "bg-blue-600 text-white animate-pulse"
                          : index < currentStep ||
                            (index === 4 && currentStep === 5)
                          ? "bg-green-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-base ${
                        index === currentStep
                          ? "font-semibold text-blue-800"
                          : ""
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Alice and Bob Cards */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Alice */}
          <Card
            className={`bg-white/80 backdrop-blur-sm transition-all duration-500 ${
              currentStep === 0 || currentStep === 2
                ? "ring-4 ring-pink-300 shadow-lg"
                : ""
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-pink-700 text-xl">
                <User className="text-pink-600" />
                Alice (Sender)
              </CardTitle>
              <CardDescription className="text-base">
                Alice wants to send a secure message to Bob
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 p-2 bg-pink-50 rounded-lg">
                <div className="text-sm">
                  <strong>Alice&apos;s Public Key:</strong>
                  <div className="font-mono text-sm bg-white p-1 rounded mt-1">
                    n: {aliceKeys.publicKey.n}, e: {aliceKeys.publicKey.e}
                  </div>
                </div>
                <div className="text-sm">
                  <strong>Alice&apos;s Private Key:</strong>
                  <div className="font-mono text-sm bg-white p-1 rounded mt-1">
                    n: {aliceKeys.privateKey.n}, d: {aliceKeys.privateKey.d}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base">Original Message:</Label>
                <div className="p-2 bg-pink-50 rounded-lg mt-1 font-mono text-base">
                  {message}
                </div>
              </div>

              {currentStep >= 1 && (
                <div className="animate-fade-in">
                  <Label className="text-base">
                    Bob&apos;s Public Key (received):
                  </Label>
                  <div className="p-2 bg-blue-50 rounded-lg mt-1 font-mono text-sm">
                    n: {bobKeys.publicKey.n}, e: {bobKeys.publicKey.e}
                  </div>
                </div>
              )}

              {currentStep >= 2 && encryptedMessage.length > 0 && (
                <div className="animate-fade-in">
                  <Label className="flex items-center gap-2 text-base">
                    <Lock className="text-red-600" size={16} />
                    Encrypted Message:
                  </Label>
                  <div className="space-y-2">
                    <div className="p-2 bg-yellow-50 rounded text-sm">
                      <strong>Encryption Process:</strong> Each character →
                      ASCII → encrypted using Bob&apos;s public key
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-gray-50 rounded">
                        <strong>Original:</strong>
                        <div className="font-mono mt-1 max-h-16 overflow-y-auto">
                          {message.split("").map((char, i) => (
                            <span
                              key={i}
                              className="inline-block mr-1 mb-1 p-1 bg-white rounded text-sm"
                            >
                              {char} ({char.charCodeAt(0)})
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-2 bg-red-50 rounded">
                        <strong>Encrypted:</strong>
                        <div className="font-mono mt-1 max-h-16 overflow-y-auto">
                          {encryptedMessage.map((num, i) => (
                            <span
                              key={i}
                              className="inline-block mr-1 mb-1 p-1 bg-white rounded text-red-700 text-sm"
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bob */}
          <Card
            className={`bg-white/80 backdrop-blur-sm transition-all duration-500 ${
              currentStep === 0 || currentStep === 4
                ? "ring-4 ring-blue-300 shadow-lg"
                : ""
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-700 text-xl">
                <User className="text-blue-600" />
                Bob (Receiver)
              </CardTitle>
              <CardDescription className="text-base">
                Bob receives and decrypts Alice&apos;s message
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 p-2 bg-blue-50 rounded-lg">
                <div className="text-sm">
                  <strong>Bob&apos;s Public Key:</strong>
                  <div className="font-mono text-sm bg-white p-1 rounded mt-1">
                    n: {bobKeys.publicKey.n}, e: {bobKeys.publicKey.e}
                  </div>
                </div>
                <div className="text-sm">
                  <strong>Bob&apos;s Private Key:</strong>
                  <div className="font-mono text-sm bg-white p-1 rounded mt-1">
                    n: {bobKeys.privateKey.n}, d: {bobKeys.privateKey.d}
                  </div>
                </div>
              </div>

              {currentStep >= 3 && encryptedMessage.length > 0 && (
                <div className="animate-fade-in">
                  <Label className="flex items-center gap-2 text-base">
                    <Send className="text-orange-600" size={16} />
                    Received Encrypted Message:
                  </Label>
                  <div className="p-2 bg-orange-50 rounded-lg mt-1 font-mono text-sm max-h-16 overflow-y-auto">
                    [{encryptedMessage.join(", ")}]
                  </div>
                </div>
              )}

              {currentStep >= 4 && decryptedMessage && (
                <div className="animate-fade-in">
                  <Label className="flex items-center gap-2 text-base">
                    <Unlock className="text-green-600" size={16} />
                    Decrypted Message:
                  </Label>
                  <div className="space-y-2">
                    <div className="p-2 bg-yellow-50 rounded text-sm">
                      <strong>Decryption Process:</strong> Each encrypted number
                      → decrypted using Bob&apos;s private key → ASCII →
                      characters
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-red-50 rounded">
                        <strong>Encrypted:</strong>
                        <div className="font-mono mt-1 max-h-16 overflow-y-auto">
                          {encryptedMessage.map((num, i) => (
                            <span
                              key={i}
                              className="inline-block mr-1 mb-1 p-1 bg-white rounded text-red-700 text-sm"
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <strong>Decrypted:</strong>
                        <div className="font-mono mt-1 max-h-16 overflow-y-auto">
                          {decryptedMessage.split("").map((char, i) => (
                            <span
                              key={i}
                              className="inline-block mr-1 mb-1 p-1 bg-white rounded text-green-700 text-sm"
                            >
                              {char} ({char.charCodeAt(0)})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg mt-1 font-mono text-lg font-semibold text-green-800">
                      {decryptedMessage}
                    </div>
                    {decryptedMessage === message && (
                      <Badge className="bg-green-600 text-white animate-bounce text-sm">
                        ✓ Message successfully decrypted!
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Key Concepts */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="text-purple-600" />
              Key Concepts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-3 text-lg">
                  🔑 Key Pairs
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Each person has two mathematically related keys: a public key
                  (shared with everyone) and a private key (kept secret).
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3 text-lg">
                  🔒 Encryption
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Messages encrypted with someone&apos;s public key can only be
                  decrypted with their private key.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3 text-lg">
                  🛡️ Security
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  Even if the public key and encrypted message are intercepted,
                  the message stays secure without the private key.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
