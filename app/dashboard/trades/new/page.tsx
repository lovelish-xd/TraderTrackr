"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { X } from "lucide-react"

export default function NewTradePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    instrumentType: "",
    tradeType: "",
    tickerSymbol: "",
    entryDate: "",
    entryTime: "",
    exitDate: "",
    exitTime: "",
    entryPrice: "",
    exitPrice: "",
    positionSize: "",
    stopLoss: "",
    target: "",
    strategy: "",
    fees: "",
    tradePerformanceType: "",
    tradePerformanceValue: "",
    rationale: "",
    marketConditions: "",
    preTradeMindset: "",
    postTradeReflection: "",
    currency: "",
  })

  const instrumentTypes = ["Equity", "Options", "Futures", "Spot", "Forex", "ETF", "Crypto", "Commodity", "Index"]

  const tradePerformanceTypes = ["Profit", "Loss","Cost to Cost"]

  const getTradeTypes = (instrumentType: string) => {
    switch (instrumentType) {
      case "Options":
        return ["Buy Call", "Sell Call", "Buy Put", "Sell Put"]
      case "Futures":
      case "Forex":
      case "Crypto":
      case "Commodity":
        return ["Long", "Short"]
      case "Equity":
      case "ETF":
      case "Index":
      case "Spot":
        return ["Buy", "Sell"]
      default:
        return []
    }
  }

  const strategies = [
    "Trend Following",
    "Mean Reversion",
    "Breakout",
    "Momentum",
    "Swing Trading",
    "Scalping",
    "Day Trading",
    "Position Trading",
    "Value Investing",
    "Growth Investing",
    "Dividend Investing",
    "Other",
  ]

  const directions = ["Long", "Short"]

  const currencies = [
    "USD", "INR"
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })

    // Reset trade type when instrument type changes
    if (name === "instrumentType") {
      setFormData((prev) => ({
        ...prev,
        tradeType: "",
      }))
    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        throw userError
      }


      const userId = userData.user?.id

      if (!userId) {
        throw new Error("User not authenticated")
      }

      const entryDateTime = `${formData.entryDate}T${formData.entryTime || "00:00"}:00`
      const exitDateTime = formData.exitDate ? `${formData.exitDate}T${formData.exitTime || "00:00"}:00` : null

      let screenshotPath = null

      if (screenshotFile) {
        const fileExt = screenshotFile.name.split('.').pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`
        const filePath = `screenshots/${fileName}`
        const { data, error } = await supabase.storage
          .from('trade-images')
          .upload(filePath, screenshotFile)

        if (error) {
          console.error("Upload error:", error)
          toast({
            title: "Screenshot Upload Error",
            description: error.message || "Failed to upload screenshot.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        screenshotPath = filePath
      }

      if(formData.tradePerformanceType === "Loss"){
        formData.tradePerformanceValue = String(-Math.abs(Number(formData.tradePerformanceValue)))
      }
      
      const { error } = await supabase.from("trades").insert({
        user_id: userId,
        instrument_type: formData.instrumentType,
        trade_type: formData.tradeType,
        ticker_symbol: formData.tickerSymbol,
        entry_date: entryDateTime,
        entry_time: formData.entryTime,
        exit_date: exitDateTime,
        exit_time: formData.exitTime,
        entry_price: Number.parseFloat(formData.entryPrice),
        exit_price: formData.exitPrice ? Number.parseFloat(formData.exitPrice) : null,
        position_size: Number.parseFloat(formData.positionSize),
        stop_loss: formData.stopLoss ? Number.parseFloat(formData.stopLoss) : null,
        target: formData.target ? Number.parseFloat(formData.target) : null,
        strategy: formData.strategy,
        fees: formData.fees ? Number.parseFloat(formData.fees) : null,
        rationale: formData.rationale,
        market_conditions: formData.marketConditions,
        pre_trade_emotion: formData.preTradeMindset,
        post_trade_reflection: formData.postTradeReflection,
        trade_performance_type: formData.tradePerformanceType,
        profit_loss: formData.tradePerformanceValue,
        currency: formData.currency,
        trade_screenshot: screenshotPath
      })


      if (error) {
        throw error
      }

      toast({
        title: "Trade added successfully",
        description: "Your trade has been recorded in your journal.",
      })

      router.push("/dashboard/trades")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add trade. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Add New Trade</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Trade Details</CardTitle>
              <CardDescription>Enter the basic information about your trade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="instrumentType">Instrument Type</Label>
                  <Select
                    value={formData.instrumentType}
                    onValueChange={(value) => handleSelectChange("instrumentType", value)}
                    required
                  >
                    <SelectTrigger id="instrumentType">
                      <SelectValue placeholder="Select Instrument Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {instrumentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tradeType">Trade Type</Label>
                  <Select
                    value={formData.tradeType}
                    onValueChange={(value) => handleSelectChange("tradeType", value)}
                    disabled={!formData.instrumentType}
                    required
                  >
                    <SelectTrigger id="tradeType">
                      <SelectValue
                        placeholder={formData.instrumentType ? "Select Trade Type" : "Select Instrument Type first"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {getTradeTypes(formData.instrumentType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tickerSymbol">Ticker Symbol</Label>
                  <Input
                    id="tickerSymbol"
                    name="tickerSymbol"
                    placeholder="e.g., AAPL, MSFT"
                    value={formData.tickerSymbol}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Trade Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleSelectChange("currency", value)}
                    required
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Entry & Exit</CardTitle>
              <CardDescription>Record your entry and exit details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="entryDate">Entry Date</Label>
                  <Input
                    id="entryDate"
                    name="entryDate"
                    type="date"
                    value={formData.entryDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entryTime">Entry Time</Label>
                  <Input
                    id="entryTime"
                    name="entryTime"
                    type="time"
                    value={formData.entryTime}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exitDate">Exit Date</Label>
                  <Input id="exitDate" name="exitDate" type="date" value={formData.exitDate} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exitTime">Exit Time</Label>
                  <Input id="exitTime" name="exitTime" type="time" value={formData.exitTime} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entryPrice">Entry Price</Label>
                  <Input
                    id="entryPrice"
                    name="entryPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.entryPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exitPrice">Exit Price</Label>
                  <Input
                    id="exitPrice"
                    name="exitPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.exitPrice}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="positionSize">Position Size</Label>
                  <Input
                    id="positionSize"
                    name="positionSize"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={formData.positionSize}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fees">Fees/Commissions</Label>
                  <Input
                    id="fees"
                    name="fees"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.fees}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Risk Management</CardTitle>
              <CardDescription>Record your risk management parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss</Label>
                  <Input
                    id="stopLoss"
                    name="stopLoss"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.stopLoss}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Target</Label>
                  <Input
                    id="target"
                    name="target"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.target}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strategy">Strategy</Label>
                  <Select value={formData.strategy} onValueChange={(value) => handleSelectChange("strategy", value)}>
                    <SelectTrigger id="strategy">
                      <SelectValue placeholder="Select Strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies.map((strategy) => (
                        <SelectItem key={strategy} value={strategy}>
                          {strategy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>


          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Trade Performance</CardTitle>
              <CardDescription>Record your trade performance details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                  <Label htmlFor="tradePerformanceType">Type</Label>
                  <Select value={formData.tradePerformanceType} onValueChange={(value) => handleSelectChange("tradePerformanceType", value)}>
                    <SelectTrigger id="tradePerformanceType">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {tradePerformanceTypes.map((tradePerformanceType) => (
                        <SelectItem key={tradePerformanceType} value={tradePerformanceType}>
                          {tradePerformanceType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tradePerformanceValue">Value</Label>
                  <Input
                    id="tradePerformanceValue"
                    name="tradePerformanceValue"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.tradePerformanceValue}
                    onChange={handleChange}
                  />
                </div>
                
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Trade Screenshots</CardTitle>
              <CardDescription>Record your relevant trade screenshots</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setScreenshotFile(file)
                      }
                    }}
                    className="cursor-pointer h-[70%] [&::file-selector-button]:bg-[#185E61] [&::file-selector-button]:text-white [&::file-selector-button]:border-0 [&::file-selector-button]:px-4 [&::file-selector-button]:py-2 [&::file-selector-button]:rounded-md [&::file-selector-button]:cursor-pointer"
                  />
                  {screenshotFile && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setScreenshotFile(null);
                          const fileInput = document.getElementById('screenshot') as HTMLInputElement;
                          if (fileInput) {
                            fileInput.value = '';
                          }
                        }}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload one or more screenshots (PNG, JPG, JPEG)
                </p>
              </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Trade Analysis</CardTitle>
              <CardDescription>Document your thoughts and analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rationale">Trade Rationale / Setup Notes</Label>
                <Textarea
                  id="rationale"
                  name="rationale"
                  placeholder="Why did you take this trade? What was your setup?"
                  value={formData.rationale}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketConditions">Market Conditions</Label>
                <Textarea
                  id="marketConditions"
                  name="marketConditions"
                  placeholder="What were the market conditions during this trade?"
                  value={formData.marketConditions}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preTradeMindset">Pre-trade Emotion/Mindset</Label>
                <Textarea
                  id="preTradeMindset"
                  name="preTradeMindset"
                  placeholder="How were you feeling before taking this trade?"
                  value={formData.preTradeMindset}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postTradeReflection">Post-trade Reflection</Label>
                <Textarea
                  id="postTradeReflection"
                  name="postTradeReflection"
                  placeholder="What did you learn from this trade? What would you do differently?"
                  value={formData.postTradeReflection}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <CardFooter className="flex justify-between px-0">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#185E61] text-white hover:bg-[#2A7174] ">
              {isLoading ? "Saving..." : "Save Trade"}
            </Button>
          </CardFooter>
        </form>
      </div>
    </DashboardLayout>
  )
}
