import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Shield, Upload } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">Secure PDF Sharing</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional document sharing platform with password protection and secure access controls.
            </p>
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Coming Soon
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Easy Upload</h3>
                <p className="text-muted-foreground text-sm">
                  Upload PDFs with a simple drag-and-drop interface and generate secure sharing links instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Password Protected</h3>
                <p className="text-muted-foreground text-sm">
                  Each shared document is protected with a unique password for secure access control.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Admin Dashboard</h3>
                <p className="text-muted-foreground text-sm">
                  Comprehensive admin panel to manage all shared documents and track access.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
            <h2 className="text-2xl font-bold mb-4">Get Early Access</h2>
            <p className="text-muted-foreground mb-6">
              Be the first to know when our secure PDF sharing platform launches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button className="w-full sm:w-auto">Notify Me</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
