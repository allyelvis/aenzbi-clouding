import type React from "react"
import { BarChart3, Download, LineChart, PieChart, Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8">
        <div className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span>AENZBi Cloud</span>
        </div>
        <nav className="hidden flex-1 md:flex md:justify-center">
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/inventory" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Inventory
            </Link>
            <Link href="/sales" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Sales
            </Link>
            <Link href="/reports" className="font-medium text-primary">
              Reports
            </Link>
          </div>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Button variant="outline" size="sm">
            Help
          </Button>
          <Button size="sm">Upgrade Plan</Button>
        </div>
      </header>
      <div className="flex flex-1">
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Analytics & Reports</h1>
              <p className="text-muted-foreground">Gain insights into your business performance</p>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="last30">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7">Last 7 days</SelectItem>
                  <SelectItem value="last30">Last 30 days</SelectItem>
                  <SelectItem value="last90">Last 90 days</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$84,325.75</div>
                <p className="text-xs text-green-500">+15.3% from previous period</p>
                <div className="mt-4 h-[80px] w-full rounded-md bg-muted/20"></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-green-500">+8.2% from previous period</p>
                <div className="mt-4 h-[80px] w-full rounded-md bg-muted/20"></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-green-500">+0.5% from previous period</p>
                <div className="mt-4 h-[80px] w-full rounded-md bg-muted/20"></div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="sales">
              <TabsList>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
              </TabsList>
              <TabsContent value="sales" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Sales Overview</CardTitle>
                      <CardDescription>Track your sales performance over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                        <p className="text-muted-foreground">Sales chart will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Products</CardTitle>
                      <CardDescription>Your best-selling products by revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topProducts.map((product, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${product.revenue.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">{product.units} units</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Sales by Channel</CardTitle>
                      <CardDescription>Revenue breakdown by sales channel</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                        <p className="text-muted-foreground">Channel chart will appear here</p>
                      </div>
                      <div className="mt-4 space-y-2">
                        {salesChannels.map((channel, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: channel.color }}></div>
                              <span>{channel.name}</span>
                            </div>
                            <span className="font-medium">{channel.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="inventory" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Inventory Status</CardTitle>
                      <CardDescription>Overview of your current inventory levels</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">Total SKUs</div>
                          <div className="mt-1 text-2xl font-bold">2,345</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">Low Stock Items</div>
                          <div className="mt-1 text-2xl font-bold">32</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">Out of Stock</div>
                          <div className="mt-1 text-2xl font-bold">15</div>
                        </div>
                      </div>
                      <div className="mt-6 h-[200px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                        <p className="text-muted-foreground">Inventory chart will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Inventory Turnover</CardTitle>
                      <CardDescription>How quickly your inventory is sold and replaced</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                        <p className="text-muted-foreground">Turnover chart will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Stock Alerts</CardTitle>
                      <CardDescription>Products that need attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stockAlerts.map((alert, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="font-medium">{alert.product}</p>
                              <p className="text-sm text-muted-foreground">{alert.sku}</p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant="outline"
                                className={
                                  alert.type === "out"
                                    ? "border-red-500 bg-red-500 bg-opacity-10 text-red-700"
                                    : "border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-700"
                                }
                              >
                                {alert.type === "out" ? "Out of Stock" : "Low Stock"}
                              </Badge>
                              <p className="mt-1 text-sm text-muted-foreground">{alert.stock} remaining</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="customers" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Customer Overview</CardTitle>
                      <CardDescription>Insights into your customer base</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">Total Customers</div>
                          <div className="mt-1 text-2xl font-bold">1,245</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">New Customers</div>
                          <div className="mt-1 text-2xl font-bold">78</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">Repeat Rate</div>
                          <div className="mt-1 text-2xl font-bold">68%</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">Avg. Lifetime Value</div>
                          <div className="mt-1 text-2xl font-bold">$845</div>
                        </div>
                      </div>
                      <div className="mt-6 h-[200px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                        <p className="text-muted-foreground">Customer growth chart will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Segments</CardTitle>
                      <CardDescription>Breakdown of your customer base</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                        <p className="text-muted-foreground">Segments chart will appear here</p>
                      </div>
                      <div className="mt-4 space-y-2">
                        {customerSegments.map((segment, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                              <span>{segment.name}</span>
                            </div>
                            <span className="font-medium">{segment.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Retention</CardTitle>
                      <CardDescription>How well you're keeping customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                        <p className="text-muted-foreground">Retention chart will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="finance" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Financial Performance</CardTitle>
                      <CardDescription>Overview of your business finances</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">Revenue</div>
                          <div className="mt-1 text-2xl font-bold">$84,325</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">Expenses</div>
                          <div className="mt-1 text-2xl font-bold">$46,218</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">Profit</div>
                          <div className="mt-1 text-2xl font-bold">$38,107</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">Profit Margin</div>
                          <div className="mt-1 text-2xl font-bold">45.2%</div>
                        </div>
                      </div>
                      <div className="mt-6 h-[200px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                        <p className="text-muted-foreground">Financial performance chart will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Expense Breakdown</CardTitle>
                      <CardDescription>Where your money is going</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                        <p className="text-muted-foreground">Expense chart will appear here</p>
                      </div>
                      <div className="mt-4 space-y-2">
                        {expenseCategories.map((category, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                              <span>{category.name}</span>
                            </div>
                            <span className="font-medium">{category.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Forecast</CardTitle>
                      <CardDescription>Projected revenue for next quarter</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                        <p className="text-muted-foreground">Forecast chart will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Saved Reports</CardTitle>
                    <CardDescription>Access your frequently used reports</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <SavedReportCard
                    title="Monthly Sales Summary"
                    description="Overview of sales performance by month"
                    lastRun="Mar 15, 2025"
                    icon={<LineChart className="h-5 w-5" />}
                  />
                  <SavedReportCard
                    title="Inventory Valuation"
                    description="Current value of inventory by category"
                    lastRun="Mar 10, 2025"
                    icon={<BarChart3 className="h-5 w-5" />}
                  />
                  <SavedReportCard
                    title="Customer Acquisition"
                    description="New customer growth and acquisition costs"
                    lastRun="Mar 05, 2025"
                    icon={<LineChart className="h-5 w-5" />}
                  />
                  <SavedReportCard
                    title="Product Performance"
                    description="Sales and profitability by product"
                    lastRun="Mar 01, 2025"
                    icon={<BarChart3 className="h-5 w-5" />}
                  />
                  <SavedReportCard
                    title="Expense Analysis"
                    description="Detailed breakdown of business expenses"
                    lastRun="Feb 28, 2025"
                    icon={<PieChart className="h-5 w-5" />}
                  />
                  <SavedReportCard
                    title="Cash Flow Projection"
                    description="6-month cash flow forecast"
                    lastRun="Feb 25, 2025"
                    icon={<LineChart className="h-5 w-5" />}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

function SavedReportCard({
  title,
  description,
  lastRun,
  icon,
}: {
  title: string
  description: string
  lastRun: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">Last run: {lastRun}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          View
        </Button>
        <Button variant="outline" size="sm">
          Run Again
        </Button>
      </CardFooter>
    </Card>
  )
}

const topProducts = [
  { name: "Laptop Pro X", category: "Electronics", revenue: 325000, units: 250 },
  { name: "Wireless Earbuds", category: "Electronics", revenue: 180000, units: 2000 },
  { name: "Smartphone X12", category: "Electronics", revenue: 135000, units: 150 },
  { name: "Office Chair", category: "Furniture", revenue: 95000, units: 475 },
  { name: "Coffee Maker", category: "Appliances", revenue: 68000, units: 850 },
]

const salesChannels = [
  { name: "Online Store", percentage: 45, color: "#4f46e5" },
  { name: "Marketplace", percentage: 30, color: "#0ea5e9" },
  { name: "Retail Stores", percentage: 15, color: "#10b981" },
  { name: "Wholesale", percentage: 10, color: "#f59e0b" },
]

const stockAlerts = [
  { product: "Wireless Earbuds", sku: "P002", type: "low", stock: 8 },
  { product: "Office Chair", sku: "P003", type: "low", stock: 5 },
  { product: "Coffee Maker", sku: "P004", type: "out", stock: 0 },
  { product: "Desk Lamp", sku: "P006", type: "low", stock: 3 },
]

const customerSegments = [
  { name: "New Customers", percentage: 25, color: "#4f46e5" },
  { name: "Returning", percentage: 40, color: "#0ea5e9" },
  { name: "Loyal", percentage: 20, color: "#10b981" },
  { name: "At Risk", percentage: 15, color: "#f59e0b" },
]

const expenseCategories = [
  { name: "Payroll", percentage: 45, color: "#4f46e5" },
  { name: "Rent & Utilities", percentage: 20, color: "#0ea5e9" },
  { name: "Marketing", percentage: 15, color: "#10b981" },
  { name: "Software", percentage: 10, color: "#f59e0b" },
  { name: "Other", percentage: 10, color: "#6b7280" },
]

