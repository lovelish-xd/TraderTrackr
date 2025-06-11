"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpIcon, BarChart3, LineChart, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Trade } from "@/lib/supabase"
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
  const [instrumentPerformance, setInstrumentPerformance] = useState<any[]>([])
  const [strategyPerformance, setStrategyPerformance] = useState<any[]>([])

  useEffect(() => {
    const fetchTrades = async () => {
      setIsLoading(true)
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        const userId = userData.user?.id
        if (!userId) throw new Error("User not authenticated")
        // Fetch all trades for the user
        let query = supabase.from("trades").select("*").eq("user_id", userId).order("entry_date", { ascending: false })
        const { data, error } = await query
        if (error) throw error
        setTrades(data as Trade[])
        calculateMetrics(data as Trade[])
        setEquityCurve(getEquityCurveData(data as Trade[]))
        setInstrumentPerformance(getInstrumentPerformance(data as Trade[]))
        setStrategyPerformance(getStrategyPerformance(data as Trade[]))
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

    // Change calculations (last month vs previous month)
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())
    const tradesLastMonth = trades.filter(t => new Date(t.entry_date) >= lastMonth)
    const tradesPrevMonth = trades.filter(t => new Date(t.entry_date) >= prevMonth && new Date(t.entry_date) < lastMonth)
    const tradesChange = tradesPrevMonth.length > 0 ? ((tradesLastMonth.length - tradesPrevMonth.length) / tradesPrevMonth.length) * 100 : 0
    const winRateLastMonth = tradesLastMonth.length > 0 ? (tradesLastMonth.filter(t => t.profit_loss && t.profit_loss > 0).length / tradesLastMonth.length) * 100 : 0
    const winRatePrevMonth = tradesPrevMonth.length > 0 ? (tradesPrevMonth.filter(t => t.profit_loss && t.profit_loss > 0).length / tradesPrevMonth.length) * 100 : 0
    const winRateChange = winRatePrevMonth > 0 ? winRateLastMonth - winRatePrevMonth : 0
    const profitLastMonth = tradesLastMonth.reduce((sum, t) => sum + (t.profit_loss || 0), 0)
    const profitPrevMonth = tradesPrevMonth.reduce((sum, t) => sum + (t.profit_loss || 0), 0)
    const profitChange = profitPrevMonth !== 0 ? ((profitLastMonth - profitPrevMonth) / Math.abs(profitPrevMonth)) * 100 : 0
    const rrPrevMonth = tradesPrevMonth.map((trade) => {
      if (trade.target && trade.stop_loss && trade.entry_price) {
        return Math.abs((trade.target - trade.entry_price) / (trade.entry_price - trade.stop_loss))
      }
      return null
    }).filter((v) => v !== null) as number[]
    const rrChange = rrPrevMonth.length > 0 ? avgRR - (rrPrevMonth.reduce((a, b) => a + b, 0) / rrPrevMonth.length) : 0
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

  const getInstrumentPerformance = (trades: Trade[]) => {
    const instrumentMap: Record<string, { count: number; PnL: number; }> = {}
    trades.forEach((trade) => {
      const type = trade.instrument_type || "Unknown"
      if (!instrumentMap[type]) {
        instrumentMap[type] = { count: 0, PnL: 0 }
      }
      instrumentMap[type].count += 1
      instrumentMap[type].PnL += trade.profit_loss || 0
    })
    return Object.entries(instrumentMap).map(([type, value]) => ({
      name: type,
      PnL: parseFloat(value.PnL.toFixed(2)),
      value: value.count,
    }))
  }

  const getStrategyPerformance = (trades: Trade[]) => {
    const strategyMap: Record<string, { count: number; PnL: number; }> = {}
    trades.forEach((trade) => {
      const strategy = trade.strategy || "Unknown"
      if (!strategyMap[strategy]) {
        strategyMap[strategy] = { count: 0, PnL: 0 }
      }
      strategyMap[strategy].count += 1
      strategyMap[strategy].PnL += trade.profit_loss || 0
    })
    return Object.entries(strategyMap).map(([type, value]) => ({
      name: type,
      PnL: parseFloat(value.PnL.toFixed(2)),
      value: value.count,
    }))
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
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>Monthly Performance</CardTitle>
                      <CardDescription>Your trading performance by month</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                        Monthly Performance Chart
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Win/Loss Ratio</CardTitle>
                      <CardDescription>Distribution of winning and losing trades</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                        Win/Loss Pie Chart
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
