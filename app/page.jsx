"use client"

import MainPage from '../components/main_page'
import { useState } from 'react'

export default function RootLayout({ children }) {
  const [uploadedUrl, setUploadedUrl] = useState(null);
  
  return (
    <html lang="en">
      <body>
        <MainPage />
        {children}
      </body>
    </html>
  );
}
