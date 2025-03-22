"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SearchIcon, Loader2, Package, User, ShoppingCart, X } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { useToast } from "@/components/ui/use-toast"

type SearchResult = {
  id: string
  name: string
  type: "product" | "customer" | "order" | "invoice"
  [key: string]: any
}

export function GlobalSearch() {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Fetch search results when query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      try {
        const data = await apiClient.get<{ results: SearchResult[] }>(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
        )
        setResults(data.results || [])
      } catch (error) {
        console.error("Error searching:", error)
        toast({
          title: "Search failed",
          description: "Failed to fetch search results. Please try again.",
          variant: "destructive",
        })
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery, toast])

  // Navigate to result and close dialog
  const handleSelect = useCallback(
    (result: SearchResult) => {
      setOpen(false)

      // Navigate based on result type
      switch (result.type) {
        case "product":
          router.push(`/inventory/products/${result.id}`)
          break
        case "customer":
          router.push(`/customers/${result.id}`)
          break
        case "order":
          router.push(`/sales/orders/${result.id}`)
          break
        case "invoice":
          router.push(`/finance/invoices/${result.id}`)
          break
        default:
          console.warn("Unknown result type:", result.type)
      }
    },
    [router],
  )

  // Clear search
  const handleClear = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  // Get icon based on result type
  const getIcon = (type: string) => {
    switch (type) {
      case "product":
        return <Package className="mr-2 h-4 w-4" />
      case "customer":
        return <User className="mr-2 h-4 w-4" />
      case "order":
      case "invoice":
        return <ShoppingCart className="mr-2 h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <span className="sr-only">Search</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3">
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            ref={inputRef}
            placeholder="Search for anything..."
            value={query}
            onValueChange={setQuery}
            className="flex-1 border-0 outline-none focus:ring-0"
          />
          {query && (
            <Button variant="ghost" size="icon" onClick={handleClear} className="h-7 w-7">
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </div>
        <CommandList>
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && query && results.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
          {!loading && results.length > 0 && (
            <>
              <CommandGroup heading="Products">
                {results
                  .filter((result) => result.type === "product")
                  .slice(0, 5)
                  .map((result) => (
                    <CommandItem key={`${result.type}-${result.id}`} onSelect={() => handleSelect(result)}>
                      {getIcon(result.type)}
                      <span>{result.name}</span>
                      {result.sku && <span className="ml-2 text-xs text-muted-foreground">{result.sku}</span>}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Customers">
                {results
                  .filter((result) => result.type === "customer")
                  .slice(0, 5)
                  .map((result) => (
                    <CommandItem key={`${result.type}-${result.id}`} onSelect={() => handleSelect(result)}>
                      {getIcon(result.type)}
                      <span>{result.name}</span>
                      {result.email && <span className="ml-2 text-xs text-muted-foreground">{result.email}</span>}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Orders">
                {results
                  .filter((result) => result.type === "order")
                  .slice(0, 5)
                  .map((result) => (
                    <CommandItem key={`${result.type}-${result.id}`} onSelect={() => handleSelect(result)}>
                      {getIcon(result.type)}
                      <span>{result.orderNumber}</span>
                      {result.total && (
                        <span className="ml-2 text-xs text-muted-foreground">${result.total.toFixed(2)}</span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
          {!query && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              Start typing to search across products, customers, orders, and more...
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

