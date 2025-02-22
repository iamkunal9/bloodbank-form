import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentDonations() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">John Doe</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Mumbai, Maharashtra</p>
        </div>
        <div className="ml-auto font-medium">O+</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Jane Lee</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Delhi</p>
        </div>
        <div className="ml-auto font-medium">A-</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>RK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Rahul Kumar</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Bangalore, Karnataka</p>
        </div>
        <div className="ml-auto font-medium">B+</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>PS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Priya Singh</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Chennai, Tamil Nadu</p>
        </div>
        <div className="ml-auto font-medium">AB+</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Amit Mehta</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Kolkata, West Bengal</p>
        </div>
        <div className="ml-auto font-medium">A+</div>
      </div>
    </div>
  )
}

