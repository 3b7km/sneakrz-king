import { useState, useMemo } from "react";

export function useProductFilters(products) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // Get unique brands from products with counts
  const brands = useMemo(() => {
    const brandCounts = products.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {});

    const brandsWithCounts = Object.entries(brandCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Add "All" option at the beginning
    return [{ name: "All", count: products.length }, ...brandsWithCounts];
  }, [products]);

  // Filter products based on search term and selected brand
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand =
        selectedBrand === "" || product.brand === selectedBrand;

      return matchesSearch && matchesBrand;
    });
  }, [products, searchTerm, selectedBrand]);

  return {
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand,
    brands,
    filteredProducts,
  };
}
