import { useState, useMemo } from "react";

export function useProductFilters(products) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // Get unique brands from products
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(products.map((product) => product.brand))];
    return uniqueBrands.sort();
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
