// src/pages/MyPropertiesPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProperties,
  deleteProperty,
} from "../store/slices/propertySlice";
import { RootState, AppDispatch } from "../store/store";
import Loader from "../common/Loader";
import Button from "../common/Button";
import { Property } from "../../types/proprerty";
import { PropertyStatus } from "../../types/proprerty";

const MyPropertiesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, loading, error } = useSelector((state: RootState) => ({
    properties: state.property.properties,
    loading: state.property.loading,
    error: state.property.error,
  }));

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProperties());
  }, [dispatch]);

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      setDeleting(true);
      await dispatch(deleteProperty(propertyToDelete.id));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting property:", error);
    } finally {
      setDeleting(false);
      setPropertyToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setPropertyToDelete(null);
  };

  const renderPropertyStatus = (status: string) => {
    switch (status) {
      case PropertyStatus.ACTIVE:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Ativo
          </span>
        );
      case PropertyStatus.INACTIVE:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            Inativo
          </span>
        );
      case PropertyStatus.PENDING:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            Pendente
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Minhas Propriedades
        </h1>
        <Link
          to="/properties/new"
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Adicionar Propriedade
        </Link>
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

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader size="large" />
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Você ainda não tem propriedades
          </h2>
          <p className="text-gray-600 mb-6">
            Comece a adicionar suas propriedades para alugá-las na plataforma.
          </p>
          <Link
            to="/properties/new"
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Adicionar Propriedade
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Propriedade
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tipo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Preço
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {property.images && property.images.length > 0 ? (
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={property.images[0]}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                              <svg
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {property.propertyType
                          .charAt(0)
                          .toUpperCase()
                          .concat(property.propertyType.slice(1))}
                      </div>
                      <div className="text-xs text-gray-500">
                        {property.bedrooms} quarto(s) • {property.bathrooms}{" "}
                        banheiro(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        R$ {property.price.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">por noite</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderPropertyStatus(
                        property.status || PropertyStatus.ACTIVE
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/properties/${property.id}`}
                          className="text-primary hover:text-primary-dark"
                        >
                          Ver
                        </Link>
                        <Link
                          to={`/properties/${property.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(property)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar exclusão
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Tem certeza que deseja excluir a propriedade "
              {propertyToDelete?.title}"? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={cancelDelete}
                variant="outline"
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmDelete}
                variant="danger"
                isLoading={deleting}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPropertiesPage;
