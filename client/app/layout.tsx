import React from "react";
import type {Metadata} from 'next'

import { ProviderWrapper } from "@/app/redux/providerWrapper";

import './globals.css'
import {Inter} from 'next/font/google'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'SWA Assignment 3',
    description: 'Best assignment',
}

export default function RootLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ProviderWrapper>
                    {children}
                </ProviderWrapper>
            </body>
        </html>
    )
}
