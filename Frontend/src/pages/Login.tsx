import { SignUp } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-600 px-4">
      <h1 className="text-4xl font-extrabold text-white mb-2">Price Verification</h1>
      <p className="text-blue-100 mb-8 text-center max-w-md">
        AI-powered price monitoring for citizens
      </p>
      
      <SignUp
        appearance={{
          elements: {
            card: "bg-white border-0 rounded-xl shadow-2xl",
            headerTitle: "text-gray-900 font-bold",
            headerSubtitle: "text-gray-600",
            socialButtonsBlockButton:
              "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
            formButtonPrimary:
              "bg-blue-600 hover:bg-blue-700 text-white font-semibold",
            footerActionText: "text-gray-600",
            footerActionLink: "text-blue-600 hover:text-blue-700",
            formFieldInput:
              "bg-white border border-gray-300 text-gray-900 focus:border-blue-600 focus:ring-blue-600",
            formFieldLabel: "text-gray-700",
            dividerLine: "bg-gray-300",
            dividerText: "text-gray-500",
            identityPreviewText: "text-gray-700",
            identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
          },
        }}
      />
    </div>
  );
}