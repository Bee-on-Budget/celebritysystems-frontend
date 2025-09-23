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
          <SectionContainer title={t('screens.screenForm.mainPowerCable')}>
            <div className="space-y-3 sm:space-y-4">
              <Input
                label={t('screens.screenForm.mainPowerCableType')}
                name="mainPowerCable"
                value={form.mainPowerCable}
                onChange={onChange}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label={t('screens.screenForm.quantity')}
                  name="mainPowerCableQuantity"
                  type="number"
                  value={form.mainPowerCableQuantity}
                  onChange={onChange}
                  error={errors.mainPowerCableQuantity}
                  required={!!form.mainPowerCable}
                  disabled={!form.mainPowerCable}
                />
                <Input
                  label={t('screens.screenForm.spareQuantity')}
                  name="spareMainPowerCableQuantity"
                  type="number"
                  value={form.spareMainPowerCableQuantity}
                  onChange={onChange}
                  disabled={!form.mainPowerCable}
                />
              </div>
            </div>
          </SectionContainer>

          {/* Power Cables */}
          <SectionContainer title={t('screens.screenForm.loopPowerCable')}>
            <div className="space-y-3 sm:space-y-4">
              <Input
                label={t('screens.screenForm.loopPowerCableType')}
                name="loopPowerCable"
                value={form.loopPowerCable}
                onChange={onChange}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label={t('screens.screenForm.quantity')}
                  name="loopPowerCableQuantity"
                  type="number"
                  value={form.loopPowerCableQuantity}
                  onChange={onChange}
                  error={errors.loopPowerCableQuantity}
                  required={!!form.loopPowerCable}
                  disabled={!form.loopPowerCable}
                />
                <Input
                  label={t('screens.screenForm.spareQuantity')}
                  name="spareLoopPowerCableQuantity"
                  type="number"
                  value={form.spareLoopPowerCableQuantity}
                  onChange={onChange}
                  disabled={!form.loopPowerCable}
                />
              </div>
            </div>
          </SectionContainer>

          {/* Data Cables */}
          <SectionContainer title={t('screens.screenForm.mainDataCable')}>
            <div className="space-y-3 sm:space-y-4">
              <Input
                label={t('screens.screenForm.mainDataCableType')}
                name="mainDataCable"
                value={form.mainDataCable}
                onChange={onChange}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label={t('screens.screenForm.quantity')}
                  name="mainDataCableQuantity"
                  type="number"
                  value={form.mainDataCableQuantity}
                  onChange={onChange}
                  error={errors.mainDataCableQuantity}
                  required={!!form.mainDataCable}
                  disabled={!form.mainDataCable}
                />
                <Input
                  label={t('screens.screenForm.spareQuantity')}
                  name="spareMainDataCableQuantity"
                  type="number"
                  value={form.spareMainDataCableQuantity}
                  onChange={onChange}
                  disabled={!form.mainDataCable}
                />
              </div>
            </div>
          </SectionContainer>

          {/* Data Cables */}
          <SectionContainer title={t('screens.screenForm.loopDataCable')}>
            <div className="space-y-3 sm:space-y-4">
              <Input
                label={t('screens.screenForm.loopDataCableType')}
                name="loopDataCable"
                value={form.loopDataCable}
                onChange={onChange}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label={t('screens.screenForm.quantity')}
                  name="loopDataCableQuantity"
                  type="number"
                  value={form.loopDataCableQuantity}
                  onChange={onChange}
                  error={errors.loopDataCableQuantity}
                  required={!!form.loopDataCable}
                  disabled={!form.loopDataCable}
                />
                <Input
                  label={t('screens.screenForm.spareQuantity')}
                  name="spareLoopDataCableQuantity"
                  type="number"
                  value={form.spareLoopDataCableQuantity}
                  onChange={onChange}
                  disabled={!form.loopDataCable}
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
          {t('screens.actions.back')}
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto min-w-[140px] order-1 sm:order-2"
        >
          {t('screens.actions.nextCabinets')}
        </Button>
      </div>
    </div>
  );
};

export default CablesStep;