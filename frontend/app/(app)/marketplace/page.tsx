"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, FileText, Funnel, Package, Plus, Store } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SupplierProfile = {
  id: string;
  businessName: string;
  description?: string;
  contactEmail?: string;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
};

type MarketplaceProduct = {
  id: string;
  supplierProfileId: string;
  name: string;
  description?: string;
  price: number;
  category: "FEED" | "VETERINARY_MEDICINE" | "SEEDS" | "FERTILIZER" | "EQUIPMENT";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  stock: number;
  sku?: string;
  createdAt: string;
};

type CategoryBadge = {
  category: MarketplaceProduct["category"];
  label: string;
};

const productStatusVariant = (status: MarketplaceProduct["status"]) =>
  status === "PUBLISHED" ? "default" : status === "DRAFT" ? "secondary" : "outline";

const supplierStatusVariant = (status: SupplierProfile["status"]) =>
  status === "ACTIVE" ? "default" : "destructive";

export default function MarketplacePage() {
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>([]);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<MarketplaceProduct["category"] | null>(null);
  const [filterStatus, setFilterStatus] = useState<MarketplaceProduct["status"] | null>(null);

  // Category labels
  const categoryLabels: Record<MarketplaceProduct["category"], string> = {
    FEED: "Feed",
    VETERINARY_MEDICINE: "Veterinary Medicine",
    SEEDS: "Seeds",
    FERTILIZER: "Fertilizer",
    EQUIPMENT: "Equipment",
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [suppliersRes, productsRes] = await Promise.all([
          fetch("/api/suppliers", { credentials: "include" }),
          fetch("/api/products", { credentials: "include" }),
        ]);

        if (!suppliersRes.ok && cancelled === false) {
          if (suppliersRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load suppliers");
        }

        if (!productsRes.ok && cancelled === false) {
          if (productsRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load products");
        }

        if (cancelled) return;

        const suppliersData = await suppliersRes.json();
        const productsData = await productsRes.json();

        if (cancelled) return;

        setSuppliers(suppliersData.suppliers ?? []);
        setProducts(productsData.products ?? []);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError((err as Error).message);
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
        <PageHeader title="Marketplace" description="Loading marketplace data..." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="space-y-3">
                <div className="h-4 w-2/3 rounded bg-secondary" />
                <div className="h-3 w-1/2 rounded bg-secondary" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
        <PageHeader title="Marketplace" />
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Could not load marketplace</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/login">Back to login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get filtered products
  const filteredProducts = products.filter(
    (p) =>
      (!filterCategory || p.category === filterCategory) &&
      (!filterStatus || p.status === filterStatus)
  );

  // Compute stats from integrated data
  const totalProducts = products.length;
  const totalSuppliers = suppliers.length;
  const productsByCategory = {
    FEED: products.filter((p) => p.category === "FEED").length,
    VETERINARY_MEDICINE: products.filter((p) => p.category === "VETERINARY_MEDICINE")
      .length,
    SEEDS: products.filter((p) => p.category === "SEEDS").length,
    FERTILIZER: products.filter((p) => p.category === "FERTILIZER").length,
    EQUIPMENT: products.filter((p) => p.category === "EQUIPMENT").length,
  };
  const productsByStatus = {
    DRAFT: products.filter((p) => p.status === "DRAFT").length,
    PUBLISHED: products.filter((p) => p.status === "PUBLISHED").length,
    ARCHIVED: products.filter((p) => p.status === "ARCHIVED").length,
  };

  // Get unique categories and statuses for filter chips
  const uniqueCategories = [...new Set(products.map((p) => p.category))];
  const uniqueStatuses = [...new Set(products.map((p) => p.status))];

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <PageHeader
        title="Marketplace"
        description="Supply & Equipment Hub"
        actions={
          <Button asChild>
            <Link href="/supplier/create">
              <Plus /> Create Supplier Profile
            </Link>
          </Button>
        }
      />

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Products"
          value={totalProducts}
          hint="Listed in the marketplace"
          icon={Package}
        />
        <StatCard
          label="Suppliers"
          value={totalSuppliers}
          hint="Registered businesses"
          icon={Store}
        />
        <StatCard
          label="Published"
          value={productsByStatus.PUBLISHED}
          hint="Visible to buyers"
          icon={CheckCircle2}
          tone={productsByStatus.PUBLISHED > 0 ? "success" : "default"}
        />
        <StatCard
          label="Draft"
          value={productsByStatus.DRAFT}
          hint="Awaiting publication"
          icon={FileText}
        />
      </section>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Funnel className="size-4" aria-hidden="true" />
            </span>
            Filter
          </CardTitle>
          <CardDescription>Narrow the catalogue by category or status.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={!filterCategory && !filterStatus ? "default" : "outline"}
            onClick={() => setFilterCategory(null)}
          >
            All
          </Button>

          {uniqueCategories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={filterCategory === category ? "default" : "outline"}
              onClick={() =>
                setFilterCategory(category as MarketplaceProduct["category"])
              }
            >
              {categoryLabels[category]}
            </Button>
          ))}

          {uniqueStatuses.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() =>
                setFilterStatus(status as MarketplaceProduct["status"])
              }
            >
              {status}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Products */}
      <section aria-label="Products" className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Package className="size-4" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight">Products</h2>
          <Badge variant="secondary">{filteredProducts.length}</Badge>
        </div>

        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Package className="size-6" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                <p className="font-medium">No products found matching your filters.</p>
                <p className="text-sm text-muted-foreground">
                  Be the first to publish a product in the marketplace!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-2">
                    {product.name}
                    <Badge variant="outline">{categoryLabels[product.category]}</Badge>
                  </CardTitle>
                  <CardDescription>
                    From:{" "}
                    {suppliers.find((s) => s.id === product.supplierProfileId)
                      ?.businessName || "Unknown supplier"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-xl font-semibold tabular-nums">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">In stock</p>
                      <p className="text-xl font-semibold tabular-nums">{product.stock}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={productStatusVariant(product.status)}>
                      {product.status}
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/product/${product.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Category breakdown section */}
      <Card>
        <CardHeader>
          <CardTitle>Products by Category</CardTitle>
          <CardDescription>How the catalogue is distributed.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3">
            {Object.entries(productsByCategory).map(([category, count]) => (
              <div
                key={category}
                className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
              >
                <dt className="text-sm text-muted-foreground">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </dt>
                <dd className="font-medium tabular-nums">{count}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* Supplier stats section */}
      <section aria-label="Suppliers" className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Store className="size-4" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight">Suppliers</h2>
          <Badge variant="secondary">{totalSuppliers}</Badge>
        </div>

        {totalSuppliers === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Store className="size-6" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                <p className="font-medium">No suppliers registered yet.</p>
                <p className="text-sm text-muted-foreground">
                  Publish your first product to get started!
                </p>
              </div>
              <Button asChild>
                <Link href="/supplier/create">
                  <Plus /> Create Supplier Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-2">
                    {supplier.businessName}
                    <Badge variant={supplierStatusVariant(supplier.status)}>
                      {supplier.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{supplier.contactEmail}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {products.filter((p) => p.supplierProfileId === supplier.id).length}{" "}
                    product{"s"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
