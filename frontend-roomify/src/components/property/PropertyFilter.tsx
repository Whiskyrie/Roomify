import { useState, useEffect } from "react";

interface PropertyFilterProps {
  currentFilters: {
    location: string;
    minPrice: string;
    maxPrice: string;
    bedrooms: string;
    bathrooms: string;
    propertyType: string;
  };
  onFilterChange: (filters: Record<string, string>) => void;
}

const PropertyFilter = ({
  currentFilters,
  onFilterChange,
}: PropertyFilterProps) => {
  const [filters, setFilters] = useState(currentFilters);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      location: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      propertyType: "",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const propertyTypes = [
    { value: "", label: "Todos os tipos" },
    { value: "apartment", label: "Apartamento" },
    { value: "house", label: "Casa" },
    { value: "studio", label: "Studio" },
    { value: "condominium", label: "Condomínio" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
        <button
          type="button"
          className="text-primary hover:text-primary-dark md:hidden"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Fechar" : "Expandir"}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`space-y-4 ${expanded ? "block" : "hidden md:block"}`}
      >
        {/* Tipo de Propriedade */}
        <div>
          <label
            htmlFor="propertyType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo de Imóvel
          </label>
          <select
            id="propertyType"
            name="propertyType"
            value={filters.propertyType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          >
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Faixa de Preço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Faixa de Preço (R$)
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filters.minPrice}
              onChange={handleInputChange}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              min="0"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={handleInputChange}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              min="0"
            />
          </div>
        </div>

        {/* Quartos */}
        <div>
          <label
            htmlFor="bedrooms"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Quartos
          </label>
          <select
            id="bedrooms"
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="">Qualquer</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        {/* Banheiros */}
        <div>
          <label
            htmlFor="bathrooms"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Banheiros
          </label>
          <select
            id="bathrooms"
            name="bathrooms"
            value={filters.bathrooms}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="">Qualquer</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        {/* Botões */}
        <div className="flex space-x-2 pt-2">
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors"
          >
            Aplicar Filtros
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
          >
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyFilter;
