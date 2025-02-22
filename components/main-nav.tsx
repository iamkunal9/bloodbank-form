import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
        <Image className="" alt="Logo" src="/logo.png" width={100} height={100}/>
        
      </Link>
    </nav>
  )
}

