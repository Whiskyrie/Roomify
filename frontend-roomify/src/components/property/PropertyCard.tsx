import { Link } from "react-router-dom";
import { Property } from "../../types/proprerty";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/properties/${property.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images[0] || "/placeholder.jpg"}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-secondary px-2 py-1 rounded text-white text-sm font-medium">
            {property.propertyType}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
            {property.title}
          </h3>
          <p className="text-gray-600 mb-2 truncate">{property.location}</p>

          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1 text-gray-500"
                >
                  <path d="M3 22v-8a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v8"></path>
                  <path d="M15 22v-8a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v8"></path>
                  <path d="M4 8V2h16v6"></path>
                </svg>
                <span className="text-sm text-gray-500">
                  {property.bedrooms}
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1 text-gray-500"
                >
                  <path d="M9 21V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v13"></path>
                  <path d="M6 18h12"></path>
                  <path d="M6 14h12"></path>
                </svg>
                <span className="text-sm text-gray-500">
                  {property.bathrooms}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-primary-dark font-bold text-lg">
              R$ {property.price.toLocaleString("pt-BR")}
              {property.priceType === "monthly" ? "/mês" : ""}
            </span>
            <div className="bg-primary-light text-primary px-2 py-1 rounded text-sm">
              Ver detalhes
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
