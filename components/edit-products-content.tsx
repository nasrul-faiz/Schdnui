"use client"

import * as React from "react"
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  CheckIcon,
  XIcon,
  LinkIcon,
  UploadIcon,
} from "lucide-react"
import { getRefillData, upsertRefillItems, deleteRefillItemsByProduct } from "@/lib/refill-store"
import type { RefillItem } from "@/components/refill-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ImageLightbox } from "@/components/image-lightbox"

type Product = Pick<RefillItem, "productCode" | "productName" | "image">

const inputCls =
  "w-full rounded-md border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"

interface EditRowProps {
  item: Product
  onSave: (updated: Product) => void
  onCancel: () => void
}

function EditRow({ item, onSave, onCancel }: EditRowProps) {
  const [draft, setDraft] = React.useState(item)
  const [imageMode, setImageMode] = React.useState<"url" | "upload">("url")
  const fileRef = React.useRef<HTMLInputElement>(null)

  function set<K extends keyof Product>(key: K, val: Product[K]) {
    setDraft((prev) => ({ ...prev, [key]: val }))
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set("image", reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <TableRow className="bg-accent/20">
      <TableCell className="py-1.5 text-center">
        <input
          className={inputCls}
          value={draft.productCode}
          onChange={(e) => set("productCode", e.target.value)}
        />
      </TableCell>
      <TableCell className="py-1.5">
        <div className="flex flex-col gap-1.5">
          <input
            className={inputCls}
            value={draft.productName}
            onChange={(e) => set("productName", e.target.value)}
            placeholder="Product name"
          />
          <div className="flex items-center gap-1">
            {draft.image && (
              <div className="relative h-7 w-7 rounded overflow-hidden border bg-muted shrink-0">
                <img
                  src={draft.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex gap-1 flex-1">
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`flex items-center gap-1 rounded px-1.5 py-1 text-[10px] border transition-colors ${
                  imageMode === "url"
                    ? "bg-foreground text-background border-foreground"
                    : "text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                <LinkIcon className="size-3" /> URL
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageMode("upload")
                  fileRef.current?.click()
                }}
                className={`flex items-center gap-1 rounded px-1.5 py-1 text-[10px] border transition-colors ${
                  imageMode === "upload"
                    ? "bg-foreground text-background border-foreground"
                    : "text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                <UploadIcon className="size-3" /> Upload
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </div>
          </div>
          {imageMode === "url" && (
            <input
              className={inputCls}
              value={draft.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://..."
            />
          )}
        </div>
      </TableCell>
      <TableCell className="py-1.5">
        <div className="flex justify-center gap-1">
          <button
            onClick={() => onSave(draft)}
            className="rounded p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-600"
          >
            <CheckIcon className="size-3.5" />
          </button>
          <button
            onClick={onCancel}
            className="rounded p-1 hover:bg-muted text-muted-foreground"
          >
            <XIcon className="size-3.5" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function EditProductsContent() {
  const [products, setProducts] = React.useState<Product[]>([])
  // keep all refill items so we can propagate product name/image changes
  const [allItems, setAllItems] = React.useState<
    Array<RefillItem & { machine_id: string }>
  >([])
  const [loading, setLoading] = React.useState(true)
  const [editingCode, setEditingCode] = React.useState<string | null>(null)
  const [adding, setAdding] = React.useState(false)
  const [newProduct, setNewProduct] = React.useState<Product>({
    productCode: "",
    productName: "",
    image: "",
  })

  React.useEffect(() => {
    getRefillData().then((data) => {
      const flat: Array<RefillItem & { machine_id: string }> = []
      const map = new Map<string, Product>()
      for (const [machineId, items] of Object.entries(data)) {
        for (const item of items) {
          flat.push({ ...item, machine_id: machineId })
          if (!map.has(item.productCode)) {
            map.set(item.productCode, {
              productCode: item.productCode,
              productName: item.productName,
              image: item.image,
            })
          }
        }
      }
      setAllItems(flat)
      setProducts(Array.from(map.values()))
      setLoading(false)
    })
  }, [])

  async function handleSave(updated: Product) {
    const code = updated.productCode.trim().toUpperCase()
    if (!code || !updated.productName.trim()) return
    if (
      products.some(
        (p) => p.productCode === code && p.productCode !== editingCode
      )
    )
      return

    const finalProduct: Product = {
      productCode: code,
      productName: updated.productName.trim(),
      image: updated.image.trim(),
    }

    // Update all refill items that use this product code
    const affected = allItems
      .filter((i) => i.productCode === editingCode)
      .map((i) => ({
        ...i,
        productCode: finalProduct.productCode,
        productName: finalProduct.productName,
        image: finalProduct.image,
      }))

    if (affected.length > 0) {
      await upsertRefillItems(affected)
      setAllItems((prev) =>
        prev.map((i) =>
          i.productCode === editingCode
            ? { ...i, ...finalProduct }
            : i
        )
      )
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.productCode === editingCode ? finalProduct : p
      )
    )
    setEditingCode(null)
  }

  async function handleDelete(productCode: string) {
    await deleteRefillItemsByProduct(productCode)
    setProducts((prev) => prev.filter((p) => p.productCode !== productCode))
    setAllItems((prev) => prev.filter((i) => i.productCode !== productCode))
  }

  async function handleAdd(draft: Product) {
    const code = draft.productCode.trim().toUpperCase()
    if (!code || !draft.productName.trim()) return
    if (products.some((p) => p.productCode === code)) return
    // A product without any placement is just tracked locally —
    // it will be saved to DB when assigned to a machine slot.
    setProducts((prev) => [
      ...prev,
      {
        productCode: code,
        productName: draft.productName.trim(),
        image: draft.image.trim(),
      },
    ])
    setAdding(false)
    setNewProduct({ productCode: "", productName: "", image: "" })
  }

  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {products.length} product{products.length !== 1 && "s"} in master list
        </p>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setAdding(true)
            setEditingCode(null)
          }}
        >
          <PlusIcon className="size-3.5" />
          Add Product
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden text-xs">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {["Code", "Product Name / Image", "Actions"].map((h) => (
                <TableHead
                  key={h}
                  className="text-center text-[11px] font-semibold tracking-wide py-2"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {adding && (
              <EditRow
                item={newProduct}
                onSave={handleAdd}
                onCancel={() => setAdding(false)}
              />
            )}
            {products.map((item) => {
              if (editingCode === item.productCode) {
                return (
                  <EditRow
                    key={item.productCode}
                    item={item}
                    onSave={handleSave}
                    onCancel={() => setEditingCode(null)}
                  />
                )
              }
              return (
                <TableRow key={item.productCode} className="h-10">
                  <TableCell className="text-center py-1.5 text-muted-foreground font-mono">
                    {item.productCode}
                  </TableCell>
                  <TableCell className="py-1.5">
                    <div className="flex items-center gap-2">
                      {item.image ? (
                        <ImageLightbox src={item.image} alt={item.productName}>
                          <div className="h-7 w-7 rounded-md overflow-hidden border bg-muted shrink-0">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </ImageLightbox>
                      ) : (
                        <div className="h-7 w-7 rounded-md border bg-muted shrink-0" />
                      )}
                      <span className="font-medium truncate max-w-[200px]">
                        {item.productName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => setEditingCode(item.productCode)}
                        className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <PencilIcon className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.productCode)}
                        className="rounded p-1 hover:bg-red-100 dark:hover:bg-red-900/40 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2Icon className="size-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {products.length === 0 && !adding && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-10 text-center text-muted-foreground"
                >
                  No products yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
