"use client"

import { useState, useEffect } from "react"
import { DollarSign, Users, ShoppingCart, Package, AlertTriangle } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DataChart } from "@/components/dashboard/data-chart"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"

export default function DashboardPage() {
  const { toast } = useToast()
  const [stats, setStats] = useState<any>(null)
  const [salesData, setSalesData] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [period, setPeriod] = useState("month")
  const [loading, setLoading] = useState({
    stats: true,
    sales: true,
    activities: true,
  })

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      setLoading((prev) => ({ ...prev, stats: true }))

      try {
        const data = await apiClient.get(`/api/dashboard/stats?period=${period}`)
        setStats(data)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, stats: false }))
      }
    }

    fetchStats()
  }, [period, toast])

  // Fetch sales chart data
  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading((prev) => ({ ...prev, sales: true }))

      try {
        const { data } = await apiClient.get(`/api/dashboard/sales-chart?period=${period}`)
        setSalesData(data || [])
      } catch (error) {
        console.error("Error fetching sales data:", error)
        toast({
          title: "Error",
          description: "Failed to load sales chart data",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, sales: false }))
      }
    }

    fetchSalesData()
  }, [period, toast])

  // Fetch recent activities
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading((prev) => ({ ...prev, activities: true }))

      try {
        const { activities } = await apiClient.get("/api/dashboard/recent-activity?limit=10")
        setActivities(activities || [])
      } catch (error) {
        console.error("Error fetching activities:", error)
        toast({
          title: "Error",
          description: "Failed to load recent activities",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, activities: false }))
      }
    }

    fetchActivities()
  }, [toast])

  // Calculate revenue trend
  const revenueTrend = stats
    ? {
        value: stats.revenue.period > 0 ? `${((stats.revenue.period / stats.revenue.total) * 100).toFixed(1)}%` : "0%",
        positive: stats.revenue.period > 0,
      }
    : undefined

  // Calculate orders trend
  const ordersTrend = stats
    ? {
        value: stats.orders.new > 0 ? `${((stats.orders.new / stats.orders.total) * 100).toFixed(1)}%` : "0%",
        positive: stats.orders.new > 0,
      }
    : undefined

  // Calculate customers trend
  const customersTrend = stats
    ? {
        value: stats.customers.new > 0 ? `${((stats.customers.new / stats.customers.total) * 100).toFixed(1)}%` : "0%",
        positive: stats.customers.new > 0,
      }
    : undefined

  // Format activity items for timeline
  const timelineItems = activities.map((activity) => {
    let status: "success" | "warning" | "error" | "info" = "info"

    if (activity.type === "order") {
      if (activity.status === "delivered") status = "success"
      else if (activity.status === "cancelled") status = "error"
      else if (activity.status === "processing") status = "warning"
    } else if (activity.type === "inventory") {
      if (activity.quantity <= 0) status = "error"
      else if (activity.quantity < 10) status = "warning"
    }

    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      timestamp: new Date(activity.timestamp).toLocaleString(),
      status,
    }
  })

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={stats ? formatCurrency(stats.revenue.total) : "$0.00"}
          icon={<DollarSign className="h-4 w-4" />}
          trend={revenueTrend}
          loading={loading.stats}
        />
        <StatsCard
          title="Orders"
          value={stats ? stats.orders.total : 0}
          icon={<ShoppingCart className="h-4 w-4" />}
          trend={ordersTrend}
          loading={loading.stats}
        />
        <StatsCard
          title="Customers"
          value={stats ? stats.customers.total : 0}
          icon={<Users className="h-4 w-4" />}
          trend={customersTrend}
          loading={loading.stats}
        />
        <StatsCard
          title="Inventory Value"
          value={stats ? formatCurrency(stats.inventory.value) : "$0.00"}
          description={stats ? `${stats.inventory.lowStock} low stock items` : undefined}
          icon={<Package className="h-4 w-4" />}
          loading={loading.stats}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="md:col-span-4">
          <DataChart
            title="Sales Overview"
            description="Revenue over time"
            data={salesData}
            series={[{ name: "Revenue", key: "value", color: "#10b981" }]}
            type="bar"
            timeRanges={["week", "month", "quarter", "year"]}
            defaultTimeRange={period}
            loading={loading.sales}
            height={350}
            allowTypeChange={true}
            onTimeRangeChange={(range) => setPeriod(range)}
          />
        </div>
        <div className="md:col-span-3">
          <ActivityTimeline
            title="Recent Activity"
            description="Latest updates and actions"
            items={timelineItems}
            loading={loading.activities}
            className="h-[350px]"
          />
        </div>
      </div>

      {stats && stats.inventory.lowStock > 0 && (
        <div className="rounded-md bg-amber-50 p-4 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Inventory Alert</h3>
          </div>
          <div className="mt-2">
            <p>
              You have {stats.inventory.lowStock} products with low stock levels and {stats.inventory.outOfStock} out of
              stock items.
              <a href="/inventory" className="ml-1 underline">
                View inventory
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

