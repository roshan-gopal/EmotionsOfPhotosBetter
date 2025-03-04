export const metadata = {
  title: 'Niepce',
  description: 'Discover the emotions your photos give',
  openGraph: {
    title: 'Niepce',
    description: 'Discover the emotions your photos give',
    type: 'website',
    url: 'https://emotions-of-photos-better-final.vercel.app',
    images: [
      {
        url: 'https://emotions-of-photos-better-final.vercel.app/Niepce.png',
        width: 1200,
        height: 630,
        alt: 'Photo Emotions Analyzer Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Niepce',
    description: 'Discover the emotions your photos give',
    images: ['https://emotions-of-photos-better-final.vercel.app/Niepce.png'],
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