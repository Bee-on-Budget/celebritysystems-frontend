import React from 'react';
import { Input, Button } from '../../../components';
import { useTranslation } from 'react-i18next';

const ModulesStep = ({ form, errors, onChange, onBack, addModule, removeModule, loading }) => {
  const { t } = useTranslation();
  const checkboxStyle = "w-4 h-4 sm:w-5 sm:h-5 text-primary bg-gray-100 border-gray-300 rounded-sm focus:ring-primary-focus focus:border-primary focus:ring-1 accent-primary checked:border-primary";

  if (form.solutionTypeInScreen === "MODULE_SOLUTION") {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {t('screens.screenForm.moduleInformation')}
          </h2>
          <Button 
            type="button" 
            onClick={addModule} 
            size="sm"
            className="w-full sm:w-auto min-w-[120px]"
          >
            {t('screens.actions.addModule')}
          </Button>
        </div>
        
        <hr className="border-gray-200" />

        {/* Modules List */}
        <div className="space-y-4 sm:space-y-6">
          {form.modulesDto.map((module, index) => (
            <div key={index} className="relative bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow">
              {/* Remove Button */}
              {form.modulesDto.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeModule(index)}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors text-lg sm:text-xl font-bold"
                  aria-label="Remove module"
                >
                  ×
                </button>
              )}

              {/* Module Title */}
              <div className="mb-3 sm:mb-4 pr-8 sm:pr-10">
                <h3 className="text-base sm:text-lg font-medium text-gray-800">
                  {t('screens.screenForm.module')} {index + 1}
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Quantity Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Input
                    label={t('screens.screenForm.widthQuantity')}
                    name={`moduleDto_${index}_widthQuantity`}
                    type="number"
                    value={module.widthQuantity}
                    onChange={onChange}
                    error={errors[`moduleDto_${index}_widthQuantity`]}
                    required
                  />
                  <Input
                    label={t('screens.screenForm.heightQuantity')}
                    name={`moduleDto_${index}_heightQuantity`}
                    type="number"
                    value={module.heightQuantity}
                    onChange={onChange}
                    error={errors[`moduleDto_${index}_heightQuantity`]}
                    required
                  />
                </div>

                {/* Dimension Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Input
                    label={t('screens.screenForm.heightPx')}
                    name={`moduleDto_${index}_height`}
                    type="number"
                    value={module.height}
                    onChange={onChange}
                    error={errors[`moduleDto_${index}_height`]}
                    required
                  />
                  <Input
                    label={t('screens.screenForm.widthPx')}
                    name={`moduleDto_${index}_width`}
                    type="number"
                    value={module.width}
                    onChange={onChange}
                    error={errors[`moduleDto_${index}_width`]}
                    required
                  />
                </div>

                {/* Checkbox Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                  <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                    <input
                      name={`moduleDto_${index}_isWidth`}
                      type="checkbox"
                      checked={!!module.isWidth}
                      onChange={onChange}
                      className={checkboxStyle}
                    />
                    <span className="text-sm sm:text-base font-medium text-gray-700">
                      {t('screens.screenForm.isWidth')}
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                    <input
                      name={`moduleDto_${index}_isHeight`}
                      type="checkbox"
                      checked={!!module.isHeight}
                      onChange={onChange}
                      className={checkboxStyle}
                    />
                    <span className="text-sm sm:text-base font-medium text-gray-700">
                      {t('screens.screenForm.isHeight')}
                    </span>
                  </label>
                </div>

                {/* Batch Number */}
                <Input
                  label={t('screens.screenForm.batchNumber')}
                  name={`moduleDto_${index}_moduleBatchNumber`}
                  value={module.moduleBatchNumber}
                  onChange={onChange}
                  error={errors[`moduleDto_${index}_moduleBatchNumber`]}
                  required
                />
              </div>
            </div>
          ))}

          {/* Empty State */}
          {form.modulesDto.length === 0 && (
            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-sm sm:text-base mb-4">
                {t('screens.screenForm.noModulesAdded')}
              </p>
              <Button 
                type="button" 
                onClick={addModule} 
                variant="outline"
                className="w-full sm:w-auto"
              >
                {t('screens.screenForm.addFirstModule')}
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
            type="submit" 
            isLoading={loading}
            className="w-full sm:w-auto min-w-[140px] order-1 sm:order-2"
          >
            {t('screens.actions.createScreen')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {t('screens.screenForm.moduleInformation')}
        </h2>
      </div>
      
      <hr className="border-gray-200" />

      {/* Cabinet Modules List */}
      <div className="space-y-4 sm:space-y-6">
        {form.cabinets.map((cabinet, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Cabinet Title */}
            <div className="mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-800">
                {t('screens.screenForm.moduleForCabinet')} {index + 1}
              </h3>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Quantity Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label={t('screens.screenForm.widthQuantity')}
                  name={`moduleDto_${index}_widthQuantity`}
                  type="number"
                  value={cabinet.moduleDto.widthQuantity}
                  onChange={onChange}
                  error={errors[`moduleDto_${index}_widthQuantity`]}
                  required
                />
                <Input
                  label={t('screens.screenForm.heightQuantity')}
                  name={`moduleDto_${index}_heightQuantity`}
                  type="number"
                  value={cabinet.moduleDto.heightQuantity}
                  onChange={onChange}
                  error={errors[`moduleDto_${index}_heightQuantity`]}
                  required
                />
              </div>

              {/* Dimension Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label={t('screens.screenForm.heightPx')}
                  name={`moduleDto_${index}_height`}
                  type="number"
                  value={cabinet.moduleDto.height}
                  onChange={onChange}
                  error={errors[`moduleDto_${index}_height`]}
                  required
                />
                <Input
                  label={t('screens.screenForm.widthPx')}
                  name={`moduleDto_${index}_width`}
                  type="number"
                  value={cabinet.moduleDto.width}
                  onChange={onChange}
                  error={errors[`moduleDto_${index}_width`]}
                  required
                />
              </div>

              {/* Batch Number */}
              <Input
                label={t('screens.screenForm.batchNumber')}
                name={`moduleDto_${index}_moduleBatchNumber`}
                value={cabinet.moduleDto.moduleBatchNumber}
                onChange={onChange}
                error={errors[`moduleDto_${index}_moduleBatchNumber`]}
                required
              />
            </div>
          </div>
        ))}

        {/* Empty State for Cabinet Solution */}
        {form.cabinets.length === 0 && (
          <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-sm sm:text-base">
              {t('screens.screenForm.noCabinetsAvailable')}
            </p>
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
          type="submit" 
          isLoading={loading}
          className="w-full sm:w-auto min-w-[140px] order-1 sm:order-2"
          loadingText={t('common.loading')}
        >
          {t('screens.actions.createScreen')}
        </Button>
      </div>
    </div>
  );
};

export default ModulesStep;