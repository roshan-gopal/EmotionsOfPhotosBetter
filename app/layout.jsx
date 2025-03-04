

export const metadata = {
  title: 'Photo Emotions Analyzer',
  description: 'Discover the emotions your photos convey using AI analysis',
  openGraph: {
    title: 'Niepce',
    description: 'Discover the emotions your photos give',
    images: [
      {
        url: '/niepce.png',
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
    images: ['/niepce.png'],
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