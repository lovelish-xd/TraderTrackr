"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpIcon, BarChart3, LineChart, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Trade } from "@/lib/supabase"
import { Tooltip as ReTooltip, XAxis, YAxis, ResponsiveContainer, LineChart as ReLineChart, Line, CartesianGrid } from "recharts"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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
    const checkAuthAndFetchTrades = async () => {
      setIsLoading(true)
      
      try {
        // First check if there's an active session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !sessionData.session) {
          window.location.href = '/login'
          return
        }

        // Then get user data
        const { data: userData, error: userError } = await supabase.auth.getUser()
        
        // Check if user is authenticated
        if (userError || !userData.user?.id) {
          // Redirect to login if not authenticated
          window.location.href = '/login'
          return
        }
        
        const userId = userData.user.id
        setIsAuthenticated(true)
        
        // Fetch all trades for the user
        let query = supabase.from("trades").select("*").eq("user_id", userId).order("entry_date", { ascending: false })
        const { data, error } = await query
        if (error) throw error
        setTrades(data as Trade[])
        calculateMetrics(data as Trade[])
        setEquityCurve(getEquityCurveData(data as Trade[]))

      } catch (error) {
        console.error('Error fetching trades:', error)
        // If there's an auth error, redirect to login
        if (error && typeof error === 'object' && 'message' in error) {
          const errorMessage = (error as { message: string }).message
          if (errorMessage.includes('Auth session missing') || errorMessage.includes('JWT')) {
            window.location.href = '/login'
            return
          }
        }
      } finally {
        setIsLoading(false)
      }
    }
    checkAuthAndFetchTrades()
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
        ) : !isAuthenticated ? (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Redirecting to login...</p>
            </div>
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
                  <div className={`text-2xl font-bold ${metrics.winRate >= 0 ? "text-green-500" : "text-red-500"}`}>{formatPercentage(metrics.winRate)}</div>
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
                  <div className={`text-2xl font-bold ${metrics.avgRR >= 0 ? "text-green-500" : "text-red-500"}`}>{metrics.avgRR.toFixed(2)}</div>
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
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <LineChart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle>Performance Overview</CardTitle>
                          <CardDescription>Your trading performance over the last 30 days</CardDescription>
                        </div>
                      </div>
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
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-5 w-5 text-primary"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12,6 12,12 16,14" />
                          </svg>
                        </div>
                        <div>
                          <CardTitle>Recent Trades</CardTitle>
                          <CardDescription>Your most recent trading activity</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {recentTrades.map((trade, idx) => (
                          <div className="flex items-center" key={trade.id}>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 mr-3">
                              {(trade.profit_loss ?? 0) >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                </svg>
                              )}
                            </div>
                            <div className="ml-1 space-y-1">
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
                <div>
                  {/* Top Performing Assets Section */}
                  <Card className="bg-card border-border">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle>Top 5 Best Performing Assets</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground mt-1">
                              Ranked by total profit across all trades
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Tabs defaultValue="all-time" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 max-w-[240px] mb-6">
                          <TabsTrigger value="all-time" className="text-sm font-medium">All Time</TabsTrigger>
                          <TabsTrigger value="monthly" className="text-sm font-medium">This Month</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all-time" className="mt-0">
                          <div className="space-y-3">
                            {(() => {
                              // Group trades by ticker_symbol
                              const assetMap: Record<string, {
                                trades: Trade[],
                                totalProfit: number,
                              }> = {}
                              trades.forEach(trade => {
                                const ticker = trade.ticker_symbol || "N/A"
                                if (!assetMap[ticker]) {
                                  assetMap[ticker] = { trades: [], totalProfit: 0 }
                                }
                                assetMap[ticker].trades.push(trade)
                                assetMap[ticker].totalProfit += trade.profit_loss || 0
                              })
                              // Sort by totalProfit desc, take top 5
                              const topAssets = Object.entries(assetMap)
                                .sort((a, b) => b[1].totalProfit - a[1].totalProfit)
                                .slice(0, 5)

                              if (topAssets.length === 0) {
                                return (
                                  <div className="text-center py-8 text-muted-foreground">
                                    <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No trades found for this period</p>
                                  </div>
                                )
                              }

                              return topAssets.map(([ticker, info], index) => {
                                const totalTrades = info.trades.length
                                const isProfit = info.totalProfit >= 0
                                const rankColors = [
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
                                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
                                  'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200',
                                  'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
                                  'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200'
                                ]
                                const rankIcons = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

                                return (
                                  <div key={ticker} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-200 hover:border-primary/20">
                                    <div className="flex items-center gap-4">
                                      <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${rankColors[index]}`}>
                                        {rankIcons[index]}
                                      </div>
                                      <div>
                                        <p className="font-semibold text-base text-foreground">{ticker}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {totalTrades} trade{totalTrades !== 1 ? 's' : ''}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className={`text-lg  ${isProfit ? "text-green-500 dark:text-green-500" : "text-red-500 dark:text-red-500"}`}>
                                        {isProfit ? "+" : ""}${info.totalProfit.toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                            })()}
                          </div>
                        </TabsContent>
                        <TabsContent value="monthly" className="mt-0">
                          <div className="space-y-3">
                            {(() => {
                              // Filter trades for current month
                              const now = new Date()
                              const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
                              const monthlyTrades = trades.filter(trade => {
                                const tradeDate = new Date(trade.entry_date)
                                return tradeDate >= currentMonthStart
                              })

                              // Group monthly trades by ticker_symbol
                              const assetMap: Record<string, {
                                trades: Trade[],
                                totalProfit: number,
                              }> = {}
                              monthlyTrades.forEach(trade => {
                                const ticker = trade.ticker_symbol || "N/A"
                                if (!assetMap[ticker]) {
                                  assetMap[ticker] = { trades: [], totalProfit: 0 }
                                }
                                assetMap[ticker].trades.push(trade)
                                assetMap[ticker].totalProfit += trade.profit_loss || 0
                              })
                              // Sort by totalProfit desc, take top 5
                              const topAssets = Object.entries(assetMap)
                                .sort((a, b) => b[1].totalProfit - a[1].totalProfit)
                                .slice(0, 5)

                              if (topAssets.length === 0) {
                                return (
                                  <div className="text-center py-8 text-muted-foreground">
                                    <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No trades found for this month</p>
                                  </div>
                                )
                              }

                              return topAssets.map(([ticker, info], index) => {
                                const totalTrades = info.trades.length
                                const isProfit = info.totalProfit >= 0
                                const rankColors = [
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
                                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
                                  'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200',
                                  'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
                                  'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200'
                                ]
                                const rankIcons = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

                                return (
                                  <div key={ticker} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-200 hover:border-primary/20">
                                    <div className="flex items-center gap-4">
                                      <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${rankColors[index]}`}>
                                        {rankIcons[index]}
                                      </div>
                                      <div>
                                        <p className="font-semibold text-base text-foreground">{ticker}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {totalTrades} trade{totalTrades !== 1 ? 's' : ''}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className={`text-lg  ${isProfit ? "text-green-500 dark:text-green-500" : "text-red-500 dark:text-red-500"}`}>
                                        {isProfit ? "+" : ""}${info.totalProfit.toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                            })()}
                          </div>
                        </TabsContent>
                      </Tabs>
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
