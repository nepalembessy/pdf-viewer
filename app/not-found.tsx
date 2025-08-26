import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileX, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <FileX className="w-8 h-8 text-slate-400" />
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>The page you're looking for doesn't exist or has been moved.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/">
            <Button className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
