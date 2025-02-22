"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ImageData {
  name: string;
  url: string;
}

export default function AllImages({ uuid, user_id, type }: { uuid: string; user_id: string; type: string }) {
  const supabase = createClient();
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadImages() {
      setIsLoading(true);
      setError(null); // Reset error state
      try {
        // Step 1: Fetch the list of files from the folder
        const { data: imageList, error: listError } = await supabase.storage.from(type).list(`${user_id}/${uuid}`);
        if (listError) {
          throw new Error(`Error fetching image list: ${listError.message}`);
        }

        // Step 2: Filter for image files only
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
        const files = imageList.filter(
          (item) => item.id !== null && imageExtensions.some((ext) => item.name.toLowerCase().endsWith(ext))
        );

        if (files.length === 0) {
          setImages([]);
          return;
        }

        // Step 3: Construct file paths for createSignedUrls
        const filePaths = files.map((file) => `${user_id}/${uuid}/${file.name}`);

        // Step 4: Generate signed URLs (valid for 60 seconds)
        const { data: signedUrls, error: urlError } = await supabase.storage
          .from(type)
          .createSignedUrls(filePaths, 60); // 60 seconds expiration

        if (urlError) {
          throw new Error(`Error generating signed URLs: ${urlError.message}`);
        }

        // Step 5: Map signed URLs to image data
        const imageData = signedUrls.map((signedUrl, index) => ({
          name: files[index].name,
          url: signedUrl.signedUrl,
        }));

        setImages(imageData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    loadImages();
  }, [uuid, user_id, type, supabase]);

  // Handle UI states
  if (isLoading) {
    return <p>Loading images...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (images.length === 0) {
    return <p>No images found in this folder.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image) => (
        <Image
          key={image.name}
          src={image.url}
          alt={`Event Image ${image.name}`}
          className="w-full h-auto"
          width={500}
          height={500}
        />
      ))}
    </div>
  );
}