import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LabelForge — Manufacturer-Ready Label Design',
  description: 'Upload your manufacturer dieline, design your label, export a print-ready file.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%235B7FFF'/><path d='M8 8h10l6 6v10H8V8z' fill='none' stroke='white' stroke-width='2'/><path d='M18 8v6h6' fill='none' stroke='white' stroke-width='2'/><line x1='11' y1='17' x2='21' y2='17' stroke='white' stroke-width='1.5'/><line x1='11' y1='20' x2='21' y2='20' stroke='white' stroke-width='1.5'/></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
