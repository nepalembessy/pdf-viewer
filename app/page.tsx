import { Wrench } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-6">
          <Wrench className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Under Maintenance</h1>
        <p className="text-muted-foreground">
          We're currently performing scheduled maintenance. Please check back later.
        </p>
      </div>
    </div>
  )
}
