import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, CustomCheckbox } from '../../../components';
import { SectionContainer } from '../components';

const ResolutionStep = ({ form, errors, onChange, onBack, loading }) => {
  const { t } = useTranslation();
  const [irregular, setIrregular] = useState(!!form.irregularPixelPitch);

  useEffect(() => {
    setIrregular(!!form.irregularPixelPitch);
  }, [form.irregularPixelPitch]);

  const onIrregularToggle = () => {
    const newValue = !irregular;
    setIrregular(newValue);
    onChange({
      target: { name: 'irregularPixelPitch', type: 'checkbox', checked: newValue }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <Input
          label={t('screens.screenForm.batchScreen')}
          name="batchScreen"
          placeholder={t('screens.screenForm.batchScreenPlaceholder')}
          value={form.batchScreen}
          onChange={onChange}
          error={errors.batchScreen}
          required
        />
      </div>

      <SectionContainer title={t('screens.screenForm.dimensions')}>
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label={t('screens.screenForm.screenWidth')}
              name="screenWidth"
              value={form.screenWidth}
              error={errors.screenWidth}
              onChange={onChange}
              required
            />
            <Input
              label={t('screens.screenForm.screenHeight')}
              name="screenHeight"
              value={form.screenHeight}
              error={errors.screenHeight}
              onChange={onChange}
              required
            />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer title={t('screens.screenForm.dimensions')}>
        <div className="space-y-3 sm:space-y-4">
          <CustomCheckbox
            name="irregularPixelPitch"
            label={t('screens.screenForm.irregularPixelPitch')}
            checked={irregular}
            onChange={onIrregularToggle}
          />
          {!irregular && (
            <Input
              label={t('screens.screenForm.pixelPitch')}
              name="pixelPitch"
              value={form.pixelPitch}
              error={errors.pixelPitch}
              onChange={onChange}
              required
            />
          )}
          {irregular && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                label={t('screens.screenForm.pixelPitchWidth')}
                name="pixelPitchWidth"
                value={form.pixelPitchWidth}
                error={errors.pixelPitchWidth}
                onChange={onChange}
                required
              />
              <Input
                label={t('screens.screenForm.pixelPitchHeight')}
                name="pixelPitchHeight"
                value={form.pixelPitchHeight}
                error={errors.pixelPitchHeight}
                onChange={onChange}
                required
              />
            </div>
          )}
        </div>
      </SectionContainer>

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
};

export default ResolutionStep;


