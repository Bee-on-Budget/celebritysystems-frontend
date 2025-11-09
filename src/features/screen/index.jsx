import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAddScreenForm } from './components/useAddScreenForm';
import StepIndicator from './components/StepIndicator';
import ScreenStep from './steps/ScreenStep';
import CablesStep from './steps/CablesStep';
import CabinetsStep from './steps/CabinetsStep';
import ModulesStep from './steps/ModulesStep';
import ResolutionStep from './steps/ResolutionStep';

const AddScreen = () => {
  const { t } = useTranslation();
  const {
    step,
    form,
    errors,
    loading,
    nextStep,
    prevStep,
    handleSubmit,
    handleChange,
    addCabinet,
    removeCabinet,
    addModule,
    removeModule,
  } = useAddScreenForm();

  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";


  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-10 px-4 md:px-12">
        <StepIndicator stepNumber={1} title={t('screens.steps.screen')} currentStep={step} isRtl={isRtl} />
        <StepIndicator stepNumber={2} title={t('screens.steps.cables')} currentStep={step} isRtl={isRtl} />
        <StepIndicator
          stepNumber={3}
          title={t('screens.steps.cabinets')}
          currentStep={step}
          visible={form.solutionTypeInScreen === "CABINET_SOLUTION"}
          isRtl={isRtl}
        />
        <StepIndicator
          stepNumber={form.solutionTypeInScreen === "CABINET_SOLUTION" ? 4 : 3}
          title={t('screens.steps.modules')}
          currentStep={step}
          isRtl={isRtl}
        />
        <StepIndicator
          stepNumber={form.solutionTypeInScreen === "CABINET_SOLUTION" ? 5 : 4}
          title={t('screens.steps.resolution')}
          currentStep={step}
          isRtl={isRtl}
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl space-y-6 border border-gray-100">
        {step === 1 && (
          <ScreenStep
            form={form}
            errors={errors}
            onChange={handleChange}
            onNext={nextStep}
          />
        )}
        {step === 2 && (
          <CablesStep
            form={form}
            errors={errors}
            onChange={handleChange}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {step === 3 && form.solutionTypeInScreen === "CABINET_SOLUTION" && (
          <CabinetsStep
            form={form}
            errors={errors}
            onChange={handleChange}
            onBack={prevStep}
            onSubmit={handleSubmit}
            onNext={nextStep}
            addCabinet={addCabinet}
            removeCabinet={removeCabinet}
            loading={loading}
          />
        )}
        {((step === 3 && form.solutionTypeInScreen === "MODULE_SOLUTION") || (step === 4 && form.solutionTypeInScreen === "CABINET_SOLUTION")) && (
          <ModulesStep
            form={form}
            errors={errors}
            onChange={handleChange}
            onBack={prevStep}
            onNext={nextStep}
            addModule={addModule}
            removeModule={removeModule}
            loading={loading}
          />
        )}
        {((step === 4 && form.solutionTypeInScreen === "MODULE_SOLUTION") || (step === 5 && form.solutionTypeInScreen === "CABINET_SOLUTION")) && (
          <ResolutionStep
            form={form}
            errors={errors}
            onChange={handleChange}
            onBack={prevStep}
            loading={loading}
          />
        )}
      </form>
    </div>
  );
};

export default AddScreen;