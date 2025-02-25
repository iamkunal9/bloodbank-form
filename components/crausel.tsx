"use client"
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
interface ImageItem {
  src: string;
  alt: string;
}

interface ContinuousCarouselProps {
  images?: ImageItem[];
  speed?: number; // pixels per frame
  itemWidth?: number;
  itemHeight?: number;
}

const ContinuousCarousel: React.FC<ContinuousCarouselProps> = ({
  images = [],  // Default to empty array to prevent undefined
  speed = 1,
  itemWidth = 200,
  itemHeight = 200,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [itemsPerView, setItemsPerView] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  // Use default images if none provided
  const displayImages: ImageItem[] = images.length > 0 ? images : [
    { src: "/p2.png", alt: "share for good" },
    { src: "/p3.png", alt: "share for good" },
    { src: "/p4.png", alt: "share for good" },
    { src: "/p5.png", alt: "share for good" },
    { src: "/p6.png", alt: "share for good" }
  ];
  
  // Calculate dynamic values based on container size
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = (): void => {
      const width = containerRef.current?.clientWidth || 0;
      setContainerWidth(width);
      
      // Calculate how many items can fit in the viewport at once
      const calculatedItemsPerView = Math.max(Math.floor(width / (itemWidth + 16)), 1);
      setItemsPerView(calculatedItemsPerView);
    };
    
    // Initial calculation
    updateDimensions();
    
    // Recalculate on resize
    const handleResize = (): void => {
      updateDimensions();
    };
    
    window.addEventListener('resize', handleResize);
    setIsVisible(true); // Animation starts when component is mounted
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [itemWidth]);
  
  // Animation loop
  useEffect(() => {
    if (!carouselRef.current || !isVisible || itemsPerView === 0) return;
    
    let animationId: number;
    let position = 0;
    
    const animate = (): void => {
      if (!carouselRef.current) return;
      
      // Adjust speed for smaller screens (slower on mobile)
      const adjustedSpeed = containerWidth < 768 ? speed * 0.5 : speed;
      
      // Move the carousel continuously
      position -= adjustedSpeed;
      
      // Calculate when to reset (after first set of images has passed)
      const totalWidth = (itemWidth + 16) * displayImages.length; // Width + margin
      
      if (position <= -totalWidth) {
        position = 0;
      }
      
      carouselRef.current.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [displayImages.length, itemWidth, isVisible, itemsPerView, speed, containerWidth]);
  
  // Calculate total carousel width needed (2x images to ensure loop)
  const totalCarouselWidth = (itemWidth + 16) * displayImages.length * 2;
  
  return (
    <div 
      className="w-full overflow-hidden"
      ref={containerRef}
    >
      <div className="relative">
        <div 
          className="flex will-change-transform"
          style={{ width: `${totalCarouselWidth}px` }}
          ref={carouselRef}
        >
          {/* First set of images */}
          {displayImages.map((image, index) => (
            <div 
              key={`first-${index}`} 
              className="relative mx-2 flex-shrink-0"
              style={{ width: `${itemWidth}px`, height: `${itemHeight}px` }}
            >
              <Image 
                src={image.src} // Replace with actual image.src in production
                alt={image.alt} 
                className="object-contain w-full h-full"
                width={itemWidth}
                height={itemHeight}
              />
            </div>
          ))}
          
          {/* Duplicate set for seamless looping */}
          {displayImages.map((image, index) => (
            <div 
              key={`second-${index}`} 
              className="relative mx-2 flex-shrink-0"
              style={{ width: `${itemWidth}px`, height: `${itemHeight}px` }}
            >
              <Image 
                src={image.src} // Replace with actual image.src in production
                alt={image.alt}
                className="object-contain w-full h-full"
                width={itemWidth}
                height={itemHeight}
              />
            </div>
          ))}
          {displayImages.map((image, index) => (
            <div 
              key={`third-${index}`} 
              className="relative mx-2 flex-shrink-0"
              style={{ width: `${itemWidth}px`, height: `${itemHeight}px` }}
            >
              <Image 
                src={image.src} // Replace with actual image.src in production
                alt={image.alt}
                className="object-contain w-full h-full"
                width={itemWidth}
                height={itemHeight}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// Default export the main component
export default ContinuousCarousel;