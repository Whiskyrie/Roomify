// src/pages/BookingPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { bookingService, propertyService } from "../../services/api";
import { Property } from "../../types/proprerty";
import Loader from "../common//Loader";
import Button from "../common/Button";

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {} = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [property, setProperty] = useState<Property | null>(null);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await propertyService.getPropertyById(id);
          setProperty(response.data);

          // Set initial guest count
          if (response.data.maxGuests) {
            setGuestCount(1);
          }
        }
      } catch (error: any) {
        setError(
          error.response?.data?.message || "Erro ao carregar propriedade"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Calculate total price when dates change
  useEffect(() => {
    if (property && checkInDate && checkOutDate) {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      // Calculate difference in days
      const timeDiff = endDate.getTime() - startDate.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (nights > 0) {
        setTotalPrice(property.price * nights);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [checkInDate, checkOutDate, property]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate) {
      setError("Por favor, selecione as datas de check-in e check-out");
      return;
    }

    try {
      setSubmitting(true);

      if (id) {
        await bookingService.createBooking({
          propertyId: id,
          checkInDate,
          checkOutDate,
          guestCount,
          specialRequests: specialRequests || undefined,
        });

        navigate("/profile", { state: { bookingSuccess: true } });
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Erro ao criar reserva");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader size="large" />
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <Link
              to="/properties"
              className="text-sm font-medium text-red-700 hover:text-red-600"
            >
              Voltar para lista de propriedades
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-800">
          Propriedade não encontrada
        </h2>
        <p className="mt-2 text-gray-600">
          A propriedade que você está procurando não existe ou foi removida.
        </p>
        <Link
          to="/properties"
          className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
        >
          Voltar para listagem
        </Link>
      </div>
    );
  }

  // Get today's date in YYYY-MM-DD format for min dates
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to={`/properties/${id}`}
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
          Voltar para detalhes da propriedade
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Reservar {property.title}
          </h1>

          {/* Property summary */}
          <div className="flex flex-col md:flex-row gap-6 mb-8 p-4 bg-gray-50 rounded-md">
            <div className="md:w-1/3">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Sem imagem</span>
                </div>
              )}
            </div>
            <div className="md:w-2/3">
              <h2 className="text-lg font-semibold">{property.title}</h2>
              <p className="text-gray-600 mb-2">{property.location}</p>
              <div className="flex items-center text-sm text-gray-500 space-x-3">
                <span>
                  {property.bedrooms}{" "}
                  {property.bedrooms === 1 ? "quarto" : "quartos"}
                </span>
                <span>•</span>
                <span>
                  {property.bathrooms}{" "}
                  {property.bathrooms === 1 ? "banheiro" : "banheiros"}
                </span>
                <span>•</span>
                <span>
                  Máx. {property.maxGuests}{" "}
                  {property.maxGuests === 1 ? "hóspede" : "hóspedes"}
                </span>
              </div>
              <div className="mt-2 text-xl font-bold text-primary-dark">
                R$ {property.price.toFixed(2)}{" "}
                <span className="text-sm font-normal text-gray-500">
                  /noite
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Check-in date */}
              <div>
                <label
                  htmlFor="check-in"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data de check-in
                </label>
                <input
                  type="date"
                  id="check-in"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={today}
                  required
                />
              </div>

              {/* Check-out date */}
              <div>
                <label
                  htmlFor="check-out"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data de check-out
                </label>
                <input
                  type="date"
                  id="check-out"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  min={checkInDate || today}
                  required
                />
              </div>
            </div>

            {/* Guest count */}
            <div className="mb-6">
              <label
                htmlFor="guests"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Número de hóspedes
              </label>
              <select
                id="guests"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                required
              >
                {Array.from(
                  { length: property.maxGuests || 10 },
                  (_, i) => i + 1
                ).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "hóspede" : "hóspedes"}
                  </option>
                ))}
              </select>
            </div>

            {/* Special requests */}
            <div className="mb-6">
              <label
                htmlFor="special-requests"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Solicitações especiais (opcional)
              </label>
              <textarea
                id="special-requests"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                rows={4}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Ex: Horário de chegada tardio, alergias alimentares, acessibilidade, etc."
              ></textarea>
            </div>

            {/* Pricing summary */}
            <div className="mb-8 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-semibold mb-4">Resumo do preço</h3>

              {totalPrice > 0 ? (
                <>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Preço por noite</span>
                    <span className="font-medium">
                      R$ {property.price.toFixed(2)}
                    </span>
                  </div>

                  {checkInDate && checkOutDate && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">
                        {(() => {
                          const start = new Date(checkInDate);
                          const end = new Date(checkOutDate);
                          const nights = Math.ceil(
                            (end.getTime() - start.getTime()) /
                              (1000 * 3600 * 24)
                          );
                          return `${nights} ${
                            nights === 1 ? "noite" : "noites"
                          }`;
                        })()}
                      </span>
                      <span className="font-medium">
                        x {totalPrice / property.price}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-300 my-2 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary-dark">
                      R$ {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-gray-600 text-center">
                  Selecione as datas para ver o preço total
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={submitting}
                disabled={submitting || !checkInDate || !checkOutDate}
                fullWidth
              >
                Reservar agora
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
