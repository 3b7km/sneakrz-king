import { useNavigate } from "react-router-dom";

const BrandsPage = ({ selectedBrand, setSelectedBrand, brands = [] }) => {
  const navigate = useNavigate();

  // Enhanced brand data with descriptions
  const brandsData = [
    {
      name: "Nike",
      description: "Just Do It - The world's leading athletic brand",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F26e7fe5ba12d4f12a5b5cc3d4e881806%2F311f95c004fe4e1eb6791863791e251b?format=webp&width=800",
      products: brands.find((b) => b.name === "Nike")?.count || 0,
    },
    {
      name: "Adidas",
      description: "Impossible is Nothing - German sportswear giant",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F26e7fe5ba12d4f12a5b5cc3d4e881806%2F89746157221746c99348974f49f79351?format=webp&width=800",
      products: brands.find((b) => b.name === "Adidas")?.count || 0,
    },
    {
      name: "Jordan",
      description: "Jumpman - Basketball heritage and style",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F26e7fe5ba12d4f12a5b5cc3d4e881806%2F2ceea07cc92f4440b01ebe199cadb9ac?format=webp&width=800",
      products: brands.find((b) => b.name === "Jordan")?.count || 0,
    },
    {
      name: "New Balance",
      description: "Endorsed by No One - Premium comfort and performance",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F26e7fe5ba12d4f12a5b5cc3d4e881806%2F51dda5a28dda4f4b881a0372a5b4a969?format=webp&width=800",
      products: brands.find((b) => b.name === "New Balance")?.count || 0,
    },
    {
      name: "ASICS",
      description: "Anima Sana In Corpore Sano - Sound mind, sound body",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F26e7fe5ba12d4f12a5b5cc3d4e881806%2F174401a5180b49a4a04f370f6f05aa8f?format=webp&width=800",
      products: brands.find((b) => b.name === "ASICS")?.count || 0,
    },
  ].filter((brand) => brand.products > 0);

  const handleViewCollection = (brandName) => {
    setSelectedBrand(brandName);
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#1e3b60" }}
            >
              Our Brands
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the world's most prestigious sneaker brands, each with
              their unique heritage and style.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brandsData.map((brand, index) => (
              <div
                key={brand.name}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-6">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: "#1e3b60" }}
                  >
                    {brand.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{brand.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {brand.products} Products
                    </span>
                    <button
                      onClick={() => handleViewCollection(brand.name)}
                      className="text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      style={{ backgroundColor: "#002b5e" }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#001a3d")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#002b5e")
                      }
                    >
                      View Collection
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandsPage;
