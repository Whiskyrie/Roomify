import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [searchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    if (searchQuery) queryParams.append("q", searchQuery);
    if (location) queryParams.append("location", location);
    if (guests > 1) queryParams.append("guests", guests.toString());

    navigate(`/properties?${queryParams.toString()}`);
  };

  // Destinos em destaque (mockados)
  const featuredDestinations = [
    {
      id: 1,
      name: "Rio de Janeiro",
      image: "https://via.placeholder.com/300x200?text=Rio+de+Janeiro",
      properties: 124,
    },
    {
      id: 2,
      name: "São Paulo",
      image: "https://via.placeholder.com/300x200?text=São+Paulo",
      properties: 230,
    },
    {
      id: 3,
      name: "Florianópolis",
      image: "https://via.placeholder.com/300x200?text=Florianópolis",
      properties: 87,
    },
    {
      id: 4,
      name: "Salvador",
      image: "https://via.placeholder.com/300x200?text=Salvador",
      properties: 95,
    },
  ];

  // Propriedades em destaque (mockadas)
  const featuredProperties = [
    {
      id: 1,
      title: "Apartamento com vista para o mar",
      image: "https://via.placeholder.com/300x200?text=Apartamento",
      location: "Copacabana, Rio de Janeiro",
      price: 250,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Casa em condomínio fechado",
      image: "https://via.placeholder.com/300x200?text=Casa",
      location: "Morumbi, São Paulo",
      price: 320,
      rating: 4.6,
    },
    {
      id: 3,
      title: "Chalé na montanha",
      image: "https://via.placeholder.com/300x200?text=Chalé",
      location: "Campos do Jordão, São Paulo",
      price: 280,
      rating: 4.9,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-primary-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-800 sm:text-5xl md:text-6xl">
              Encontre o lugar perfeito para se hospedar
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg text-gray-600 sm:text-xl md:mt-5 md:max-w-3xl">
              Descubra acomodações únicas para se sentir em casa, onde quer que
              você vá.
            </p>

            {/* Search form */}
            <div className="mt-10 max-w-4xl mx-auto">
              <form
                onSubmit={handleSearch}
                className="bg-white p-4 shadow-md rounded-lg grid grid-cols-1 gap-4 md:grid-cols-4"
              >
                <div className="md:col-span-2">
                  <label
                    htmlFor="location"
                    className="block text-left text-sm font-medium text-gray-700"
                  >
                    Para onde?
                  </label>
                  <input
                    type="text"
                    id="location"
                    placeholder="Digite uma cidade ou destino"
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="guests"
                    className="block text-left text-sm font-medium text-gray-700"
                  >
                    Hóspedes
                  </label>
                  <select
                    id="guests"
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "hóspede" : "hóspedes"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-left text-sm font-medium text-gray-700">
                    &nbsp;
                  </label>
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  >
                    Buscar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Destinos em destaque */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8">
            Destinos populares
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination) => (
              <Link
                key={destination.id}
                to={`/properties?location=${encodeURIComponent(
                  destination.name
                )}`}
                className="group"
              >
                <div className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 transform group-hover:scale-105">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                      <p className="text-sm">
                        {destination.properties} propriedades
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Propriedades em destaque */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8">
            Acomodações em destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-lg px-2 py-1 text-sm font-medium text-gray-800">
                    ★ {property.rating}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{property.location}</p>
                  <p className="text-primary font-bold">
                    R$ {property.price}{" "}
                    <span className="text-gray-500 font-normal">/ noite</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/properties"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Ver todas as propriedades
            </Link>
          </div>
        </div>
      </section>

      {/* Por que escolher o Roomify */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-12">
            Por que escolher o Roomify?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary-light flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-800">
                Ampla seleção
              </h3>
              <p className="mt-2 text-gray-600">
                Milhares de propriedades para você escolher em todo o Brasil.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary-light flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-800">
                Reservas seguras
              </h3>
              <p className="mt-2 text-gray-600">
                Pagamentos protegidos e verificação de anfitriões para sua
                segurança.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary-light flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-800">
                Suporte 24/7
              </h3>
              <p className="mt-2 text-gray-600">
                Equipe de atendimento disponível a qualquer hora para ajudar
                você.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-12">
            O que nossos clientes dizem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl">
                  M
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Maria Silva</h3>
                  <div className="flex text-yellow-400">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Minha experiência com o Roomify foi incrível! Encontrei uma
                casa de praia perfeita para as férias com a família. O processo
                de reserva foi simples e o anfitrião foi muito atencioso."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl">
                  J
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">João Santos</h3>
                  <div className="flex text-yellow-400">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "O apartamento que alugamos em São Paulo superou todas as
                expectativas. Bem localizado, limpo e com todas as comodidades
                que precisávamos. Certamente voltarei a usar o Roomify."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl">
                  A
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Ana Oliveira</h3>
                  <div className="flex text-yellow-400">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Como anfitriã, estou muito satisfeita com a plataforma. É fácil
                gerenciar minhas propriedades e a comunicação com os hóspedes é
                muito eficiente. Recomendo a todos!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Pronto para encontrar sua próxima acomodação?
          </h2>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Junte-se a milhares de viajantes satisfeitos que encontraram a
            hospedagem perfeita através do Roomify.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/properties"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary bg-white hover:bg-gray-100"
            >
              Explorar propriedades
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md shadow-sm text-white bg-transparent hover:bg-white/10"
            >
              Criar uma conta
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-100 rounded-lg p-8">
            <div className="max-w-lg mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Inscreva-se na nossa newsletter
              </h2>
              <p className="text-gray-600 mb-6">
                Receba as melhores ofertas e novidades sobre acomodações
                diretamente no seu email.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Seu email"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                >
                  Inscrever-se
                </button>
              </form>
              <p className="text-sm text-gray-500 mt-3">
                Nós respeitamos sua privacidade. Você pode cancelar a inscrição
                a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
