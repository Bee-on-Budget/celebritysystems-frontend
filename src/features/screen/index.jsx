import React from 'react';
import { useAddScreenForm } from './components/useAddScreenForm';
import StepIndicator from './components/StepIndicator';
import ScreenStep from './steps/ScreenStep';
import CablesStep from './steps/CablesStep';
import CabinetsStep from './steps/CabinetsStep';
import ModulesStep from './steps/ModulesStep';

const AddScreen = () => {
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

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-10 px-4 md:px-12">
        <StepIndicator stepNumber={1} title="Screen" currentStep={step} />
        <StepIndicator stepNumber={2} title="Cables" currentStep={step} />
        <StepIndicator
          stepNumber={3}
          title="Cabinets"
          currentStep={step}
          visible={form.solutionTypeInScreen === "CABINET_SOLUTION"} />
        <StepIndicator stepNumber={form.solutionTypeInScreen === "CABINET_SOLUTION" ? 4 : 3} title="Modules" currentStep={step} />
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
        {(step === 4 || (step === 3 && form.solutionTypeInScreen === "MODULE_SOLUTION")) && (
          <ModulesStep
            form={form}
            errors={errors}
            onChange={handleChange}
            onBack={prevStep}
            addModule={addModule}
            removeModule={removeModule}
            loading={loading}
          />
        )}
      </form>
    </div>
  );
};

export default AddScreen;