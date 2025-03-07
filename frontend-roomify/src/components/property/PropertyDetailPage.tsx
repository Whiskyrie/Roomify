import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPropertyById } from "../store/slices/propertySlice";
import Loader from "../common/Loader";
import { RootState, AppDispatch } from "../store/store";

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentProperty, loading, error } = useSelector(
    (state: RootState) => state.property
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id));
    }
  }, [dispatch, id]);

  const handleBooking = () => {
    if (user) {
      navigate(`/booking/${id}`);
    } else {
      navigate(`/login?redirect=/booking/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 p-4 rounded-md text-red-800 mb-4">
          {error}
        </div>
        <Link to="/properties" className="text-primary hover:text-primary-dark">
          ← Voltar para listagem
        </Link>
      </div>
    );
  }

  if (!currentProperty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 p-4 rounded-md text-yellow-800 mb-4">
          Propriedade não encontrada.
        </div>
        <Link to="/properties" className="text-primary hover:text-primary-dark">
          ← Voltar para listagem
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link
          to="/properties"
          className="text-primary hover:text-primary-dark inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Voltar para listagem
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Galeria de imagens */}
        <div className="relative">
          <div className="h-96 overflow-hidden">
            {currentProperty.images && currentProperty.images.length > 0 ? (
              <img
                src={currentProperty.images[activeImage]}
                alt={currentProperty.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">Sem imagem disponível</p>
              </div>
            )}
          </div>

          {currentProperty.images && currentProperty.images.length > 1 && (
            <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-4">
              <button
                onClick={() =>
                  setActiveImage((prev) =>
                    prev === 0 ? currentProperty.images.length - 1 : prev - 1
                  )
                }
                className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
                aria-label="Imagem anterior"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setActiveImage((prev) =>
                    prev === currentProperty.images.length - 1 ? 0 : prev + 1
                  )
                }
                className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
                aria-label="Próxima imagem"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Miniaturas das imagens */}
        {currentProperty.images && currentProperty.images.length > 1 && (
          <div className="flex overflow-x-auto p-2 space-x-2">
            {currentProperty.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border-2 ${
                  activeImage === index
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`Miniatura ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Informações da propriedade */}
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start mb-4">
            <div>
              <div className="inline-block bg-secondary px-2 py-1 rounded text-white text-sm font-medium mb-2">
                {currentProperty.propertyType}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                {currentProperty.title}
              </h1>
              <p className="text-gray-600 mb-2">{currentProperty.location}</p>
            </div>

            <div className="text-right mt-2 md:mt-0">
              <p className="text-3xl font-bold text-primary-dark">
                R$ {currentProperty.price.toLocaleString("pt-BR")}
                {currentProperty.priceType === "monthly" ? "/mês" : ""}
              </p>
              {currentProperty.priceType === "monthly" && (
                <p className="text-gray-500 text-sm">Aluguel mensal</p>
              )}
            </div>
          </div>

          {/* Características */}
          <div className="flex flex-wrap gap-6 py-4 border-t border-b border-gray-200 mb-6">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Área</p>
                <p className="font-medium">{currentProperty.area} m²</p>
              </div>
            </div>

            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Quartos</p>
                <p className="font-medium">{currentProperty.bedrooms}</p>
              </div>
            </div>

            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Banheiros</p>
                <p className="font-medium">{currentProperty.bathrooms}</p>
              </div>
            </div>

            {currentProperty.parkingSpots > 0 && (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Estacionamento</p>
                  <p className="font-medium">
                    {currentProperty.parkingSpots} vaga
                    {currentProperty.parkingSpots > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Descrição */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Descrição</h2>
            <div className="text-gray-700 whitespace-pre-line">
              {currentProperty.description}
            </div>
          </div>

          {/* Comodidades */}
          {currentProperty.amenities &&
            currentProperty.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Comodidades</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentProperty.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Regras */}
          {currentProperty.rules && currentProperty.rules.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Regras da propriedade
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentProperty.rules.map((rule, index) => (
                  <div key={index} className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-700 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informações do proprietário */}
          {currentProperty.owner && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Proprietário</h2>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xl mr-4">
                  {currentProperty.owner.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{currentProperty.owner.name}</p>
                  <p className="text-gray-600 text-sm">
                    No Roomify desde{" "}
                    {new Date(
                      currentProperty.owner.memberSince
                    ).toLocaleDateString("pt-BR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Localização */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Localização</h2>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">
                Mapa da localização será exibido aqui
              </p>
            </div>
            <p className="mt-2 text-gray-700">{currentProperty.location}</p>
          </div>

          {/* Botão de Agendar Visita/Reservar */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleBooking}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-md transition-colors w-full md:w-auto md:min-w-[200px]"
            >
              {currentProperty.priceType === "monthly"
                ? "Agendar Visita"
                : "Reservar Agora"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PropertyDetailPage;
