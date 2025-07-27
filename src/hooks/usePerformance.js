import { useState, useEffect, useCallback, useMemo } from "react";
import { api, loadingManager } from "../services/api.js";

// Custom hook for managing loading states with performance optimization
export const useLoadingStates = () => {
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    // Subscribe to global loading manager
    const unsubscribe = loadingManager.subscribe(setLoadingStates);
    return unsubscribe;
  }, []);

  const setLoading = useCallback((key, isLoading) => {
    loadingManager.setLoading(key, isLoading);
  }, []);

  const withLoading = useCallback(async (key, asyncFn) => {
    return loadingManager.withLoading(key, asyncFn);
  }, []);

  return {
    loadingStates,
    setLoading,
    withLoading,
    isLoading: useCallback((key) => loadingManager.isLoading(key), []),
  };
};

// Custom hook for optimized product filtering
export const useProductFilters = (products) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [onSale, setOnSale] = useState(false);
  const [inStock, setInStock] = useState(false);

  // Memoized brand counts for performance
  const brands = useMemo(() => {
    const brandCounts = { All: products.length };
    products.forEach((product) => {
      brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
    });
    return Object.entries(brandCounts).map(([name, count]) => ({
      name,
      count,
    }));
  }, [products]);

  // Memoized filtered products for performance
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Brand filter
      const matchesBrand =
        selectedBrand === "All" || product.brand === selectedBrand;

      // Gender filter
      const matchesGender =
        selectedGender === "All" || product.gender === selectedGender;

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      // Size filter
      const matchesSize =
        selectedSizes.length === 0 ||
        product.sizes?.some((size) => {
          const sizeValue = typeof size === "object" ? size.value : size;
          return selectedSizes.includes(sizeValue);
        });

      // Price filter
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      // Sale filter
      const matchesSale = !onSale || product.onSale;

      // Stock filter
      const matchesStock =
        !inStock ||
        product.sizes?.some((size) =>
          typeof size === "object" ? size.available : true,
        );

      return (
        matchesSearch &&
        matchesBrand &&
        matchesGender &&
        matchesCategory &&
        matchesSize &&
        matchesPrice &&
        matchesSale &&
        matchesStock
      );
    });
  }, [
    products,
    searchTerm,
    selectedBrand,
    selectedGender,
    selectedCategories,
    selectedSizes,
    priceRange,
    onSale,
    inStock,
  ]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedBrand("All");
    setSelectedGender("All");
    setSelectedCategories([]);
    setSelectedSizes([]);
    setPriceRange([0, 5000]);
    setOnSale(false);
    setInStock(false);
  }, []);

  return {
    // Filters
    searchTerm,
    setSearchTerm,
    selectedBrand,
    setSelectedBrand,
    selectedGender,
    setSelectedGender,
    selectedCategories,
    setSelectedCategories,
    selectedSizes,
    setSelectedSizes,
    priceRange,
    setPriceRange,
    onSale,
    setOnSale,
    inStock,
    setInStock,

    // Results
    filteredProducts,
    brands,
    clearFilters,
  };
};

// Note: Cart management is now handled by CartContext.jsx

// Custom hook for intersection observer (lazy loading)
export const useIntersectionObserver = (options = {}) => {
  const [entry, setEntry] = useState(null);
  const [node, setNode] = useState(null);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) => setEntry(entry), {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      }),
    [options],
  );

  useEffect(() => {
    if (!node) return;

    observer.observe(node);
    return () => observer.disconnect();
  }, [observer, node]);

  return [setNode, entry];
};

// Custom hook for debounced values (search optimization)
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for analytics tracking
export const useAnalytics = () => {
  const trackPageView = useCallback((page) => {
    api.trackEvent("page_view", { page });
  }, []);

  const trackProductView = useCallback((product) => {
    api.trackEvent("product_view", {
      product_id: product.id,
      product_name: product.name,
      brand: product.brand,
      price: product.price,
    });
  }, []);

  const trackSearch = useCallback((query, results_count) => {
    api.trackEvent("search", { query, results_count });
  }, []);

  return {
    trackPageView,
    trackProductView,
    trackSearch,
  };
};
