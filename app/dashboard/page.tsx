"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpIcon, BarChart3, LineChart, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Trade } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PieChart as RePieChart, Pie, Cell, Tooltip as ReTooltip, BarChart as ReBarChart, XAxis, YAxis, Bar, ResponsiveContainer, LineChart as ReLineChart, Line, CartesianGrid } from "recharts"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [trades, setTrades] = useState<Trade[]>([])
  const [metrics, setMetrics] = useState({
    totalTrades: 0,
    winRate: 0,
    avgGain: 0,
    avgLoss: 0,
    profitFactor: 0,
    netProfit: 0,
    avgRR: 0,
    rrChange: 0,
    tradesChange: 0,
    winRateChange: 0,
    profitChange: 0,
  })
  const [equityCurve, setEquityCurve] = useState<{ date: string; value: number }[]>([])
 
  useEffect(() => {
    const fetchTrades = async () => {
      setIsLoading(true)
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        const userId = userData.user?.id
        if (!userId) {
          <div className="flex h-screen flex-col items-center justify-center bg-[#185e61]">
            <div className='flex flex-col items-center justify-center gap-4 border border-1 bg-white p-6 rounded-lg shadow-md'>
            <Link href="/" className="flex items-center gap-2 font-bold text-[#185E61]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" />
              </svg>
              <span>TraderTrackr</span>
            </Link>
                <h1 className="text-2xl font-bold">You are not logged in</h1>
                <p className="text-muted-foreground">Please log in to access the dashboard</p>
                <div className="flex gap-2">
                    <Button asChild className='bg-[#185E61] text-white hover:bg-[#0f4c4e]'>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                </div>
            </div>
        </div>
        }
        // Fetch all trades for the user
        let query = supabase.from("trades").select("*").eq("user_id", userId).order("entry_date", { ascending: false })
        const { data, error } = await query
        if (error) throw error
        setTrades(data as Trade[])
        calculateMetrics(data as Trade[])
        setEquityCurve(getEquityCurveData(data as Trade[]))
        
      } catch (error) {
        // Optionally handle error
      } finally {
        setIsLoading(false)
      }
    }
    fetchTrades()
  }, [])

  const calculateMetrics = (trades: Trade[]) => {
    const totalTrades = trades.length
    if (totalTrades === 0) {
      setMetrics({
        totalTrades: 0,
        winRate: 0,
        avgGain: 0,
        avgLoss: 0,
        profitFactor: 0,
        netProfit: 0,
        avgRR: 0,
        rrChange: 0,
        tradesChange: 0,
        winRateChange: 0,
        profitChange: 0,
      })
      return
    }
    const winningTrades = trades.filter((trade) => trade.profit_loss && trade.profit_loss > 0)
    const losingTrades = trades.filter((trade) => trade.profit_loss && trade.profit_loss < 0)
    const winRate = (winningTrades.length / totalTrades) * 100
    const totalGain = winningTrades.reduce((sum, trade) => sum + (trade.profit_loss || 0), 0)
    const totalLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.profit_loss || 0), 0))
    const avgGain = winningTrades.length > 0 ? totalGain / winningTrades.length : 0
    const avgLoss = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0
    const profitFactor = totalLoss > 0 ? totalGain / totalLoss : totalGain > 0 ? Number.POSITIVE_INFINITY : 0
    const netProfit = totalGain - totalLoss
    // RR Ratio
    const rrRatios = trades.map((trade) => {
      const { entry_price, target, stop_loss, trade_type } = trade;

      if (!entry_price || !target || !stop_loss || !trade_type) return null;

      const longTypes = ['Buy', 'Buy Call', 'Buy Put', 'Long'];
      const shortTypes = ['Sell', 'Sell Call', 'Sell Put', 'Short'];

      if (longTypes.includes(trade_type)) {
        return (target - entry_price) / (entry_price - stop_loss);
      } else if (shortTypes.includes(trade_type)) {
        return (entry_price - target) / (stop_loss - entry_price);
      }

      return null;
    }).filter((v) => v !== null && isFinite(v)) as number[];

    const avgRR = rrRatios.length > 0
      ? rrRatios.reduce((a, b) => a + b, 0) / rrRatios.length
      : 0;

    // Change calculations (current month vs previous month)
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0) // Last day of previous month
    
    const tradesCurrentMonth = trades.filter(t => {
      const tradeDate = new Date(t.entry_date)
      return tradeDate >= currentMonthStart
    })
    const tradesPreviousMonth = trades.filter(t => {
      const tradeDate = new Date(t.entry_date)
      return tradeDate >= previousMonthStart && tradeDate <= previousMonthEnd
    })
    
    // Trades change calculation
    const tradesChange = tradesPreviousMonth.length > 0 
      ? ((tradesCurrentMonth.length - tradesPreviousMonth.length) / tradesPreviousMonth.length) * 100 
      : tradesCurrentMonth.length > 0 ? 100 : 0
    
    // Win rate calculations
    const winRateCurrentMonth = tradesCurrentMonth.length > 0 
      ? (tradesCurrentMonth.filter(t => t.profit_loss && t.profit_loss > 0).length / tradesCurrentMonth.length) * 100 
      : 0
    const winRatePreviousMonth = tradesPreviousMonth.length > 0 
      ? (tradesPreviousMonth.filter(t => t.profit_loss && t.profit_loss > 0).length / tradesPreviousMonth.length) * 100 
      : 0
    const winRateChange = winRatePreviousMonth > 0 
      ? ((winRateCurrentMonth - winRatePreviousMonth) / winRatePreviousMonth) * 100 
      : winRateCurrentMonth > 0 ? 100 : 0
    
    // Profit calculations
    const profitCurrentMonth = tradesCurrentMonth.reduce((sum, t) => sum + (t.profit_loss || 0), 0)
    const profitPreviousMonth = tradesPreviousMonth.reduce((sum, t) => sum + (t.profit_loss || 0), 0)
    const profitChange = profitPreviousMonth !== 0 
      ? ((profitCurrentMonth - profitPreviousMonth) / Math.abs(profitPreviousMonth)) * 100 
      : profitCurrentMonth !== 0 ? (profitCurrentMonth > 0 ? 100 : -100) : 0
    
    // RR ratio calculations for previous month (using same logic as current)
    const rrRatiosPrevMonth = tradesPreviousMonth.map((trade) => {
      const { entry_price, target, stop_loss, trade_type } = trade;

      if (!entry_price || !target || !stop_loss || !trade_type) return null;

      const longTypes = ['Buy', 'Buy Call', 'Buy Put', 'Long'];
      const shortTypes = ['Sell', 'Sell Call', 'Sell Put', 'Short'];

      if (longTypes.includes(trade_type)) {
        return (target - entry_price) / (entry_price - stop_loss);
      } else if (shortTypes.includes(trade_type)) {
        return (entry_price - target) / (stop_loss - entry_price);
      }

      return null;
    }).filter((v) => v !== null && isFinite(v)) as number[];

    const avgRRPrevMonth = rrRatiosPrevMonth.length > 0
      ? rrRatiosPrevMonth.reduce((a, b) => a + b, 0) / rrRatiosPrevMonth.length
      : 0;
    
    const rrChange = avgRRPrevMonth > 0 
      ? ((avgRR - avgRRPrevMonth) / avgRRPrevMonth) * 100 
      : avgRR > 0 ? 100 : 0
    setMetrics({
      totalTrades,
      winRate,
      avgGain,
      avgLoss,
      profitFactor,
      netProfit,
      avgRR,
      rrChange,
      tradesChange,
      winRateChange,
      profitChange,
    })
  }

  const getEquityCurveData = (trades: Trade[]) => {
    const sortedTrades = [...trades].sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime())
    let cumulative = 0
    const curve = sortedTrades.map((trade) => {
      cumulative += trade.profit_loss || 0
      return {
        date: new Date(trade.entry_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        value: cumulative,
      }
    })
    return curve
  }


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  // Recent trades: show 5 most recent
  const recentTrades = trades.slice(0, 5)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : trades.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Data Available</CardTitle>
              <CardDescription>
                No trades found. Add trades to see your dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            {/* Top metrics cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalTrades}</div>
                  <p className="text-xs text-muted-foreground">{metrics.tradesChange >= 0 ? "+" : ""}{metrics.tradesChange.toFixed(1)}% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPercentage(metrics.winRate)}</div>
                  <p className="text-xs text-muted-foreground">{metrics.winRateChange >= 0 ? "+" : ""}{metrics.winRateChange.toFixed(1)}% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`flex items-center text-2xl font-bold ${metrics.netProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {metrics.netProfit >= 0 ? "+" : "-"}{formatCurrency(Math.abs(metrics.netProfit))}
                    <ArrowUpIcon className="ml-1 h-4 w-4" />
                  </div>
                  <p className="text-xs text-muted-foreground">{metrics.profitChange >= 0 ? "+" : ""}{metrics.profitChange.toFixed(1)}% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average RR Ratio</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.avgRR.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">{metrics.rrChange >= 0 ? "+" : ""}{metrics.rrChange.toFixed(2)} from last month</p>
                </CardContent>
              </Card>
            </div>
            {/* Overview Tab */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Performance Overview</CardTitle>
                      <CardDescription>Your trading performance over the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReLineChart data={equityCurve}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <ReTooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#185E61"
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 6 }}
                            />
                          </ReLineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Trades</CardTitle>
                      <CardDescription>Your most recent trading activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {recentTrades.map((trade, idx) => (
                          <div className="flex items-center" key={trade.id}>
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">{trade.ticker_symbol}</p>
                              <p className="text-sm text-muted-foreground">{trade.trade_type}</p>
                            </div>
                            <div className={`ml-auto font-medium ${(trade.profit_loss ?? 0) >= 0 ? "text-green-500" : "text-red-500"}`}>
                              {(trade.profit_loss ?? 0) >= 0 ? "+" : "-"}${Math.abs(trade.profit_loss ?? 0).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                </div>
              </TabsContent>
              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Trading Reports</CardTitle>
                    <CardDescription>Generate and download trading reports</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[400px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                      Reports Interface
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
