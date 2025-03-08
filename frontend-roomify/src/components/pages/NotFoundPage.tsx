// src/pages/NotFoundPage.tsx
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-extrabold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Página não encontrada
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-md transition-colors"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
};

export default NotFoundPage;
