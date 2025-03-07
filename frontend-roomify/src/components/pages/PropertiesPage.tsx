import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../store/slices/propertySlice";
import PropertyCard from "../../components/property/PropertyCard";
import PropertyFilter from "../../components/property/PropertyFilter";
import PropertySearchBox from "../../components/property/PropertySearchBox";
import Pagination from "../common/Pagination";
import Loader from "../common/Loader";
import { RootState, AppDispatch } from "../store/store";
import { Property } from "../../types/proprerty";

const PropertiesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties, loading, error, total } = useSelector(
    (state: RootState) => state.property
  );

  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [limit] = useState(9); // Número de itens por página

  useEffect(() => {
    const filters = {
      page,
      limit,
      location: searchParams.get("location") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedrooms: searchParams.get("bedrooms") || "",
      bathrooms: searchParams.get("bathrooms") || "",
      propertyType: searchParams.get("propertyType") || "",
    };

    dispatch(fetchProperties(filters));
  }, [dispatch, page, searchParams]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    // Reset page when filters change
    setPage(1);
    const newParams = new URLSearchParams();
    newParams.set("page", "1");

    // Add filter params that have values
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-purple mb-8">
        Encontre seu espaço ideal
      </h1>

      <PropertySearchBox onSearch={handleFilterChange} />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <PropertyFilter
            currentFilters={{
              location: searchParams.get("location") || "",
              minPrice: searchParams.get("minPrice") || "",
              maxPrice: searchParams.get("maxPrice") || "",
              bedrooms: searchParams.get("bedrooms") || "",
              bathrooms: searchParams.get("bathrooms") || "",
              propertyType: searchParams.get("propertyType") || "",
            }}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="w-full md:w-3/4">
          {error ? (
            <div className="bg-red-100 p-4 rounded-md text-red-800 mb-4">
              {error}
            </div>
          ) : null}

          {properties.length === 0 && !loading ? (
            <div className="bg-primary-light p-6 rounded-lg text-center">
              <p className="text-lg mb-2">Nenhuma propriedade encontrada</p>
              <p>Tente ajustar seus filtros para ver mais resultados.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property: Property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {loading && (
                <div className="flex justify-center mt-6">
                  <Loader />
                </div>
              )}

              {total > limit && (
                <div className="mt-10">
                  <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(total / limit)}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
