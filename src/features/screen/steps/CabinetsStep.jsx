import React from 'react';
import { Button, Input } from '../../../components';
import { useTranslation } from 'react-i18next';

const CabinetsStep = ({
  form,
  errors,
  onChange,
  onBack,
  onNext,
  addCabinet,
  removeCabinet,
  loading
}) => {
  const { t } = useTranslation();
  const checkboxStyle = "w-4 h-4 sm:w-5 sm:h-5 text-primary bg-gray-100 border-gray-300 rounded-sm focus:ring-primary-focus focus:border-primary focus:ring-1 accent-primary checked:border-primary";

  const handleCheckboxChange = (e, index) => {
    const { name, checked } = e.target;
    const fieldName = name.split('_')[2];

    const updatedCabinets = form.cabinets.map((cabinet, i) =>
      i === index ? { ...cabinet, [fieldName]: checked } : cabinet
    );

    onChange({
      target: {
        name: 'cabinets',
        value: updatedCabinets
      }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {t('screens.screenForm.cabinetInformation')}
        </h2>
        <Button
          type="button"
          onClick={addCabinet}
          size="sm"
          className="w-full sm:w-auto min-w-[120px]"
        >
          {t('screens.actions.addCabinet')}
        </Button>
      </div>

      <hr className="border-gray-200" />

      {/* Cabinet List */}
      <div className="space-y-4 sm:space-y-6">
        {form.cabinets.map((cabinet, index) => (
          <div key={index} className="relative bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Remove Button */}
            {form.cabinets.length > 1 && (
              <button
                type="button"
                onClick={() => removeCabinet(index)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors text-lg sm:text-xl font-bold"
                aria-label="Remove cabinet"
              >
                ×
              </button>
            )}

            {/* Cabinet Title */}
            <div className="mb-3 sm:mb-4 pr-8 sm:pr-10">
              <h3 className="text-base sm:text-lg font-medium text-gray-800">
                {t('screens.screenForm.cabinet')} {index + 1}
              </h3>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Cabinet Name */}
              <Input
                label={t('common.name')}
                name={`cabinet_${index}_cabinetName`}
                value={cabinet.cabinetName}
                onChange={onChange}
                error={errors[`cabinet_${index}_cabinetName`]}
                required
              />

              {/* Quantity Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label={t('screens.screenForm.heightQuantity')}
                  name={`cabinet_${index}_heightQuantity`}
                  type="number"
                  value={cabinet.heightQuantity}
                  onChange={onChange}
                  error={errors[`cabinet_${index}_heightQuantity`]}
                  required
                />
                <Input
                  label={t('screens.screenForm.widthQuantity')}
                  name={`cabinet_${index}_widthQuantity`}
                  type="number"
                  value={cabinet.widthQuantity}
                  onChange={onChange}
                  error={errors[`cabinet_${index}_widthQuantity`]}
                  required
                />
              </div>

              {/* Dimension Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  // label="Height (px)"
                  label={t('screens.screenForm.heightPx')}
                  name={`cabinet_${index}_height`}
                  type="number"
                  value={cabinet.height}
                  onChange={onChange}
                  error={errors[`cabinet_${index}_height`]}
                  required
                />
                <Input
                  // label="Width (px)"
                  label={t('screens.screenForm.widthPx')}
                  name={`cabinet_${index}_width`}
                  type="number"
                  value={cabinet.width}
                  onChange={onChange}
                  error={errors[`cabinet_${index}_width`]}
                  required
                />
              </div>

              {/* Checkbox Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                  <input
                    name={`cabinet_${index}_isWidth`}
                    type="checkbox"
                    checked={cabinet.isWidth || false}
                    onChange={(e) => handleCheckboxChange(e, index)}
                    className={checkboxStyle}
                  />
                  <span className="text-sm sm:text-base font-medium text-gray-700">
                    {t('screens.screenForm.isWidth')}
                  </span>
                </label>
                <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                  <input
                    name={`cabinet_${index}_isHeight`}
                    type="checkbox"
                    checked={cabinet.isHeight || false}
                    onChange={(e) => handleCheckboxChange(e, index)}
                    className={checkboxStyle}
                  />
                  <span className="text-sm sm:text-base font-medium text-gray-700">
                    {t('screens.screenForm.isHeight')}
                  </span>
                </label>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {form.cabinets.length === 0 && (
          <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-sm sm:text-base mb-4">
              {t('screens.screenForm.noCabinetsAdded')}
            </p>
            <Button
              type="button"
              onClick={addCabinet}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {t('screens.screenForm.addFirstCabinet')}
            </Button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="w-full sm:w-auto min-w-[100px] order-2 sm:order-1"
        >

          {t('screens.actions.back')}
        </Button>
        <Button
          type={form.solutionTypeInScreen === "MODULE_SOLUTION" ? "submit" : "button"}
          onClick={onNext}
          isLoading={loading}
          className="w-full sm:w-auto min-w-[140px] order-1 sm:order-2"
          loadingText={t('common.loading')}
        >
          {
            form.solutionTypeInScreen === "MODULE_SOLUTION" ?
              t('screens.actions.createScreen') :
              t('screens.actions.nextModules')
          }
        </Button>
      </div>
    </div>
  );
};

export default CabinetsStep;