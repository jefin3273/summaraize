/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { NhostClient, NhostProvider } from "@nhost/nextjs";
import { nhost } from "@/lib/nhost";
import { ReactNode } from "react";

interface NhostClientProviderProps {
  children: ReactNode;
}

export function NhostClientProvider({ children }: NhostClientProviderProps) {
  return <NhostProvider nhost={nhost}>{children}</NhostProvider>;
}
