import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button } from '../../../components';
import { SectionContainer } from '../components';

const CablesStep = ({ form, errors, onChange, onNext, onBack }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <SectionContainer title={t('screens.screenForm.cableInformation')}>
        <div className="space-y-4 sm:space-y-6">
          {/* Main Cables */}
          <SectionContainer title={t('screens.screenForm.mainCables')}>
            <div className="space-y-3 sm:space-y-4">
              <Input 
                label={t('screens.screenForm.mainCableType')} 
                name="cable" 
                value={form.cable} 
                onChange={onChange} 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label={t('screens.screenForm.quantity')}
                  name="cableQuantity"
                  type="number"
                  value={form.cableQuantity}
                  onChange={onChange}
                  error={errors.cableQuantity}
                  required={!!form.cable}
                  disabled={!form.cable}
                />
                <Input
                  label={t('screens.screenForm.spareQuantity')}
                  name="spareCableQuantity"
                  type="number"
                  value={form.spareCableQuantity}
                  onChange={onChange}
                  disabled={!form.cable}
                />
              </div>
            </div>
          </SectionContainer>

          {/* Power Cables */}
          <SectionContainer title={t('screens.screenForm.powerCables')}>
            <div className="space-y-3 sm:space-y-4">
              <Input 
                label={t('screens.screenForm.powerCableType')} 
                name="powerCable" 
                value={form.powerCable} 
                onChange={onChange} 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label={t('screens.screenForm.quantity')}
                  name="powerCableQuantity"
                  type="number"
                  value={form.powerCableQuantity}
                  onChange={onChange}
                  error={errors.powerCableQuantity}
                  required={!!form.powerCable}
                  disabled={!form.powerCable}
                />
                <Input
                  label={t('screens.screenForm.spareQuantity')}
                  name="sparePowerCableQuantity"
                  type="number"
                  value={form.sparePowerCableQuantity}
                  onChange={onChange}
                  disabled={!form.powerCable}
                />
              </div>
            </div>
          </SectionContainer>

          {/* Data Cables */}
          <SectionContainer title={t('screens.screenForm.dataCables')}>
            <div className="space-y-3 sm:space-y-4">
              <Input 
                label={t('screens.screenForm.dataCableType')} 
                name="dataCable" 
                value={form.dataCable} 
                onChange={onChange} 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label={t('screens.screenForm.quantity')}
                  name="dataCableQuantity"
                  type="number"
                  value={form.dataCableQuantity}
                  onChange={onChange}
                  error={errors.dataCableQuantity}
                  required={!!form.dataCable}
                  disabled={!form.dataCable}
                />
                <Input
                  label={t('screens.screenForm.spareQuantity')}
                  name="spareDataCableQuantity"
                  type="number"
                  value={form.spareDataCableQuantity}
                  onChange={onChange}
                  disabled={!form.dataCable}
                />
              </div>
            </div>
          </SectionContainer>
        </div>
      </SectionContainer>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onBack}
          className="w-full sm:w-auto min-w-[100px] order-2 sm:order-1"
        >
          Back
        </Button>
        <Button 
          type="button" 
          onClick={onNext}
          className="w-full sm:w-auto min-w-[140px] order-1 sm:order-2"
        >
          Next: Cabinets
        </Button>
      </div>
    </div>
  );
};

export default CablesStep;