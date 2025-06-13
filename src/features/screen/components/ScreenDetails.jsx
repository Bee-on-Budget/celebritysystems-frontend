import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScreenById } from '../../../api/ScreenService';
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';

const ScreenDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [screen, setScreen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScreenDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getScreenById(id);
        setScreen(data);
      } catch (err) {
        setError('Failed to load screen details. Please try again later.');
        console.error('Error fetching screen:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenDetails();
  }, [id]);

  const handleEdit = () => {
    navigate(`/screens/${id}/edit`);
  };

  const handleDelete = async () => {
    // Implement delete functionality
    console.log('Delete screen', id);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
      <p>{error}</p>
    </div>
  );

  if (!screen) return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <p className="text-gray-600">Screen not found</p>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary hover:text-primary-dark"
        >
          <FiArrowLeft className="mr-2" />
          Back to Screens
        </button>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-primary bg-opacity-10 text-primary rounded hover:bg-opacity-20"
          >
            <FiEdit className="mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            <FiTrash2 className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-primary bg-opacity-10 p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary">{screen.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary text-sm rounded-full">
                  {screen.screenType}
                </span>
                <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary text-sm rounded-full">
                  {screen.solutionType}
                </span>
                <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary text-sm rounded-full">
                  Created: {new Date(screen.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 text-right">
              <p className="text-lg font-semibold">
                Resolution: {screen.resolution ? `${screen.resolution.toLocaleString()}px` : 'N/A'}
              </p>
              <p className="text-gray-600">{screen.location}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Power Supply</h3>
                <p className="font-medium">{screen.powerSupply || 'N/A'}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Main: {screen.powerSupplyQuantity || 0}</span>
                  <span>Spare: {screen.sparePowerSupplyQuantity || 0}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Receiving Cards</h3>
                <p className="font-medium">{screen.receivingCard || 'N/A'}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Main: {screen.receivingCardQuantity || 0}</span>
                  <span>Spare: {screen.spareReceivingCardQuantity || 0}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Fans</h3>
                <p className="font-medium">{screen.fan || 'N/A'}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Quantity: {screen.fanQuantity || 0}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Cables</h3>
                <p className="font-medium">{screen.cable || 'N/A'}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Main: {screen.cableQuantity || 0}</span>
                  <span>Spare: {screen.spareCableQuantity || 0}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Power Cables</h3>
                <p className="font-medium">{screen.powerCable || 'N/A'}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Main: {screen.powerCableQuantity || 0}</span>
                  <span>Spare: {screen.sparePowerCableQuantity || 0}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Data Cables</h3>
                <p className="font-medium">{screen.dataCable || 'N/A'}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Main: {screen.dataCableQuantity || 0}</span>
                  <span>Spare: {screen.spareDataCableQuantity || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modules or Cabinets Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              {screen.solutionType === 'MODULE_SOLUTION' ? 'Modules' : 'Cabinets'}
            </h2>

            {screen.solutionType === 'MODULE_SOLUTION' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {screen.moduleList?.length > 0 ? (
                  screen.moduleList.map((module) => (
                    <div key={module.id} className="bg-primary bg-opacity-5 p-4 rounded-lg border border-primary border-opacity-20">
                      <h3 className="text-lg font-semibold text-primary mb-2">{module.batchNumber}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Quantity</p>
                          <p className="font-medium">{module.quantity || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Dimensions</p>
                          <p className="font-medium">{module.width}cm × {module.height}cm</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Height Qty</p>
                          <p className="font-medium">{module.heightQuantity || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Width Qty</p>
                          <p className="font-medium">{module.widthQuantity || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No modules found</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {screen.cabinList?.length > 0 ? (
                  screen.cabinList.map((cabin) => (
                    <div key={cabin.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-primary">{cabin.cabinName}</h3>
                        <div className="text-sm text-gray-500">
                          {cabin.width}cm × {cabin.height}cm
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">Quantity</p>
                          <p className="font-medium">{cabin.quantity || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Height Qty</p>
                          <p className="font-medium">{cabin.heightQuantity || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Width Qty</p>
                          <p className="font-medium">{cabin.widthQuantity || 'N/A'}</p>
                        </div>
                      </div>

                      {cabin.module && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-md font-medium text-primary mb-2">Module Details</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Batch Number</p>
                              <p className="font-medium">{cabin.module.batchNumber}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Quantity</p>
                              <p className="font-medium">{cabin.module.quantity || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Dimensions</p>
                              <p className="font-medium">{cabin.module.width}cm × {cabin.module.height}cm</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No cabinets found</p>
                )}
              </div>
            )}
          </div>

          {/* Additional Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Media</h3>
                <p className="font-medium">{screen.media || 'N/A'}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Main: {screen.mediaQuantity || 0}</span>
                  <span>Spare: {screen.spareMediaQuantity || 0}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                <p className="text-gray-600">
                  {screen.notes || 'No additional notes available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenDetails;