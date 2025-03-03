"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface FileData {
  name: string;
  url: string;
  type: "image" | "pdf";
}

export default function AllFiles({ uuid, user_id, type }: { uuid: string; user_id: string; type: string }) {
  const supabase = createClient();
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFiles() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Step 1: Fetch the list of files from the folder
        const { data: fileList, error: listError } = await supabase.storage.from(type).list(`${user_id}/${uuid}`);
        
        if (listError) {
          throw new Error(`Error fetching file list: ${listError.message}`);
        }
        
        if (!fileList || fileList.length === 0) {
          setFiles([]);
          setIsLoading(false);
          return;
        }

        // Step 2: Filter for image and PDF files
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
        const pdfExtension = '.pdf';
        
        const validFiles = fileList.filter(
          (item) => 
            item.id !== null && 
            (
              imageExtensions.some((ext) => item.name.toLowerCase().endsWith(ext)) ||
              item.name.toLowerCase().endsWith(pdfExtension)
            )
        );
        
        if (validFiles.length === 0) {
          setFiles([]);
          setIsLoading(false);
          return;
        }
        
        // Step 3: Construct file paths for createSignedUrls
        const filePaths = validFiles.map((file) => `${user_id}/${uuid}/${file.name}`);
        
        // Step 4: Generate signed URLs (valid for 300 seconds for PDFs)
        const { data: signedUrls, error: urlError } = await supabase.storage
          .from(type)
          .createSignedUrls(filePaths, 300); // 5 minutes for PDFs
        
        if (urlError) {
          throw new Error(`Error generating signed URLs: ${urlError.message}`);
        }
        
        // Step 5: Map signed URLs to file data with type information
        const fileData = signedUrls.map((signedUrl, index) => {
          const fileName = validFiles[index].name.toLowerCase();
          // const isImage = imageExtensions.some(ext => fileName.endsWith(ext));
          const isPdf = fileName.endsWith(pdfExtension);
          
          return {
            name: validFiles[index].name,
            url: signedUrl.signedUrl,
            type: isPdf ? "pdf" : "image" as "image" | "pdf"
          };
        });
        
        setFiles(fileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadFiles();
  }, [uuid, user_id, type, supabase]);

  // Group files by type
  const imageFiles = files.filter(file => file.type === "image");
  const pdfFiles = files.filter(file => file.type === "pdf");

  // Handle UI states
  if (isLoading) {
    return <p>Loading files...</p>;
  }
  
  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }
  
  if (files.length === 0) {
    return <p>No files found in this folder.</p>;
  }
  
  return (
    <div className="space-y-8">
      {/* Images Section */}
      {imageFiles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {imageFiles.map((file) => (
              <div key={file.name} className="border rounded-lg p-4">
                {/* <h3 className="text-lg font-medium mb-2 truncate">{file.name}</h3> */}
                <div className="relative h-64 w-full">
                  <Image
                    src={file.url}
                    alt={`Image ${file.name}`}
                    className="object-contain"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDFs Section */}
      {pdfFiles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pdfFiles.map((file) => (
              <div key={file.name} className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2 truncate">{file.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>PDF Document</span>
                  </div>
                  <Link 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    View PDF
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}