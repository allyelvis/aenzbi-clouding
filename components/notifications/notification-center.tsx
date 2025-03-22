"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bell, Check, Trash, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

type Notification = {
  id: string
  type: "system" | "alert" | "message"
  title: string
  description: string
  isRead: boolean
  createdAt: string
  relatedId?: string
  relatedType?: string
}

export function NotificationCenter() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Fetch notifications when opened
  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get<{ notifications: Notification[] }>("/api/notifications")
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        title: "Failed to load notifications",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await apiClient.patch("/api/notifications", { ids: [id] })
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Failed to update notification",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id)
    if (unreadIds.length === 0) return

    try {
      await apiClient.patch("/api/notifications", { ids: unreadIds })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      toast({
        title: "All notifications marked as read",
        description: `${unreadIds.length} notifications updated.`,
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast({
        title: "Failed to update notifications",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await apiClient.delete(`/api/notifications?ids=${id}`)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast({
        title: "Failed to delete notification",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const clearAll = async () => {
    const ids = notifications.map((n) => n.id).join(",")
    if (!ids) return

    try {
      await apiClient.delete(`/api/notifications?ids=${ids}`)
      setNotifications([])
      toast({
        title: "All notifications cleared",
        description: "Your notification center is now empty.",
      })
    } catch (error) {
      console.error("Error clearing notifications:", error)
      toast({
        title: "Failed to clear notifications",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.isRead
    return notification.type === activeTab
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "system":
        return (
          <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-900">
            <Bell className="h-3 w-3 text-blue-600 dark:text-blue-300" />
          </div>
        )
      case "alert":
        return (
          <div className="rounded-full bg-red-100 p-1 dark:bg-red-900">
            <Bell className="h-3 w-3 text-red-600 dark:text-red-300" />
          </div>
        )
      case "message":
        return (
          <div className="rounded-full bg-green-100 p-1 dark:bg-green-900">
            <Bell className="h-3 w-3 text-green-600 dark:text-green-300" />
          </div>
        )
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={markAllAsRead} title="Mark all as read">
                <Check className="h-4 w-4" />
                <span className="sr-only">Mark all as read</span>
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearAll} title="Clear all">
                <Trash className="h-4 w-4" />
                <span className="sr-only">Clear all</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)} title="Close">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-1">
            <TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold data-[state=active]:border-primary"
              >
                All
                {notifications.length > 0 && <Badge className="ml-1 px-1">{notifications.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold data-[state=active]:border-primary"
              >
                Unread
                {unreadCount > 0 && <Badge className="ml-1 px-1">{unreadCount}</Badge>}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="m-0">
            <NotificationList
              notifications={filteredNotifications}
              loading={loading}
              getNotificationIcon={getNotificationIcon}
              formatDate={formatDate}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
            />
          </TabsContent>
          <TabsContent value="unread" className="m-0">
            <NotificationList
              notifications={filteredNotifications}
              loading={loading}
              getNotificationIcon={getNotificationIcon}
              formatDate={formatDate}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
            />
          </TabsContent>
          <TabsContent value="system" className="m-0">
            <NotificationList
              notifications={filteredNotifications}
              loading={loading}
              getNotificationIcon={getNotificationIcon}
              formatDate={formatDate}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
            />
          </TabsContent>
          <TabsContent value="alert" className="m-0">
            <NotificationList
              notifications={filteredNotifications}
              loading={loading}
              getNotificationIcon={getNotificationIcon}
              formatDate={formatDate}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
            />
          </TabsContent>
          <TabsContent value="message" className="m-0">
            <NotificationList
              notifications={filteredNotifications}
              loading={loading}
              getNotificationIcon={getNotificationIcon}
              formatDate={formatDate}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
            />
          </TabsContent>
        </Tabs>
        <div className="border-t p-2 text-center">
          <Button variant="link" size="sm" asChild>
            <a href="/notifications">View all notifications</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface NotificationListProps {
  notifications: Notification[]
  loading: boolean
  getNotificationIcon: (type: string) => React.ReactNode
  formatDate: (date: string) => string
  markAsRead: (id: string) => Promise<void>
  deleteNotification: (id: string) => Promise<void>
}

function NotificationList({
  notifications,
  loading,
  getNotificationIcon,
  formatDate,
  markAsRead,
  deleteNotification,
}: NotificationListProps) {
  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-center text-sm text-muted-foreground">
        <div>
          <p>No notifications to display.</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="divide-y">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-3 p-3 hover:bg-muted/50 ${!notification.isRead ? "bg-muted/30" : ""}`}
          >
            <div className="mt-1">{getNotificationIcon(notification.type)}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-none">{notification.title}</p>
                <p className="whitespace-nowrap text-xs text-muted-foreground">{formatDate(notification.createdAt)}</p>
              </div>
              <p className="text-xs text-muted-foreground">{notification.description}</p>
            </div>
            <div className="flex flex-col gap-1">
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => markAsRead(notification.id)}
                  title="Mark as read"
                >
                  <Check className="h-3 w-3" />
                  <span className="sr-only">Mark as read</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => deleteNotification(notification.id)}
                title="Delete"
              >
                <Trash className="h-3 w-3" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

