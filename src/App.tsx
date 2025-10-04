import React from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Providers from "@/components/providers";
import ErrorBoundary from "@/components/error-boundary";
import { router } from "@/lib/router";

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </Providers>
    </ErrorBoundary>
  );
}

export default App;
