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

  return (
    <div
      ref={containerRef}
      style={{
        boxSizing: 'border-box',
      }}
    >
      <Document
        file={pdfUrl}
        loading={<p className="text-center">Loading Document...</p>}
        error={<p>Failed to load Document.</p>}
        noData={<p>Document not found.</p>}
      >
        <Page
          pageNumber={1}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          canvasBackground='transparent'
        />
      </Document>
    </div>
  );
}