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
  })
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28", "#FF4444", "#4DD0E1", "#A1887F", "#BA68C8", "#FFD54F", "#81C784"];


  const [instrumentDistribution, setInstrumentDistribution] = useState<any[]>([])
  const [instrumentPerformance, setInstrumentPerformance] = useState<any[]>([])
  const [strategyDistribution, setStrategyDistribution] = useState<any[]>([])
  const [strategyPerformance, setStrategyPerformance] = useState<any[]>([])
  const [equityCurve, setEquityCurve] = useState<{ date: string; value: number }[]>([])


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
        const instrumentMap: Record<string, { count: number; PnL: number; }> = {}
        const strategyMap : Record<string, { count: number; PnL: number; }> = {}

        data.forEach((trade) => {
        const type = trade.instrument_type || "Unknown"
        if (!instrumentMap[type]) {
          instrumentMap[type] = { count: 0, PnL: 0}
        }

        instrumentMap[type].count += 1
        instrumentMap[type].PnL += trade.profit_loss || 0
       
      })

      data.forEach((trade) => {
        const strategy = trade.strategy || "Unknown"
        if (!strategyMap[strategy]) {
          strategyMap[strategy] = { count: 0, PnL: 0}
        }

        strategyMap[strategy].count += 1
        strategyMap[strategy].PnL += trade.profit_loss || 0
       
      })

      const distribution = Object.entries(instrumentMap).map(([type, value]) => ({
        name: type,
        value: value.count
      }))

      const performance = Object.entries(instrumentMap).map(([type, value]) => ({
        name: type,
       PnL: parseFloat(value.PnL.toFixed(2))
      }))

      const strategyDistribution = Object.entries(strategyMap).map(([type, value]) => ({
        name: type,
        value: value.count
      }))

      const strategyPerformance = Object.entries(strategyMap).map(([type, value]) => ({
        name: type,
       PnL: parseFloat(value.PnL.toFixed(2))
      }))
      

    

      setInstrumentDistribution(distribution)
      setInstrumentPerformance(performance)
      setStrategyDistribution(strategyDistribution)
      setStrategyPerformance(strategyPerformance)

      
        calculateMetrics(data as Trade[])
        setEquityCurve(getEquityCurveData(data as Trade[]))
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

    setMetrics({
      totalTrades,
      winRate,
      avgGain,
      avgLoss,
      profitFactor,
      netProfit,
    })
  }

  const getEquityCurveData = (trades: Trade[]) => {
    // Sort trades by date ascending
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
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                    <path d="m5 12 5 5 9-9" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{formatCurrency(metrics.avgGain)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Loss</CardTitle>
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
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{formatCurrency(metrics.avgLoss)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
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
                  <div className="text-2xl font-bold">{metrics.profitFactor.toFixed(2)}</div>
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
                              formatter={(value: number) =>
                                `${value >= 0 ? "+" : "-"}$${Math.abs(value).toFixed(2)}`
                              }
                            />
                            <Bar
                              dataKey="PnL"
                              isAnimationActive={true}
                              shape={false}
                              radius={[4, 4, 0, 0]}
                            >
                              {instrumentPerformance.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.PnL >= 0 ? "#22c55e" /* green */ : "#ef4444" /* red */}
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
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {instrumentPerformance.map((item, index) => (
                              <TableRow key={index}>
                                
                                <TableCell className="py-1">{item.name}</TableCell>
                                <TableCell className="py-1 text-center">${item.PnL}</TableCell>
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
                            <YAxis 
                              tick={{ fontSize: 13 }}
                            />
                            <ReTooltip
                              formatter={(value: number) =>
                                `${value >= 0 ? "+" : "-"}$${Math.abs(value).toFixed(2)}`
                              }
                            />
                            <Bar
                              dataKey="PnL"
                              isAnimationActive={true}
                              shape={false}
                              radius={[4, 4, 0, 0]}
                            >
                              {strategyPerformance.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.PnL >= 0 ? "#22c55e" /* green */ : "#ef4444" /* red */}
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
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {strategyPerformance.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell className="py-1">{item.name}</TableCell>
                                <TableCell className="py-1 text-center">${item.PnL}</TableCell>
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
