"use client"

import { useState, useEffect } from "react"
import { DollarSign, Users, Package, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataChart } from "@/components/dashboard/data-chart"
import { StatsCard } from "@/components/dashboard/stats-card"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"

export default function AnalyticsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("sales")
  const [period, setPeriod] = useState("month")
  const [salesData, setSalesData] = useState([])
  const [usersData, setUsersData] = useState([])
  const [inventoryData, setInventoryData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [loading, setLoading] = useState({
    sales: true,
    users: true,
    inventory: true,
    revenue: true,
  })

  // Fetch data when tab or period changes
  useEffect(() => {
    fetchData(activeTab, period)
  }, [activeTab, period])

  const fetchData = async (metric: string, timePeriod: string) => {
    setLoading((prev) => ({ ...prev, [metric]: true }))

    try {
      const response = await apiClient.get(`/api/analytics?metric=${metric}&period=${timePeriod}`)

      switch (metric) {
        case "sales":
          setSalesData(response.data || [])
          break
        case "users":
          setUsersData(response.data || [])
          break
        case "inventory":
          setInventoryData(response.data || [])
          break
        case "revenue":
          setRevenueData(response.data || [])
          break
      }
    } catch (error) {
      console.error(`Error fetching ${metric} data:`, error)
      toast({
        title: "Error",
        description: `Failed to load ${metric} analytics data.`,
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, [metric]: false }))
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights for your business</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Sales"
          value="$84,325.75"
          trend={{ value: "15.3%", positive: true }}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Users"
          value="1,245"
          trend={{ value: "12.5%", positive: true }}
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Inventory Value"
          value="$152,345.80"
          trend={{ value: "5.2%", positive: true }}
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Profit Margin"
          value="45.2%"
          trend={{ value: "3.8%", positive: true }}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Track your sales performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <DataChart
                title="Sales Trend"
                data={salesData}
                series={[{ name: "Sales", key: "value", color: "#8884d8" }]}
                type="line"
                loading={loading.sales}
                height={400}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>Monitor user activity and growth</CardDescription>
            </CardHeader>
            <CardContent>
              <DataChart
                title="User Activity"
                data={usersData}
                series={[
                  { name: "Active Users", key: "active", color: "#8884d8" },
                  { name: "New Users", key: "new", color: "#82ca9d" },
                ]}
                type="line"
                loading={loading.users}
                height={400}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Analytics</CardTitle>
              <CardDescription>Track inventory levels and stock status</CardDescription>
            </CardHeader>
            <CardContent>
              <DataChart
                title="Inventory Status"
                data={inventoryData}
                series={[
                  { name: "In Stock", key: "inStock", color: "#10b981" },
                  { name: "Low Stock", key: "lowStock", color: "#f59e0b" },
                  { name: "Out of Stock", key: "outOfStock", color: "#ef4444" },
                ]}
                type="bar"
                loading={loading.inventory}
                height={400}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Analytics</CardTitle>
              <CardDescription>Track revenue, expenses, and profit</CardDescription>
            </CardHeader>
            <CardContent>
              <DataChart
                title="Financial Performance"
                data={revenueData}
                series={[
                  { name: "Revenue", key: "revenue", color: "#10b981" },
                  { name: "Expenses", key: "expenses", color: "#ef4444" },
                  { name: "Profit", key: "profit", color: "#8884d8" },
                ]}
                type="bar"
                loading={loading.revenue}
                height={400}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

