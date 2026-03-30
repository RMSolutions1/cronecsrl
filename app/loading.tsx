import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-2.5 w-40" />
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-20 rounded-md" />
              ))}
              <Skeleton className="h-9 w-32 rounded-md ml-4" />
            </div>
            <Skeleton className="lg:hidden h-10 w-10 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background pt-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              <div className="lg:col-span-3 space-y-8 text-center lg:text-left">
                <Skeleton className="h-8 w-64 rounded-full mx-auto lg:mx-0" />
                <div className="space-y-4">
                  <Skeleton className="h-14 w-full max-w-lg mx-auto lg:mx-0" />
                  <Skeleton className="h-14 w-3/4 max-w-md mx-auto lg:mx-0" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full max-w-xl mx-auto lg:mx-0" />
                  <Skeleton className="h-6 w-4/5 max-w-lg mx-auto lg:mx-0" />
                </div>
                <div className="flex gap-4 justify-center lg:justify-start">
                  <Skeleton className="h-12 w-40 rounded-md" />
                  <Skeleton className="h-12 w-40 rounded-md" />
                </div>
              </div>
              <div className="lg:col-span-2">
                <Skeleton className="h-80 w-full rounded-3xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Animated loading indicator */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Skeleton className="h-6 w-32 rounded-full mx-auto" />
            <Skeleton className="h-12 w-96 max-w-full mx-auto" />
            <Skeleton className="h-6 w-80 max-w-full mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
