import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpIcon, BarChart3, LineChart, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+5.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">63.4%</div>
              <p className="text-xs text-muted-foreground">+2.3% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-2xl font-bold text-green-500">
                +$4,329.12
                <ArrowUpIcon className="ml-1 h-4 w-4" />
              </div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
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
              <div className="text-2xl font-bold">1.87</div>
              <p className="text-xs text-muted-foreground">+0.3 from last month</p>
            </CardContent>
          </Card>
        </div>
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
                    Equity Curve Chart
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
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">AAPL</p>
                        <p className="text-sm text-muted-foreground">Long • 10 shares</p>
                      </div>
                      <div className="ml-auto font-medium text-green-500">+$142.50</div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">MSFT</p>
                        <p className="text-sm text-muted-foreground">Long • 5 shares</p>
                      </div>
                      <div className="ml-auto font-medium text-green-500">+$87.25</div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">TSLA</p>
                        <p className="text-sm text-muted-foreground">Short • 3 shares</p>
                      </div>
                      <div className="ml-auto font-medium text-red-500">-$65.30</div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">AMZN</p>
                        <p className="text-sm text-muted-foreground">Long • 2 shares</p>
                      </div>
                      <div className="ml-auto font-medium text-green-500">+$103.75</div>
                    </div>
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">NFLX</p>
                        <p className="text-sm text-muted-foreground">Long • 4 shares</p>
                      </div>
                      <div className="ml-auto font-medium text-red-500">-$42.18</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Instrument Performance</CardTitle>
                  <CardDescription>Performance by instrument type</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                    Instrument Performance Chart
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Strategy Performance</CardTitle>
                  <CardDescription>Performance by trading strategy</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                    Strategy Performance Chart
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
      </div>
    </DashboardLayout>
  )
}
