

export const metadata = {
  title: 'Niepce',
  description: 'Discover the emotions your photos give',
  openGraph: {
    title: 'Niepce',
    description: 'Discover the emotions your photos give',
    images: [
      {
        url: '/Niepce.png',
        width: 1200,
        height: 630,
        alt: 'Photo Emotions Analyzer Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Niepce',
    description: 'Discover the emotions your photos give',
    images: ['/Niepce.png'],
  },
};

export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    );
  }