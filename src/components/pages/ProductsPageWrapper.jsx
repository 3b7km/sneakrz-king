import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductsPage from "./ProductsPage.jsx";

const ProductsPageWrapper = (props) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  // Update search term when URL search parameter changes
  useEffect(() => {
    if (searchQuery && searchQuery !== props.searchTerm) {
      props.setSearchTerm(searchQuery);
    }
  }, [searchQuery, props.setSearchTerm]);

  return <ProductsPage {...props} />;
};

export default ProductsPageWrapper;
