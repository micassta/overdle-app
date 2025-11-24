import type { Metadata } from "next";

import { Kdam_Thmor_Pro } from "next/font/google";
import "./globals.css";

import { NavBar } from "@/components/NavBar/NavBar";
import { Footer } from "@/components/Footer/Footer";

import { UserProvider } from "../context/UserContext"; 

export const metadata: Metadata = {
  title: "OVERDLE",
  description: "Demuestra que tanto sabes de Overwatch 2",
};

const kdam = Kdam_Thmor_Pro({ 
  weight: "400",
  subsets: ["latin"] 
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html lang="es">
      <body className={kdam.className}>
        {/* Estructura Flex para el Footer Sticky */}
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <UserProvider>
            <NavBar /> {/* Cliente (Interactivo) */}
            
            {/* Aquí Next.js inyecta el contenido de page.tsx (o de /classic/page.tsx) */}
            {children} 
            
            <Footer /> {/* Servidor (Estático) */}
          </UserProvider>
        </div>
      </body>
    </html>
  );
}
