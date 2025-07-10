import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { deleteScreen } from '../../../api/services/ScreenService';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { Button, Loading, showToast } from '../../../components';

const ScreenDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [screen, setScreen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("Loading!!!!");
    const fetchScreenDetails = async () => {
      setLoading(true);
      setError('');

      // Check if screen data was passed from ScreenPage
      if (location.state?.screen) {
        setScreen(location.state.screen);
        setLoading(false);
        return;
      } else {
        navigate(-1);
        showToast("Faild to load screen info, please try again!", "error");
      }
    };

    fetchScreenDetails();
  }, [navigate, location.state]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this screen? This action cannot be undone.')) {
      try {
        await deleteScreen(id);
        showToast('Screen deleted successfully.', 'success');
        navigate('/screen');
      } catch (err) {
        showToast(err.message || 'Failed to delete screen. Please try again.', 'error');
        console.error('Error deleting screen:', err);
      }
    }
  };

  if (loading) return <Loading />;

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

  const LabelContainer = ({ children }) => (
    <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary text-sm rounded-full">
      {children}
    </span>
  );

  const getScreenTypeLabel = (type) => {
    switch (type) {
      case 'IN_DOOR': return "In Door";
      case 'OUT_DOOR': return "Out Door";
      default: return "N/A";
    }
  }

  const getScreenSolutionLabel = (type) => {
    switch (type) {
      case 'CABINET_SOLUTION': return "Cabinet";
      case 'MODULE_SOLUTION': return "Module";
      default: return "N/A";
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          variant='text'
          icon={<FiArrowLeft />}
          size='sm'
        >
          Back to Screens
        </Button>
        <Button
          onClick={handleDelete}
          variant='danger'
          icon={<FiTrash2 />}
        >
          Delete
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-primary bg-opacity-10 p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary">{screen.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <LabelContainer>{getScreenTypeLabel(screen.screenType)}</LabelContainer>
                <LabelContainer>{getScreenSolutionLabel(screen.solutionType)}</LabelContainer>
                <LabelContainer>Created: {new Date(screen.createdAt).toLocaleDateString()}</LabelContainer>
                <LabelContainer>ID: {screen.id}</LabelContainer>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 text-right">
              <p className="text-lg font-semibold">
                Resolution:
              </p>
              <p className="text-md font-semibold mb-2">
              {screen.resolution ? `${screen.resolution.toLocaleString()}px` : 'N/A'}
              </p>
              {screen.location?.startsWith("http") ? (
                <a
                  href={screen.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(screen.location, "_blank", "noopener,noreferrer");
                  }}
                  className="text-primary underline hover:text-primary-hover font-medium"
                >
                  View Location
                </a>
              ) : (
                <p className="font-medium">{screen.location || 'N/A'}</p>
              )}
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
              <div className="space-y-4">
                {screen.moduleList?.length > 0 ? (
                  screen.moduleList.map((module, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-primary">Batch: {module.batchNumber}</h3>
                        <div className="text-sm text-gray-500">
                          {module.width}px × {module.height}px
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">Batch Number</p>
                          <p className="font-medium">{module.batchNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Quantity</p>
                          <p className="font-medium">{module.quantity ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Height Quantity</p>
                          <p className="font-medium">{module.heightQuantity ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Width Quantity</p>
                          <p className="font-medium">{module.widthQuantity ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Height</p>
                          <p className="font-medium">{module.height ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Width</p>
                          <p className="font-medium">{module.width ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">isHeight</p>
                          <p className="font-medium">{module.isHeight ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">isWidth</p>
                          <p className="font-medium">{module.isWidth ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-dark-light">No modules found</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {screen.cabinList?.length > 0 ? (
                  screen.cabinList.map((cabin, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-primary">Cabinet: {cabin.cabinName}</h3>
                        <div className="text-sm text-gray-500">
                          {cabin.width}px × {cabin.height}px
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">Cabinet Name</p>
                          <p className="font-medium">{cabin.cabinName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Quantity</p>
                          <p className="font-medium">{cabin.quantity ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Height Quantity</p>
                          <p className="font-medium">{cabin.heightQuantity ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Width Quantity</p>
                          <p className="font-medium">{cabin.widthQuantity ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Height</p>
                          <p className="font-medium">{cabin.height ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Width</p>
                          <p className="font-medium">{cabin.width ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">isHeight</p>
                          <p className="font-medium">{cabin.isHeight ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">isWidth</p>
                          <p className="font-medium">{cabin.isWidth ? 'Yes' : 'No'}</p>
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
                              <p className="font-medium">{cabin.module.quantity ?? 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Height Quantity</p>
                              <p className="font-medium">{cabin.module.heightQuantity ?? 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Width Quantity</p>
                              <p className="font-medium">{cabin.module.widthQuantity ?? 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Height</p>
                              <p className="font-medium">{cabin.module.height ?? 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Width</p>
                              <p className="font-medium">{cabin.module.width ?? 'N/A'}</p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenDetails;