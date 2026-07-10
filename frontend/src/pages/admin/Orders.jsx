import { useState, useEffect, useMemo } from "react"
import { api } from "#lib/api"
import { useSocket } from "#hooks/use-socket"
import { Button } from "#components/ui/button"
import { Input } from "#components/ui/input"
import { Label } from "#components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#components/ui/dialog"
import { Badge } from "#components/ui/badge"
import { Skeleton } from "#components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#components/ui/table"
import { Filter, Eye, Pencil, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
}

const PAGE_SIZE = 10

export function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ startDate: "", endDate: "", minPrice: "", maxPrice: "" })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ customerName: "", status: "" })
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState("asc")
  const [page, setPage] = useState(0)

  const fetchOrders = (params = {}) => {
    setLoading(true)
    const cleanParams = {}
    Object.entries(params).forEach(([k, v]) => { if (v) cleanParams[k] = v })
    api.orders.getAll(cleanParams)
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const socketRef = useSocket()

  useEffect(() => {
    if (!socketRef.current) return
    const socket = socketRef.current

    const onOrderChange = () => fetchOrders(filters)
    socket.on("orderCreated", onOrderChange)
    socket.on("orderUpdated", onOrderChange)
    socket.on("orderDeleted", onOrderChange)

    return () => {
      socket.off("orderCreated", onOrderChange)
      socket.off("orderUpdated", onOrderChange)
      socket.off("orderDeleted", onOrderChange)
    }
  }, [socketRef.current])

  const applyFilters = () => {
    fetchOrders(filters)
  }

  const openDetail = (order) => {
    setSelectedOrder(order)
    setDetailOpen(true)
  }

  const openEdit = (order) => {
    setSelectedOrder(order)
    setEditForm({ customerName: order.customerName || "", status: order.status })
    setEditOpen(true)
  }

  const handleUpdate = async () => {
    try {
      await api.orders.update(selectedOrder._id, editForm)
      toast.success("Order updated")
      setEditOpen(false)
      fetchOrders(filters)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return
    try {
      await api.orders.delete(id)
      toast.success("Order deleted")
      fetchOrders(filters)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
    setPage(0)
  }

  const getSortValue = (order, key) => {
    switch (key) {
      case "customer": return (order.customerName || order.user?.name || "").toLowerCase()
      case "status": return order.status
      case "totalAmount": return parseFloat(order.totalAmount)
      case "orderDate": return new Date(order.orderDate).getTime()
      default: return ""
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return orders
    return [...orders].sort((a, b) => {
      const aVal = getSortValue(a, sortKey)
      const bVal = getSortValue(b, sortKey)
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1
      return 0
    })
  }, [orders, sortKey, sortDir])

  const pageCount = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const SortHead = ({ label, sortField }) => (
    <TableHead
      className="cursor-pointer select-none"
      onClick={() => toggleSort(sortField)}
    >
      <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
        <span>{label}</span>
        <ArrowUpDown className="ml-2 size-3.5" />
      </Button>
    </TableHead>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="size-4" />
            Filter Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Min Price</Label>
              <Input type="number" min="0" step="0.01" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Max Price</Label>
              <Input type="number" min="0" step="0.01" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} placeholder="999" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={() => { setFilters({ startDate: "", endDate: "", minPrice: "", maxPrice: "" }); fetchOrders() }}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : (
            <div className="w-full bg-transparent">
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader className="bg-card">
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Order ID</TableHead>
                      <SortHead label="Customer" sortField="customer" />
                      <TableHead>Items</TableHead>
                      <SortHead label="Status" sortField="status" />
                      <SortHead label="Amount" sortField="totalAmount" />
                      <SortHead label="Date" sortField="orderDate" />
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-card">
                    {paged.length ? (
                      paged.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>
                            <span className="font-mono text-xs">{order._id.slice(-8).toUpperCase()}</span>
                          </TableCell>
                          <TableCell>{order.customerName || order.user?.name || "N/A"}</TableCell>
                          <TableCell>{order.products.length}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[order.status]}>{order.status}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${parseFloat(order.totalAmount).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openDetail(order)}>
                                <Eye className="size-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openEdit(order)}>
                                <Pencil className="size-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(order._id)}>
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">No results.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between px-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Page {page + 1} of {pageCount || 1}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 0}>
                    <ChevronLeft className="size-4" /> Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= pageCount - 1}>
                    Next <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono">{selectedOrder._id}</span>
                <span className="text-muted-foreground">Customer:</span>
                <span>{selectedOrder.customerName || selectedOrder.user?.name}</span>
                <span className="text-muted-foreground">Status:</span>
                <Badge className={statusColors[selectedOrder.status]}>{selectedOrder.status}</Badge>
                <span className="text-muted-foreground">Total:</span>
                <span className="font-semibold">${selectedOrder.totalAmount.toFixed(2)}</span>
                <span className="text-muted-foreground">Date:</span>
                <span>{new Date(selectedOrder.orderDate).toLocaleString()}</span>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Items:</p>
                {selectedOrder.products.map((item, idx) => (
                  <div key={idx} className="flex justify-between rounded border p-2 text-sm">
                    <span>{item.product?.name || "Product"}</span>
                    <span>x{item.quantity} — ${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input value={editForm.customerName} onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdate} className="w-full">Update Order</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
