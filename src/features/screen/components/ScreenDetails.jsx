import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { deleteScreen, downloadScreenFile } from '../../../api/services/ScreenService';
import { FiArrowLeft, FiTrash2, FiDownload } from 'react-icons/fi';
import { Button, Loading, showToast } from '../../../components';

const ScreenDetails = () => {
  const { t } = useTranslation();
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
        showToast(t('screens.messages.errorLoadingScreenInfo'), "error");
      }
    };

    fetchScreenDetails();
  }, [navigate, location.state, t]);

  const handleDelete = async () => {
    if (window.confirm(t('screens.details.deleteConfirm'))) {
      try {
        await deleteScreen(id);
        showToast(t('screens.messages.screenDeleted'), 'success');
        navigate('/screen');
      } catch (err) {
        showToast(err.message || t('screens.messages.errorDeletingScreen'), 'error');
        console.error('Error deleting screen:', err);
      }
    }
  };

  const handleDownloadFile = async (fileType) => {
    try {
      await downloadScreenFile(id, fileType);
      showToast(t('screens.messages.fileDownloadedSuccessfully'), 'success');
    } catch (err) {
      showToast(err.message || t('screens.messages.errorDownloadingFile', { fileType }), 'error');
      console.error(`Error downloading ${fileType} file:`, err);
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
      <p className="text-gray-600">{t('screens.details.screenNotFound')}</p>
    </div>
  );

  const LabelContainer = ({ children }) => (
    <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary text-sm rounded-full">
      {children}
    </span>
  );

  const getScreenTypeLabel = (type) => {
    switch (type) {
      case 'IN_DOOR': return t('screens.details.inDoor');
      case 'OUT_DOOR': return t('screens.details.outDoor');
      default: return "N/A";
    }
  }

  const getScreenSolutionLabel = (type) => {
    switch (type) {
      case 'CABINET_SOLUTION': return t('screens.details.cabinet');
      case 'MODULE_SOLUTION': return t('screens.details.module');
      default: return "N/A";
    }
  }

  return (
    <div className="py-6 px-2 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          variant='text'
          icon={<FiArrowLeft />}
          size='sm'
        >
          {t('screens.details.backToScreens')}
        </Button>
        <Button
          onClick={handleDelete}
          variant='danger'
          icon={<FiTrash2 />}
        >
          {t('screens.details.delete')}
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
                <LabelContainer>{t('screens.details.created')}: {new Date(screen.createdAt).toLocaleDateString()}</LabelContainer>
                <LabelContainer>{t('screens.details.id')}: {screen.id}</LabelContainer>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 text-right">
              <p className="text-lg font-semibold">
                {t('screens.details.resolution')}:
              </p>
              <p className="text-md font-semibold mb-2">
              {screen.resolution || 'N/A'}
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
                  {t('screens.details.viewLocation')}
                </a>
              ) : (
                <p className="font-medium">{screen.location || 'N/A'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Description Section */}
          {screen.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                {t('screens.details.description')}
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{screen.description}</p>
              </div>
            </div>
          )}

          {/* Screen Dimensions Section */}
          {(screen.pixelPitchWidth || screen.pixelPitchHeight || screen.screenWidth || screen.screenHeight) && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                {t('screens.details.screenDimensions')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {screen.pixelPitchWidth !== null && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">{t('screens.details.pixelPitchWidth')}</h3>
                    <p className="font-medium">{screen.pixelPitchWidth}</p>
                  </div>
                )}
                {screen.pixelPitchHeight !== null && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">{t('screens.details.pixelPitchHeight')}</h3>
                    <p className="font-medium">{screen.pixelPitchHeight}</p>
                  </div>
                )}
                {screen.screenWidth !== null && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">{t('screens.details.screenWidth')}</h3>
                    <p className="font-medium">{screen.screenWidth}</p>
                  </div>
                )}
                {screen.screenHeight !== null && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">{t('screens.details.screenHeight')}</h3>
                    <p className="font-medium">{screen.screenHeight}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              {t('screens.details.basicInformation')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('screens.details.powerSupply')}</h3>
                <p className="font-medium">{screen.powerSupply || 'N/A'}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{t('screens.details.main')}: {screen.powerSupplyQuantity || 0}</span>
                  <span>{t('screens.details.spare')}: {screen.sparePowerSupplyQuantity || 0}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('screens.details.receivingCards')}</h3>
                <p className="font-medium">{screen.receivingCard || 'N/A'}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{t('screens.details.main')}: {screen.receivingCardQuantity || 0}</span>
                  <span>{t('screens.details.spare')}: {screen.spareReceivingCardQuantity || 0}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('screens.details.fans')}</h3>
                <p className="font-medium">{screen.fan || 'N/A'}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {t('screens.details.quantity')}: {screen.fanQuantity || 0}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('screens.details.mainPowerCable')}</h3>
                <p className="font-medium">{screen.mainPowerCable || 'N/A'}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{t('screens.details.main')}: {screen.mainPowerCableQuantity || 0}</span>
                  <span>{t('screens.details.spare')}: {screen.spareMainPowerCableQuantity || 0}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('screens.details.loopPowerCable')}</h3>
                <p className="font-medium">{screen.loopPowerCable || 'N/A'}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{t('screens.details.main')}: {screen.loopPowerCableQuantity || 0}</span>
                  <span>{t('screens.details.spare')}: {screen.spareLoopPowerCableQuantity || 0}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('screens.details.mainDataCable')}</h3>
                <p className="font-medium">{screen.mainDataCable || 'N/A'}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{t('screens.details.main')}: {screen.mainDataCableQuantity || 0}</span>
                  <span>{t('screens.details.spare')}: {screen.spareMainDataCableQuantity || 0}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('screens.details.loopDataCable')}</h3>
                <p className="font-medium">{screen.loopDataCable || 'N/A'}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{t('screens.details.main')}: {screen.loopDataCableQuantity || 0}</span>
                  <span>{t('screens.details.spare')}: {screen.spareLoopDataCableQuantity || 0}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('screens.details.hub')}</h3>
                <p className="font-medium">{screen.hub || 'N/A'}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{t('screens.details.main')}: {screen.hubQuantity || 0}</span>
                  <span>{t('screens.details.spare')}: {screen.spareHubQuantity || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modules or Cabinets Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              {screen.solutionType === 'MODULE_SOLUTION' ? t('screens.details.modules') : t('screens.details.cabinets')}
            </h2>

            {screen.solutionType === 'MODULE_SOLUTION' ? (
              <div className="space-y-4">
                {screen.moduleList?.length > 0 ? (
                  screen.moduleList.map((module, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-primary">{t('screens.details.batch')}: {module.batchNumber || 'N/A'}</h3>
                        <div className="text-sm text-gray-500">
                          {module.pixelWidth && module.pixelHeight ? `${module.pixelWidth}px × ${module.pixelHeight}px` : 'N/A'}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">{t('screens.details.batchNumber')}</p>
                          <p className="font-medium">{module.batchNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t('screens.details.quantity')}</p>
                          <p className="font-medium">{module.quantity ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t('screens.details.moduleByHeight')}</p>
                          <p className="font-medium">{module.moduleByHeight ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t('screens.details.moduleByWidth')}</p>
                          <p className="font-medium">{module.moduleByWidth ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t('screens.details.pixelHeight')}</p>
                          <p className="font-medium">{module.pixelHeight ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t('screens.details.pixelWidth')}</p>
                          <p className="font-medium">{module.pixelWidth ?? 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-dark-light">{t('screens.details.noModulesFound')}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {screen.cabinList?.length > 0 ? (
                  screen.cabinList.map((cabin, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-primary">{t('screens.details.cabinet')}: {cabin.cabinName}</h3>
                        <div className="text-sm text-gray-500">
                          {cabin.width}px × {cabin.height}px
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-500">{t('screens.details.cabinetName')}</p>
                          <p className="font-medium">{cabin.cabinName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t('screens.details.heightQuantity')}</p>
                          <p className="font-medium">{cabin.heightQuantity ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t('screens.details.widthQuantity')}</p>
                          <p className="font-medium">{cabin.widthQuantity ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t('screens.details.height')}</p>
                          <p className="font-medium">{cabin.height ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t('screens.details.width')}</p>
                          <p className="font-medium">{cabin.width ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t('screens.details.isHeight')}</p>
                          <p className="font-medium">{cabin.isHeight ? t('common.yes') : t('common.no')}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t('screens.details.isWidth')}</p>
                          <p className="font-medium">{cabin.isWidth ? t('common.yes') : t('common.no')}</p>
                        </div>
                      </div>
                      {cabin.module && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-md font-medium text-primary mb-2">{t('screens.details.moduleDetails')}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">{t('screens.details.batchNumber')}</p>
                              <p className="font-medium">{cabin.module.batchNumber}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">{t('screens.details.heightQuantity')}</p>
                              <p className="font-medium">{cabin.module.heightQuantity ?? 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">{t('screens.details.widthQuantity')}</p>
                              <p className="font-medium">{cabin.module.widthQuantity ?? 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">{t('screens.details.height')}</p>
                              <p className="font-medium">{cabin.module.height ?? 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">{t('screens.details.width')}</p>
                              <p className="font-medium">{cabin.module.width ?? 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">{t('screens.details.noCabinetsFound')}</p>
                )}
              </div>
            )}
          </div>

          {/* Additional Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              {t('screens.details.additionalInformation')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('screens.details.media')}</h3>
                <p className="font-medium">{screen.media || 'N/A'}</p>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{t('screens.details.main')}: {screen.mediaQuantity || 0}</span>
                  <span>{t('screens.details.spare')}: {screen.spareMediaQuantity || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Files Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              {t('screens.details.files')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleDownloadFile('connection')}
                variant="outline"
                icon={<FiDownload />}
                className="w-full"
              >
                {t('screens.details.downloadConnectionFile')}
              </Button>
              <Button
                onClick={() => handleDownloadFile('config')}
                variant="outline"
                icon={<FiDownload />}
                className="w-full"
              >
                {t('screens.details.downloadConfigFile')}
              </Button>
              <Button
                onClick={() => handleDownloadFile('version')}
                variant="outline"
                icon={<FiDownload />}
                className="w-full"
              >
                {t('screens.details.downloadVersionFile')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenDetails;