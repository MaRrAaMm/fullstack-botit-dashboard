import { useState, useEffect, useMemo } from "react"
import { api } from "#lib/api"
import { useSocket } from "#hooks/use-socket"
import { Button } from "#components/ui/button"
import { Input } from "#components/ui/input"
import { Label } from "#components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "#components/ui/dialog"
import { Skeleton } from "#components/ui/skeleton"
import { Badge } from "#components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#components/ui/table"
import { Plus, Pencil, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

const PAGE_SIZE = 10

export function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({ name: "", price: "", category: "" })
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState("asc")
  const [page, setPage] = useState(0)

  const fetchProducts = () => {
    api.products.getAll()
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const socketRef = useSocket()

  useEffect(() => {
    if (!socketRef.current) return
    const socket = socketRef.current

    const onProductChange = () => fetchProducts()
    socket.on("productCreated", onProductChange)
    socket.on("productUpdated", onProductChange)
    socket.on("productDeleted", onProductChange)

    return () => {
      socket.off("productCreated", onProductChange)
      socket.off("productUpdated", onProductChange)
      socket.off("productDeleted", onProductChange)
    }
  }, [socketRef.current])

  const openCreate = () => {
    setEditingProduct(null)
    setForm({ name: "", price: "", category: "" })
    setDialogOpen(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setForm({ name: product.name, price: product.price.toString(), category: product.category })
    setDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const body = { ...form, price: parseFloat(form.price) }
      if (editingProduct) {
        await api.products.update(editingProduct._id, body)
        toast.success("Product updated")
      } else {
        await api.products.create(body)
        toast.success("Product created")
      }
      setDialogOpen(false)
      fetchProducts()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return
    try {
      await api.products.delete(id)
      toast.success("Product deleted")
      fetchProducts()
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

  const sorted = useMemo(() => {
    if (!sortKey) return products
    return [...products].sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]
      if (sortKey === "price") {
        aVal = parseFloat(aVal)
        bVal = parseFloat(bVal)
      } else {
        aVal = String(aVal).toLowerCase()
        bVal = String(bVal).toLowerCase()
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1
      return 0
    })
  }, [products, sortKey, sortDir])

  const pageCount = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const SortHead = ({ label, sortField }) => (
    <TableHead
      className="cursor-pointer select-none"
      onClick={sortField ? () => toggleSort(sortField) : undefined}
    >
      {sortField ? (
        <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
          <span>{label}</span>
          <ArrowUpDown className="ml-2 size-3.5" />
        </Button>
      ) : (
        label
      )}
    </TableHead>
  )

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products ({products.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 size-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full">{editingProduct ? "Update" : "Create"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full bg-background">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-card">
              <TableRow className="hover:bg-transparent">
                <SortHead label="Name" sortField="name" />
                <SortHead label="Category" sortField="category" />
                <SortHead label="Price" sortField="price" />
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-card">
              {paged.length ? (
                paged.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell><Badge variant="secondary">{product.category}</Badge></TableCell>
                    <TableCell className="font-medium">${parseFloat(product.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product._id)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">No results.</TableCell>
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
    </div>
  )
}
