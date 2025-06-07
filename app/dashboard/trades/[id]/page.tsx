"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import type { Trade } from "@/lib/supabase"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"

export default function TradeDetailsPage({ params }: { params: { id: string } }) {

  const router = useRouter()
  const { toast } = useToast()
  const [trade, setTrade] = useState<Trade | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
          throw userError
        }

        const userId = userData.user?.id

        if (!userId) {
          throw new Error("User not authenticated")
        }

        const { data, error } = await supabase
          .from("trades")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", userId)
          .single()

        if (error) {
          throw error
        }

        if (!data) {
          throw new Error("Trade not found")
        }

        setTrade(data as Trade)
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
  }, [params.id, router, toast])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this trade?")) {
      return
    }

    try {
      const { error } = await supabase.from("trades").delete().eq("id", params.id)

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!trade) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/dashboard/trades")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trades
            </Button>
            <h1 className="text-3xl font-bold">Trade Details</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/trades/${params.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Trade
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Trade
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Trade Information</CardTitle>
              <CardDescription>Basic details about the trade</CardDescription>
            </CardHeader>
            <CardContent className="gridgap-4">
              <div className="grid grid-cols-5 gap-x-4 gap-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ticker Symbol</p>
                  <p className="text-lg font-semibold">{trade.ticker_symbol}</p>
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
          <Card className="md:col-span-2" >
            <CardHeader>
              <CardTitle>Trade Performance</CardTitle>
              <CardDescription>Financial details and outcomes</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-5 gap-x-4 gap-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entry Price</p>
                  <p className="text-lg font-semibold">{formatCurrency(trade.entry_price, trade.currency)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Exit Price</p>
                  <p className="text-lg font-semibold">{formatCurrency(trade.exit_price, trade.currency) || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Position Size</p>
                  <p className="text-lg font-semibold">{trade.position_size}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stop Loss</p>
                  <p className="text-lg font-semibold">{formatCurrency(trade.stop_loss, trade.currency) || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Target</p>
                  <p className="text-lg font-semibold">{formatCurrency(trade.target, trade.currency) || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fees/Commisions</p>
                  <p className="text-lg font-semibold">{formatCurrency(trade.fees, trade.currency) || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profit/Loss</p>
                  <p className={`text-lg font-semibold ${trade.profit_loss ? (trade.profit_loss > 0 ? "text-green-500" : "text-red-500") : ""}`}>
                    {formatCurrency(trade.profit_loss, trade.currency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {(trade.rationale || trade.market_conditions || trade.pre_trade_emotion || trade.post_trade_reflection) && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Trade Analysis</CardTitle>
                <CardDescription>Additional information and reflections about the trade</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {trade.rationale && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trade Rationale</p>
                    <p className="mt-1 whitespace-pre-wrap">{trade.rationale}</p>
                  </div>
                )}
                {trade.market_conditions && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Market Conditions</p>
                    <p className="mt-1 whitespace-pre-wrap">{trade.market_conditions}</p>
                  </div>
                )}
                {trade.pre_trade_emotion && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pre-trade Mindset</p>
                    <p className="mt-1 whitespace-pre-wrap">{trade.pre_trade_emotion}</p>
                  </div>
                )}
                {trade.post_trade_reflection && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Post-trade Reflection</p>
                    <p className="mt-1 whitespace-pre-wrap">{trade.post_trade_reflection}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
