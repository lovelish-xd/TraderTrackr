"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import type { Trade } from "@/lib/supabase"
import { ArrowUpDown, Download, Filter, PlusCircle, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TradesPage() {
  const { toast } = useToast()
  const [trades, setTrades] = useState<Trade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    instrumentType: "",
    tradeType: "",
    profitLoss: "",
    strategy: "",
    search: "",
    dateRange: "",
  })
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const tradesPerPage = 10

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

        // Apply filters
        if (filters.instrumentType && filters.instrumentType!="all") {
          query = query.eq("instrument_type", filters.instrumentType)
        }

        if (filters.tradeType && filters.tradeType!="all") {
          query = query.eq("trade_type", filters.tradeType)
        }

        if (filters.strategy && filters.strategy!="all") {
          query = query.eq("strategy", filters.strategy)
        }

        if (filters.profitLoss === "profit") {
          query = query.gt("profit_loss", 0)
        } else if (filters.profitLoss === "loss") {
          query = query.lt("profit_loss", 0)
        }

        if (filters.search) {
          query = query.ilike("ticker_symbol", `%${filters.search}%`)
        }

        // Date range filter
        if (filters.dateRange && filters.dateRange!="all") {
          const now = new Date()
          const startDate = new Date()

          if (filters.dateRange === "7days") {
            startDate.setDate(now.getDate() - 7)
          } else if (filters.dateRange === "30days") {
            startDate.setDate(now.getDate() - 30)
          } else if (filters.dateRange === "90days") {
            startDate.setDate(now.getDate() - 90)
          } else if (filters.dateRange === "year") {
            startDate.setFullYear(now.getFullYear() - 1)
          }

          query = query.gte("entry_date", startDate.toISOString())
        }

        const { data, error } = await query

        if (error) {
          throw error
        }

        setTrades(data as Trade[])
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
    setCurrentPage(1) // Reset to first page when filters change
  }, [toast, filters])

  const handleFilterChange = (name: string, value: string) => {
    setFilters({
      ...filters,
      [name]: value,
    })
    setCurrentPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      search: e.target.value,
    })
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      instrumentType: "",
      tradeType: "",
      profitLoss: "",
      strategy: "",
      search: "",
      dateRange: "",
    })
    setCurrentPage(1)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const formatCurrency = (value: number | null | undefined, currency: string | null | undefined) => {
    if (value === null || value === undefined || !currency) return "-"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(value)
  }
  

  const exportToCsv = () => {
    if (trades.length === 0) {
      toast({
        title: "No trades to export",
        description: "There are no trades matching your current filters.",
      })
      return
    }

    // Create CSV header
    const headers = [
      "Ticker",
      "Instrument Type",
      "Trade Type",
      "Entry Date",
      "Exit Date",
      "Entry Price",
      "Exit Price",
      "Position Size",
      "Profit/Loss",
      "Strategy",
    ]

    // Create CSV rows
    const rows = trades.map((trade) => [
      trade.ticker_symbol,
      trade.instrument_type,
      trade.trade_type,
      formatDate(trade.entry_date),
      trade.exit_date ? formatDate(trade.exit_date) : "-",
      trade.entry_price,
      trade.exit_price || "-",
      trade.position_size,
      trade.profit_loss || "-",
      trade.strategy || "-",
    ])

    // Combine header and rows
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `trades_export_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleTradeClick = (tradeId: string) => {
    router.push(`/dashboard/trades/${tradeId}`)
  }

  // Pagination logic
  const indexOfLastTrade = currentPage * tradesPerPage
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage
  const currentTrades = trades.slice(indexOfFirstTrade, indexOfLastTrade)
  const totalPages = Math.ceil(trades.length / tradesPerPage)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Trades</h1>
          <div className="flex gap-2">
            <Button onClick={exportToCsv} className="bg-[#185E61] hover:bg-[#2A7174]">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button asChild className="bg-[#185E61] hover:bg-[#2A7174]">
              <Link href="/dashboard/trades/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Trade
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              <div className="flex justify-between items-center">
                <span>Filter your trades by various criteria</span>
                <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Clear Filters
                </Button>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ticker..."
                  className="pl-8"
                  value={filters.search}
                  onChange={handleSearchChange}
                />
              </div>
              <Select
                value={filters.instrumentType}
                onValueChange={(value) => handleFilterChange("instrumentType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Instrument Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Instruments</SelectItem>
                  <SelectItem value="Equity">Equity</SelectItem>
                  <SelectItem value="Options">Options</SelectItem>
                  <SelectItem value="Spot">Spot</SelectItem>
                  <SelectItem value="Futures">Futures</SelectItem>
                  <SelectItem value="Forex">Forex</SelectItem>
                  <SelectItem value="Crypto">Crypto</SelectItem>
                  <SelectItem value="ETF">ETF</SelectItem>
                  <SelectItem value="Commodity">Commodity</SelectItem>
                  <SelectItem value="Index">Index</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.tradeType}
                onValueChange={(value) => handleFilterChange("tradeType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trade Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Buy">Buy</SelectItem>
                  <SelectItem value="Call">Sell</SelectItem>
                  <SelectItem value="Long">Long</SelectItem>
                  <SelectItem value="Short">Short</SelectItem>
                  <SelectItem value="Buy Call">Buy Call</SelectItem>
                  <SelectItem value="Sell Call">Sell Call</SelectItem>
                  <SelectItem value="Buy Put">Buy Put</SelectItem>
                  <SelectItem value="Sell Put">Sell Put</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.profitLoss} onValueChange={(value) => handleFilterChange("profitLoss", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Profit/Loss" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trades</SelectItem>
                  <SelectItem value="profit">Profitable</SelectItem>
                  <SelectItem value="loss">Loss</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.strategy} onValueChange={(value) => handleFilterChange("strategy", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  <SelectItem value="Trend Following">Trend Following</SelectItem>
                  <SelectItem value="Mean Reversion">Mean Reversion</SelectItem>
                  <SelectItem value="Breakout">Breakout</SelectItem>
                  <SelectItem value="Momentum">Momentum</SelectItem>
                  <SelectItem value="Swing Trading">Swing Trading</SelectItem>
                  <SelectItem value="Day Trading">Day Trading</SelectItem>
                  <SelectItem value="Position Trading">Position Trading</SelectItem>
                  <SelectItem value="Value Investing">Value Investing</SelectItem>
                  <SelectItem value="Growth Investing">Growth Investing</SelectItem>
                  <SelectItem value="Dividend Investing">Dividend Investing</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trade History</CardTitle>
            <CardDescription>
              {trades.length} trade{trades.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : trades.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                <p className="text-muted-foreground">No trades found</p>
                <Button asChild variant="outline">
                  <Link href="/dashboard/trades/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Trade
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticker</TableHead>
                      <TableHead>Instrument</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Entry Date</TableHead>
                      <TableHead>Exit Date</TableHead>
                      <TableHead>Entry Price</TableHead>
                      <TableHead>Exit Price</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          P/L
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Strategy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTrades.map((trade) => (
                      <TableRow 
                        key={trade.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleTradeClick(trade.id)}
                      >
                        <TableCell className="font-medium">{trade.ticker_symbol}</TableCell>
                        <TableCell>{trade.instrument_type}</TableCell>
                        <TableCell>{trade.trade_type}</TableCell>
                        <TableCell>{formatDate(trade.entry_date)}</TableCell>
                        <TableCell>{trade.exit_date ? formatDate(trade.exit_date) : "-"}</TableCell>
                        <TableCell>{trade.entry_price}</TableCell>
                        <TableCell>{trade.exit_price || "-"}</TableCell>
                        <TableCell>{trade.position_size}</TableCell>
                        <TableCell
                          className={
                            trade.profit_loss ? (trade.profit_loss > 0 ? "text-green-500" : "text-red-500") : ""
                          }
                        >
                          {formatCurrency(trade.profit_loss, trade.currency)}
                        </TableCell>
                        <TableCell>{trade.strategy || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-end items-center gap-2 mt-4">
                    {/* Show Previous button only if not on first page */}
                    {currentPage > 1 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                    )}
                    {/* Windowed Pagination with Ellipses */}
                    {(() => {
                      const pageButtons = []
                      const pageWindow = 2 // Number of pages to show on each side of current
                      let startPage = Math.max(1, currentPage - pageWindow)
                      let endPage = Math.min(totalPages, currentPage + pageWindow)

                      if (startPage > 1) {
                        pageButtons.push(
                          <Button
                            key={1}
                            variant={currentPage === 1 ? "default" : "outline"}
                            style={currentPage === 1 ? { backgroundColor: '#185E61', color: '#fff' } : {}}
                            onClick={() => setCurrentPage(1)}
                          >
                            1
                          </Button>
                        )
                        if (startPage > 2) {
                          pageButtons.push(<span key="start-ellipsis">...</span>)
                        }
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pageButtons.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            style={currentPage === i ? { backgroundColor: '#185E61', color: '#fff' } : {}}
                            onClick={() => setCurrentPage(i)}
                          >
                            {i}
                          </Button>
                        )
                      }

                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pageButtons.push(<span key="end-ellipsis">...</span>)
                        }
                        pageButtons.push(
                          <Button
                            key={totalPages}
                            variant={currentPage === totalPages ? "default" : "outline"}
                            style={currentPage === totalPages ? { backgroundColor: '#185E61', color: '#fff' } : {}}
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </Button>
                        )
                      }

                      return pageButtons
                    })()}
                    {/* Show Next button only if not on last page */}
                    {currentPage < totalPages && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
