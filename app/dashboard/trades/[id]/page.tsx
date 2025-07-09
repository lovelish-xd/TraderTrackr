"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import type { Trade } from "@/lib/supabase"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function TradeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params)
  
  const router = useRouter()
  const { toast } = useToast()
  const { isLoading: authLoading, isAuthenticated, userId } = useAuth()
  const [trade, setTrade] = useState<Trade | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [screenshotUrl, setScreenshotUrl] = useState("")

  useEffect(() => {
    const fetchTrade = async () => {
      if (!isAuthenticated || !userId) return
      
      setIsLoading(true)
      try {

        if (!userId) {
          throw new Error("User not authenticated")
        }

        const { data, error } = await supabase
          .from("trades")
          .select("*")
          .eq("id", resolvedParams.id)
          .eq("user_id", userId)
          .single()

        if (error) {
          throw error
        }

        if (!data) {
          throw new Error("Trade not found")
        }

        setTrade(data as Trade)
      
        const screenshotPath = data.trade_screenshot || ""


        if (screenshotPath && screenshotPath.trim() !== "") {
          try {

            const { data: fileList, error: listError } = await supabase.storage
              .from("trade-images")
              .list("", { search: screenshotPath })
                
            // Create signed URL with longer expiration (24 hours)
            const { data: imageData, error: imageError } = await supabase.storage
              .from("trade-images")
              .createSignedUrl(screenshotPath, 24 * 60 * 60) // 24 hours
            
            if (imageError) {
              console.error("Error creating signed URL:", imageError)
              console.error("Error details:", {
                message: imageError.message
              })
            } else if (imageData?.signedUrl) {
              setScreenshotUrl(imageData.signedUrl)
              
              // Verify the URL is accessible
              try {
                const response = await fetch(imageData.signedUrl, { method: 'HEAD' })
              } catch (fetchError) {
                console.error("URL not accessible:", fetchError)
              }
            } else {
              console.error("No signed URL returned despite no error")
            }
          } catch (error) {
            console.error("Unexpected error:", error)
          }
        } else {
          console.log("No screenshot path provided or path is empty")
        }
        
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch trade details. Please try again.",
          variant: "destructive",
        })
        router.push("/dashboard/trades")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrade()

  }, [isAuthenticated, userId, resolvedParams.id, router, toast])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this trade?")) {
      return
    }

    try {
      const { error } = await supabase.from("trades").delete().eq("id", resolvedParams.id)

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Trade deleted successfully",
      })
      router.push("/dashboard/trades")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete trade. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  }

  const formatCurrency = (value: number | null | undefined, currency: string | null | undefined) => {
    if (value === null || value === undefined || !currency) return "-"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(value)
  }

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex h-40 items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Redirecting to login...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!trade) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        {/* Header Section - Mobile Responsive */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.push("/dashboard/trades")}
              className="shrink-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Trades</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
          
          {/* Action Buttons - Stack on mobile, inline on desktop */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/dashboard/trades/edit/${resolvedParams.id}`)}
              className="w-full sm:w-auto"
            >
              <Edit className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Edit Trade</span>
              <span className="sm:hidden">Edit</span>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Delete Trade</span>
              <span className="sm:hidden">Delete</span>
            </Button>
          </div>
        </div>

        {/* Main Content - Mobile Responsive Grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Trade Information Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Trade Information</CardTitle>
              <CardDescription>Basic details about the trade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ticker Symbol</p>
                  <p className="text-lg font-semibold break-all">{trade.ticker_symbol}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Instrument Type</p>
                  <p className="text-lg font-semibold">{trade.instrument_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trade Type</p>
                  <p className="text-lg font-semibold">{trade.trade_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Strategy</p>
                  <p className="text-lg font-semibold">{trade.strategy || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trade Currency</p>
                  <p className="text-lg font-semibold">{trade.currency || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entry Time</p>
                  <p className="text-lg font-semibold">{trade.entry_time || "Not given"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entry Date</p>
                  <p className="text-lg font-semibold">{formatDate(trade.entry_date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Exit Time</p>
                  <p className="text-lg font-semibold">{trade.exit_time || "Not given"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Exit Date</p>
                  <p className="text-lg font-semibold">{trade.exit_date ? formatDate(trade.exit_date) : "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trade Performance Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Trade Performance</CardTitle>
              <CardDescription>Financial details and outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entry Price</p>
                  <p className="text-lg font-semibold break-all">{formatCurrency(trade.entry_price, trade.currency)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Exit Price</p>
                  <p className="text-lg font-semibold break-all">{formatCurrency(trade.exit_price, trade.currency) || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Position Size</p>
                  <p className="text-lg font-semibold">{trade.position_size}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stop Loss</p>
                  <p className="text-lg font-semibold break-all">{formatCurrency(trade.stop_loss, trade.currency) || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Target</p>
                  <p className="text-lg font-semibold break-all">{formatCurrency(trade.target, trade.currency) || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fees/Commissions</p>
                  <p className="text-lg font-semibold break-all">{formatCurrency(trade.fees, trade.currency) || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profit/Loss</p>
                  <p className={`text-lg font-semibold break-all ${trade.profit_loss ? (trade.profit_loss > 0 ? "text-green-500" : "text-red-500") : ""}`}>
                    {formatCurrency(trade.profit_loss, trade.currency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trade Analysis Card */}
          {(trade.rationale || trade.market_conditions || trade.pre_trade_emotion || trade.post_trade_reflection) && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Trade Analysis</CardTitle>
                <CardDescription>Additional information and reflections about the trade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {trade.rationale && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Trade Rationale</p>
                    <div className="rounded-md bg-muted/50 p-3">
                      <p className="whitespace-pre-wrap text-sm">{trade.rationale}</p>
                    </div>
                  </div>
                )}
                {trade.market_conditions && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Market Conditions</p>
                    <div className="rounded-md bg-muted/50 p-3">
                      <p className="whitespace-pre-wrap text-sm">{trade.market_conditions}</p>
                    </div>
                  </div>
                )}
                {trade.pre_trade_emotion && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Pre-trade Mindset</p>
                    <div className="rounded-md bg-muted/50 p-3">
                      <p className="whitespace-pre-wrap text-sm">{trade.pre_trade_emotion}</p>
                    </div>
                  </div>
                )}
                {trade.post_trade_reflection && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Post-trade Reflection</p>
                    <div className="rounded-md bg-muted/50 p-3">
                      <p className="whitespace-pre-wrap text-sm">{trade.post_trade_reflection}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Trade Screenshot Card */}
          {screenshotUrl && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Trade Screenshot</CardTitle>
                <CardDescription>A visual reference associated with this trade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full rounded-md overflow-hidden border">
                  <img
                    src={screenshotUrl}
                    alt="Trade Screenshot"
                    className="w-full h-auto object-contain "
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}