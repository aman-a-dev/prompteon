"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { animate } from "motion/react";
import { cn } from "@/lib/utils";

interface ImageMouseTrailProps {
  items: string[];
  children?: ReactNode;
  className?: string;
  imgClass?: string;
  distance?: number;
  maxNumberOfImages?: number;
}

export default function ImageCursorTrail({
  items = [],
  children,
  className,
  imgClass = "w-40 h-48",
  distance = 40,
  maxNumberOfImages = 8,
}: ImageMouseTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const globalIndexRef = useRef(0);
  const zIndexRef = useRef(1);
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY : e.clientY;

      if (clientX === undefined || clientY === undefined) return;

      const lastX = lastPositionRef.current.x;
      const lastY = lastPositionRef.current.y;

      if (lastX === 0 && lastY === 0) {
        lastPositionRef.current = { x: clientX, y: clientY };
        return;
      }

      const dist = Math.hypot(clientX - lastX, clientY - lastY);

      if (dist > distance) {
        const count = Math.floor(dist / distance);

        for (let i = 1; i <= count; i++) {
          const t = i / count;
          const x = lastX + (clientX - lastX) * t;
          const y = lastY + (clientY - lastY) * t;
          activateImage(x, y);
        }

        lastPositionRef.current = { x: clientX, y: clientY };
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current.clear();
    };
  }, [distance, items, maxNumberOfImages]);

  const activateImage = (clientX: number, clientY: number) => {
    if (!containerRef.current || !items || items.length === 0) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - containerRect.left;
    const relativeY = clientY - containerRect.top;

    const img = document.createElement("img");
    img.src = items[globalIndexRef.current % items.length]!;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.className = cn(
      "pointer-events-none absolute rounded-3xl object-cover shadow-xl",
      imgClass,
    );

    Object.assign(img.style, {
      left: `${relativeX}px`,
      top: `${relativeY}px`,
      zIndex: String(zIndexRef.current),
      position: "absolute",
      transform: "translate(-50%, -50%) scale(0)",
      opacity: "0",
    });

    containerRef.current.appendChild(img);

    const activeImages = containerRef.current.querySelectorAll("img");
    if (activeImages.length > maxNumberOfImages) {
      activeImages[0]?.remove();
    }

    const rotation = Math.random() * 20 - 10;

    animate(
      img,
      {
        scale: [0, 1],
        opacity: [0, 1],
        rotate: [rotation - 10, rotation],
      },
      {
        type: "spring",
        stiffness: 400,
        damping: 20,
        mass: 0.8,
      },
    );

    const timer = setTimeout(() => {
      const controls = animate(
        img,
        {
          scale: 0,
          opacity: 0,
          rotate: rotation + 10,
        },
        {
          duration: 0.4,
          ease: "backIn",
        },
      );

      controls.then(() => {
        img.remove();
        timeoutsRef.current.delete(timer);
      });
    }, 1000);

    timeoutsRef.current.add(timer);

    globalIndexRef.current++;
    zIndexRef.current = (zIndexRef.current % 10000) + 1;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative grid w-full isolate place-content-center bg-transparent",
        className,
      )}
    >
      <div className="relative z-10001">{children}</div>
    </div>
  );
}
/*
"use client"

import ImageCursorTrail from "@workspace/ui/registry/radix-nova/image-trail/image-trail"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export default function ImageTrailPreview() {
  const images = [
    "https://res.cloudinary.com/dfjuuwtr6/image/upload/v1779383165/8a93491afd90a09985eaddce102b329b_efq8me.jpg",
    "https://res.cloudinary.com/dfjuuwtr6/image/upload/v1779383230/e5b9651df49a4940fbe124fd0a8df131_gvdvvx.jpg",
    "https://res.cloudinary.com/dfjuuwtr6/image/upload/v1779383249/3cfb769f842fb198f4e04e2a3d10be30_c8z9w4.jpg",
    "https://res.cloudinary.com/dfjuuwtr6/image/upload/v1779383361/ac04f0cd44103b4842b42e3d3eeb56d8_idq2x6.jpg",
    "https://res.cloudinary.com/dfjuuwtr6/image/upload/v1779383590/4967f9c721decc9415f4727448c5dd91_x3cgv3.jpg",
    "https://res.cloudinary.com/dfjuuwtr6/image/upload/v1779383546/4776e136af2fca9f4fce218289953224_szaihc.jpg",
    "https://res.cloudinary.com/dfjuuwtr6/image/upload/v1779383714/8c3b369438f3ea034311f6ad63cea0ba_loyee8.jpg",
    "https://res.cloudinary.com/dfjuuwtr6/image/upload/v1779383627/b5e62228f6f5a2b99dee39063b8238b4_tgve5o.jpg",
    "https://res.cloudinary.com/dfjuuwtr6/image/upload/v1779383508/e4e2e5463ccfefc3905eb5363edc6117_y1wowo.jpg",
  ]

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="mx-auto w-full">
      <div className="relative w-full flex items-center justify-center bg-background text-foreground">
        <p className="font-base pointer-events-none absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 text-xl tracking-tight">
          Wiggle your mouse around.
        </p>
        {mounted &&
          createPortal(
            <ImageCursorTrail
              items={images}
              maxNumberOfImages={6}
              distance={60}
              imgClass="sm:w-40 w-28 sm:h-48 h-36 border border-background"
              className="fixed inset-0 z-50 pointer-events-none"
            />,
            document.body
          )}
      </div>
    </section>
  )
}
*/
