"use client"

import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function OrderImage({
  thumbSrc,
  fullSrc,
  alt,
}: {
  thumbSrc: string
  fullSrc: string
  alt: string
}) {
  return (
    <Dialog>
      <DialogTrigger className="group block w-full cursor-zoom-in overflow-hidden rounded-md ring-1 ring-border">
        <Image
          src={thumbSrc}
          alt={alt}
          width={900}
          height={600}
          unoptimized
          className="max-h-96 w-full bg-muted object-contain transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </DialogTrigger>
      <DialogContent
        showCloseButton
        className="max-w-[95vw] border-none bg-transparent p-0 ring-0 sm:max-w-5xl"
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <Image
          src={fullSrc}
          alt={alt}
          width={1600}
          height={1200}
          unoptimized
          className="max-h-[85vh] w-full rounded-lg object-contain"
        />
      </DialogContent>
    </Dialog>
  )
}
