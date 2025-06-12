"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import type { Trade } from "@/lib/supabase"
import { PieChart as RePieChart, Pie, Cell, Tooltip as ReTooltip, BarChart as ReBarChart, XAxis, YAxis, Bar, ResponsiveContainer, LineChart as ReLineChart, Line, CartesianGrid } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AnalyticsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [trades, setTrades] = useState<Trade[]>([])
  const [timeframe, setTimeframe] = useState("30days")
  const [metrics, setMetrics] = useState({
    totalTrades: 0,
    winRate: 0,
    avgGain: 0,
    avgLoss: 0,
    profitFactor: 0,
    netProfit: 0,
    targetHitRate: 0,
    totalFees: 0,
  })
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28", "#FF4444", "#4DD0E1", "#A1887F", "#BA68C8", "#FFD54F", "#81C784"];


  const [instrumentDistribution, setInstrumentDistribution] = useState<any[]>([])
  const [instrumentPerformance, setInstrumentPerformance] = useState<any[]>([])
  const [strategyDistribution, setStrategyDistribution] = useState<any[]>([])
  const [strategyPerformance, setStrategyPerformance] = useState<any[]>([])
  const [equityCurve, setEquityCurve] = useState<{ date: string; value: number }[]>([])
  const [tradePerformanceData, setTradePerformanceData] = useState<any[]>([])
  const [winLossData, setWinLossData] = useState<any[]>([])

  // Utility functions for grouping
  function groupTradesByDay(trades: Trade[]) {
    const map: Record<string, number> = {}
    trades.forEach((trade) => {
      const date = new Date(trade.entry_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
      map[date] = (map[date] || 0) + (trade.profit_loss || 0)
    })
    return Object.entries(map).map(([date, value]) => ({ label: date, value }))
  }

  function groupTradesByMonth(trades: Trade[], monthsBack = 6) {
    const now = new Date();
    const map: Record<string, number> = {};
    trades.forEach((trade) => {
      const date = new Date(trade.entry_date);
      const label = date.toLocaleString("en-GB", { month: "short", year: "2-digit" });
      map[label] = (map[label] || 0) + (trade.profit_loss || 0);
    });
    // Fill missing months
    const result = [];
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("en-GB", { month: "short", year: "2-digit" });
      result.push({ label, value: map[label] || 0 });
    }
    return result;
  }

  function groupTradesByQuarter(trades: Trade[]) {
    const map: Record<string, number> = {};
    let minYear = new Date().getFullYear();
    let maxYear = new Date().getFullYear();
    let minQuarter = 1;
    let maxQuarter = 4;
    trades.forEach((trade) => {
      const date = new Date(trade.entry_date);
      const year = date.getFullYear();
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      minYear = Math.min(minYear, year);
      maxYear = Math.max(maxYear, year);
      if (year === minYear) minQuarter = Math.min(minQuarter, quarter);
      if (year === maxYear) maxQuarter = Math.max(maxQuarter, quarter);
      const label = `Q${quarter} '${String(year).slice(-2)}`;
      map[label] = (map[label] || 0) + (trade.profit_loss || 0);
    });
    // Fill missing quarters
    const result = [];
    for (let y = minYear; y <= maxYear; y++) {
      for (let q = 1; q <= 4; q++) {
        if ((y === minYear && q < minQuarter) || (y === maxYear && q > maxQuarter)) continue;
        const label = `Q${q} '${String(y).slice(-2)}`;
        result.push({ label, value: map[label] || 0 });
      }
    }
    return result;
  }

  function groupTradesByYear(trades: Trade[]) {
    const map: Record<string, number> = {};
    let minYear = new Date().getFullYear();
    let maxYear = new Date().getFullYear();
    trades.forEach((trade) => {
      const date = new Date(trade.entry_date);
      const year = date.getFullYear();
      minYear = Math.min(minYear, year);
      maxYear = Math.max(maxYear, year);
      map[year] = (map[year] || 0) + (trade.profit_loss || 0);
    });
    const result = [];
    for (let y = minYear; y <= maxYear; y++) {
      result.push({ label: y.toString(), value: map[y] || 0 });
    }
    return result;
  }

  function getTradePerformanceData(trades: Trade[], timeframe: string) {
    let data: { label: string, value: number }[] = [];
    if (timeframe === "7days") {
      const last7 = groupTradesByDay(trades)
      const days = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
        const found = last7.find((item) => item.label === label)
        days.push({ label, value: found ? found.value : 0 })
      }
      data = days
    } else if (timeframe === "30days") {
      data = groupTradesByMonth(trades, 6)
    } else if (timeframe === "90days") {
      data = groupTradesByQuarter(trades)
    } else {
      data = groupTradesByYear(trades)
    }
    // Map to absolute value for bar height, but keep original for coloring
    return data.map(item => ({ ...item, absValue: Math.abs(item.value), isProfit: item.value >= 0 }));
  }

  function getWinLossData(trades: Trade[]) {
    const win = trades.filter((t) => t.profit_loss && t.profit_loss > 0).length
    const loss = trades.filter((t) => t.profit_loss && t.profit_loss < 0).length
    return [
      { name: "Win", value: win },
      { name: "Loss", value: loss },
    ]
  }

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
          throw userError
        }

        const userId = userData.user?.id

        if (!userId) {
          throw new Error("User not authenticated")
        }

        let query = supabase.from("trades").select("*").eq("user_id", userId).order("entry_date", { ascending: false })

        // Apply timeframe filter
        if (timeframe && timeframe !== "all") {
          const now = new Date()
          const startDate = new Date()

          if (timeframe === "7days") {
            startDate.setDate(now.getDate() - 7)
          } else if (timeframe === "30days") {
            startDate.setDate(now.getDate() - 30)
          } else if (timeframe === "90days") {
            startDate.setDate(now.getDate() - 90)
          } else if (timeframe === "year") {
            startDate.setFullYear(now.getFullYear() - 1)
          }

          query = query.gte("entry_date", startDate.toISOString())
        }

        const { data, error } = await query

        if (error) {
          throw error
        }

        setTrades(data as Trade[])
        const instrumentMap: Record<string, { count: number; PnL: number; win: number; loss: number; }> = {}
        const strategyMap: Record<string, { count: number; PnL: number; win: number; loss: number; }> = {}

        data.forEach((trade) => {
          const type = trade.instrument_type || "Unknown"
          if (!instrumentMap[type]) {
            instrumentMap[type] = { count: 0, PnL: 0, win: 0, loss: 0 }
          }

          instrumentMap[type].count += 1
          instrumentMap[type].PnL += trade.profit_loss || 0
          if (trade.profit_loss > 0) instrumentMap[type].win += 1
          else if (trade.profit_loss < 0) instrumentMap[type].loss += 1
        })

        data.forEach((trade) => {
          const strategy = trade.strategy || "Unknown"
          if (!strategyMap[strategy]) {
            strategyMap[strategy] = { count: 0, PnL: 0, win: 0, loss: 0 }
          }

          strategyMap[strategy].count += 1
          strategyMap[strategy].PnL += trade.profit_loss || 0
          if (trade.profit_loss > 0) strategyMap[strategy].win += 1
          else if (trade.profit_loss < 0) strategyMap[strategy].loss += 1
        })

        const distribution = Object.entries(instrumentMap).map(([type, value]) => ({
          name: type,
          value: value.count,
        }))

        const performance = Object.entries(instrumentMap).map(([type, value]) => ({
          name: type,
          PnL: parseFloat(value.PnL.toFixed(2)),
          absPnL: Math.abs(parseFloat(value.PnL.toFixed(2))),
          isProfit: value.PnL >= 0,
          winRate: value.count > 0 ? (value.win / value.count) * 100 : 0
        }))

        const strategyDistribution = Object.entries(strategyMap).map(([type, value]) => ({
          name: type,
          value: value.count,
        }))

        const strategyPerformance = Object.entries(strategyMap).map(([type, value]) => ({
          name: type,
          PnL: parseFloat(value.PnL.toFixed(2)),
          absPnL: Math.abs(parseFloat(value.PnL.toFixed(2))),
          isProfit: value.PnL >= 0,
          winRate: value.count > 0 ? (value.win / value.count) * 100 : 0
        }))




        setInstrumentDistribution(distribution)
        setInstrumentPerformance(performance)
        setStrategyDistribution(strategyDistribution)
        setStrategyPerformance(strategyPerformance)


        calculateMetrics(data as Trade[])
        setEquityCurve(getEquityCurveData(data as Trade[], timeframe))
        setTradePerformanceData(getTradePerformanceData(data as Trade[], timeframe))
        setWinLossData(getWinLossData(data as Trade[]))
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch trades. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrades()
  }, [toast, timeframe])

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
        targetHitRate: 0,
        totalFees: 0,
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

    // Calculate Target Hit Rate and Total Fees/Commissions
    let tradesWithTarget = 0;
    let targetHits = 0;
    let totalFees = 0;

    trades.forEach(trade => {
      totalFees += (trade.fees || 0);

      if (trade.target !== undefined && trade.target !== null && trade.exit_price !== undefined && trade.exit_price !== null) {
        tradesWithTarget++;
        if (trade.trade_type === 'long' && trade.exit_price >= trade.target) {
          targetHits++;
        } else if (trade.trade_type === 'short' && trade.exit_price <= trade.target) {
          targetHits++;
        }
      }
    });

    const targetHitRate = tradesWithTarget > 0 ? (targetHits / tradesWithTarget) * 100 : 0;

    setMetrics({
      totalTrades,
      winRate,
      avgGain,
      avgLoss,
      profitFactor,
      netProfit,
      targetHitRate,
      totalFees,
    })
  }

  const getEquityCurveData = (trades: Trade[], timeframe: string) => {
    // Sort trades by date ascending
    const sortedTrades = [...trades].sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime());
    let grouped: { label: string, trades: Trade[] }[] = [];
    if (timeframe === "7days") {
      // Group by day
      const map: Record<string, Trade[]> = {};
      sortedTrades.forEach(trade => {
        const label = new Date(trade.entry_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
        if (!map[label]) map[label] = [];
        map[label].push(trade);
      });
      // Ensure 7 days
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
        days.push({ label, trades: map[label] || [] });
      }
      grouped = days;
    } else if (timeframe === "30days") {
      // Group by month (last 6 months)
      const map: Record<string, Trade[]> = {};
      sortedTrades.forEach(trade => {
        const label = new Date(trade.entry_date).toLocaleString("en-GB", { month: "short", year: "2-digit" });
        if (!map[label]) map[label] = [];
        map[label].push(trade);
      });
      const now = new Date();
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleString("en-GB", { month: "short", year: "2-digit" });
        months.push({ label, trades: map[label] || [] });
      }
      grouped = months;
    } else if (timeframe === "90days") {
      // Group by quarter
      const map: Record<string, Trade[]> = {};
      sortedTrades.forEach(trade => {
        const date = new Date(trade.entry_date);
        const year = date.getFullYear();
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        const label = `Q${quarter} '${String(year).slice(-2)}`;
        if (!map[label]) map[label] = [];
        map[label].push(trade);
      });
      // Find min/max year/quarter
      let minYear = new Date().getFullYear();
      let maxYear = new Date().getFullYear();
      let minQuarter = 1;
      let maxQuarter = 4;
      sortedTrades.forEach(trade => {
        const date = new Date(trade.entry_date);
        const year = date.getFullYear();
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        minYear = Math.min(minYear, year);
        maxYear = Math.max(maxYear, year);
        if (year === minYear) minQuarter = Math.min(minQuarter, quarter);
        if (year === maxYear) maxQuarter = Math.max(maxQuarter, quarter);
      });
      const quarters = [];
      for (let y = minYear; y <= maxYear; y++) {
        for (let q = 1; q <= 4; q++) {
          if ((y === minYear && q < minQuarter) || (y === maxYear && q > maxQuarter)) continue;
          const label = `Q${q} '${String(y).slice(-2)}`;
          quarters.push({ label, trades: map[label] || [] });
        }
      }
      grouped = quarters;
    } else {
      // Group by year
      const map: Record<string, Trade[]> = {};
      sortedTrades.forEach(trade => {
        const date = new Date(trade.entry_date);
        const year = date.getFullYear().toString();
        if (!map[year]) map[year] = [];
        map[year].push(trade);
      });
      let minYear = new Date().getFullYear();
      let maxYear = new Date().getFullYear();
      sortedTrades.forEach(trade => {
        const date = new Date(trade.entry_date);
        const year = date.getFullYear();
        minYear = Math.min(minYear, year);
        maxYear = Math.max(maxYear, year);
      });
      const years = [];
      for (let y = minYear; y <= maxYear; y++) {
        years.push({ label: y.toString(), trades: map[y.toString()] || [] });
      }
      grouped = years;
    }
    // Now, for each group, calculate cumulative value up to that group
    let cumulative = 0;
    return grouped.map(group => {
      const groupSum = group.trades.reduce((sum, trade) => sum + (trade.profit_loss || 0), 0);
      cumulative += groupSum;
      return { date: group.label, value: cumulative };
    });
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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : trades.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Data Available</CardTitle>
              <CardDescription>
                No trades found for the selected timeframe. Add trades to see analytics.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                  <ReBarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalTrades}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                  <RePieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPercentage(metrics.winRate)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Target Hit Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPercentage(metrics.targetHitRate)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.profitFactor.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit/Loss</CardTitle>
                  <ReLineChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${metrics.netProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {formatCurrency(metrics.netProfit)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Gain</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{formatCurrency(metrics.avgGain)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Loss</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{formatCurrency(metrics.avgLoss)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Fees/Commissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.totalFees)}</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="performance" className="space-y-4">
              <TabsList>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="instruments">Instruments</TabsTrigger>
                <TabsTrigger value="strategies">Strategies</TabsTrigger>
              </TabsList>
              <TabsContent value="performance" className="space-y-4">
                <div>
                  {/* First Row - Bar Chart and Pie Chart */}
                  <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 mb-4">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Trade Performance</CardTitle>
                        <CardDescription>Your trading performance by {timeframe}</CardDescription>
                      </CardHeader>
                      <CardContent className="pl-2">
                        <div className="h-[200px] md:h-[300px] w-full min-w-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={tradePerformanceData}>
                              <XAxis dataKey="label" tick={{ fontSize: 13 }} />
                              <YAxis tick={{ fontSize: 13 }} />
                              <ReTooltip formatter={(value: number, name: string, props: any) => {
                                const entry = props.payload && props.payload.length > 0 ? props.payload[0].payload : null;
                                return `${entry && !entry.isProfit ? '-' : ''}${(value as number).toFixed(2)}`;
                              }} />
                              <Bar dataKey="absValue" barSize={24} radius={[4, 4, 0, 0]} fill="#8884d8">
                                {tradePerformanceData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.isProfit ? "#22c55e" : "#ef4444"} />
                                ))}
                              </Bar>
                            </ReBarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="lg:col-span-1">
                      <CardHeader>
                        <CardTitle>Win/Loss Ratio</CardTitle>
                        <CardDescription>Distribution of winning and losing trades</CardDescription>
                      </CardHeader>
                      <CardContent className="pl-2 flex flex-col items-center">
                        <div className="h-[200px] md:h-[300px] w-full max-w-xs min-w-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                              <Pie
                                data={winLossData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={80}
                                label
                              >
                                {winLossData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index === 0 ? "#22c55e" : "#ef4444"} />
                                ))}
                              </Pie>
                              <ReTooltip />
                            </RePieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Second Row - Equity Curve */}
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Equity Curve</CardTitle>
                        <CardDescription>Your cumulative profit/loss over time</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[400px]">
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
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="instruments" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Instrument Distribution</CardTitle>
                      <CardDescription>Distribution of trades by instrument type</CardDescription>
                    </CardHeader>
                    <CardContent className="h-full flex flex-col gap-6">
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Pie
                              data={instrumentDistribution}
                              dataKey="value"
                              nameKey="name"
                              outerRadius={100}
                              label
                            >
                              {instrumentDistribution.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <ReTooltip />
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>
                      <Table>
                        <TableHeader className="bg-muted">
                          <TableRow>
                            <TableHead className="text-left">Instrument</TableHead>
                            <TableHead className="text-center">Number of Trades</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {instrumentDistribution.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="py-1">{item.name}</TableCell>
                              <TableCell className="py-1 text-center">{item.value}</TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Instrument Performance</CardTitle>
                      <CardDescription>Profit/loss by instrument type</CardDescription>
                    </CardHeader>
                    <CardContent className="h-full flex flex-col gap-6">
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReBarChart data={instrumentPerformance}>
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              height={70}
                              interval={0}
                              tick={{ fontSize: 13 }}
                            />
                            <YAxis tick={{ fontSize: 13 }} />
                            <ReTooltip
                              formatter={(value: number, name: string, props: any) => {
                                const entry = props.payload && props.payload.length > 0 ? props.payload[0].payload : null;
                                return `${entry && !entry.isProfit ? '-' : ''}${(value as number).toFixed(2)}`;
                              }}
                            />
                            <Bar
                              dataKey="absPnL"
                              barSize={24}
                              isAnimationActive={true}
                              shape={false}
                              radius={[4, 4, 0, 0]}
                            >
                              {instrumentPerformance.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.isProfit ? "#22c55e" : "#ef4444"}
                                />
                              ))}
                            </Bar>
                          </ReBarChart>
                        </ResponsiveContainer>
                      </div>
                      <Table>
                        <TableHeader className="bg-muted">
                          <TableRow>
                            <TableHead className="text-left">Instrument</TableHead>
                            <TableHead className="text-center">PnL</TableHead>
                            <TableHead className="text-center">Win Rate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {instrumentPerformance.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="py-1">{item.name}</TableCell>
                              <TableCell className="py-1 text-center">${item.PnL}</TableCell>
                              <TableCell className="py-1 text-center">{formatPercentage(item.winRate)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="strategies" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Strategy Distribution</CardTitle>
                      <CardDescription>Distribution of trades by strategy</CardDescription>
                    </CardHeader>
                    <CardContent className="h-full flex flex-col gap-6">
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Pie
                              data={strategyDistribution}
                              dataKey="value"
                              nameKey="name"
                              outerRadius={100}
                              label
                            >
                              {strategyDistribution.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <ReTooltip />
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>
                      <Table>
                        <TableHeader className="bg-muted">
                          <TableRow>
                            <TableHead className="text-left">Strategy</TableHead>
                            <TableHead className="text-center">Number of Trades</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                          {strategyDistribution.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="py-1">{item.name}</TableCell>
                              <TableCell className="py-1 text-center">{item.value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Strategy Performance</CardTitle>
                      <CardDescription>Profit/loss by strategy</CardDescription>
                    </CardHeader>
                    <CardContent className="h-full flex flex-col gap-6">
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReBarChart data={strategyPerformance}>
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              height={90}
                              interval={0}
                              tick={{ fontSize: 13 }}
                            />
                            <YAxis tick={{ fontSize: 13 }} />
                            <ReTooltip
                              formatter={(value: number, name: string, props: any) => {
                                const entry = props.payload && props.payload.length > 0 ? props.payload[0].payload : null;
                                return `${entry && !entry.isProfit ? '-' : ''}${(value as number).toFixed(2)}`;
                              }}
                            />
                            <Bar
                              dataKey="absPnL"
                              barSize={24}
                              isAnimationActive={true}
                              shape={false}
                              radius={[4, 4, 0, 0]}
                            >
                              {strategyPerformance.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.isProfit ? "#22c55e" : "#ef4444"}
                                />
                              ))}
                            </Bar>
                          </ReBarChart>
                        </ResponsiveContainer>
                      </div>
                      <Table>
                        <TableHeader className="bg-muted">
                          <TableRow>
                            <TableHead className="text-left">Strategy</TableHead>
                            <TableHead className="text-center">PnL</TableHead>
                            <TableHead className="text-center">Win Rate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {strategyPerformance.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="py-1">{item.name}</TableCell>
                              <TableCell className="py-1 text-center">${item.PnL}</TableCell>
                              <TableCell className="py-1 text-center">{formatPercentage(item.winRate)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
