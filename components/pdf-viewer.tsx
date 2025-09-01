// components/PdfViewer.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';


// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  pdfUrl: string;
}

export default function PdfViewer({ pdfUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState<number | null>(null);

  useEffect(() => {
    function updatePageWidth() {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setPageWidth(width);
      }
    }

    updatePageWidth();
    window.addEventListener('resize', updatePageWidth);
    return () => window.removeEventListener('resize', updatePageWidth);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '90%',
        minHeight: '100vh',
        overflowX: 'hidden',
        overflowY: 'auto',
        backgroundColor: 'white',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
    >
      <Document
        file={pdfUrl}
        loading={<p>Loading PDF...</p>}
        error={<p>Failed to load PDF.</p>}
        noData={<p>No PDF file specified.</p>}
      >
        {pageWidth && (
          <Page
            pageNumber={1}
            width={pageWidth}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        )}
      </Document>
    </div>
  );
}