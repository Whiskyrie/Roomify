import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-white">Room</span>
              <span className="text-2xl font-bold text-primary">ify</span>
              <div className="w-2 h-2 bg-secondary rounded-full ml-1"></div>
            </div>
            <p className="text-gray-300 text-sm">
              Encontre a acomodação perfeita para sua próxima viagem.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/properties"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Propriedades
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Entrar
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Cadastrar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Tipos de Acomodação</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/properties?type=apartment"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Apartamentos
                </Link>
              </li>
              <li>
                <Link
                  to="/properties?type=house"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Casas
                </Link>
              </li>
              <li>
                <Link
                  to="/properties?type=chalet"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Chalés
                </Link>
              </li>
              <li>
                <Link
                  to="/properties?type=cabin"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Cabanas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm">
                <span className="block">Email:</span>
                <a
                  href="mailto:contato@roomify.com"
                  className="hover:text-white"
                >
                  contato@roomify.com
                </a>
              </li>
              <li className="text-gray-300 text-sm">
                <span className="block">Telefone:</span>
                <a href="tel:+551199999999" className="hover:text-white">
                  +55 (11) 9999-9999
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>© {currentYear} Roomify. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
