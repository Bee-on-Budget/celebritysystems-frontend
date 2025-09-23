import { useState } from "react";
import { useTranslation } from "react-i18next";
import { showToast } from "../../../components/ToastNotifier";
import { createScreen } from "../../../api/services/ScreenService";

const initialFormState = {
  name: "",
  screenType: "",
  solutionTypeInScreen: "",
  location: "",
  batchScreen: "",
  description: "",
  screenWidth: "",
  screenHeight: "",
  pixelPitch: "",
  pixelPitchWidth: "",
  pixelPitchHeight: "",
  irregularPixelPitch: false,
  powerSupply: "",
  powerSupplyQuantity: "",
  sparePowerSupplyQuantity: "",
  receivingCard: "",
  receivingCardQuantity: "",
  spareReceivingCardQuantity: "",
  // CableStep fields (align with CablesStep.jsx)
  mainPowerCable: "",
  mainPowerCableQuantity: "",
  spareMainPowerCableQuantity: "",
  loopPowerCable: "",
  loopPowerCableQuantity: "",
  spareLoopPowerCableQuantity: "",
  mainDataCable: "",
  mainDataCableQuantity: "",
  spareMainDataCableQuantity: "",
  loopDataCable: "",
  loopDataCableQuantity: "",
  spareLoopDataCableQuantity: "",
  media: "",
  mediaQuantity: "",
  spareMediaQuantity: "",
  fan: "",
  fanQuantity: "",
  hub: "",
  hubQuantity: "",
  spareHubQuantity: "",
  connectionFile: null,
  configFile: null,
  versionFile: null,
  modulesDto: [
    {
      widthQuantity: "",
      heightQuantity: "",
      height: "",
      width: "",
      moduleBatchNumber: "",
    }
  ],
  cabinets: [
    {
      cabinetName: "",
      widthQuantity: "",
      heightQuantity: "",
      height: "",
      width: "",
      moduleDto: {
        widthQuantity: "",
        heightQuantity: "",
        height: "",
        width: "",
        moduleBatchNumber: "",
      },
    },
  ],
};

const useAddScreenForm = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(initialFormState);

  const addCabinet = () => {
    setForm((prev) => ({
      ...prev,
      cabinets: [
        ...prev.cabinets,
        {
          cabinetName: "",
          widthQuantity: "",
          heightQuantity: "",
          height: "",
          width: "",
          moduleDto: {
            widthQuantity: "",
            heightQuantity: "",
            height: "",
            width: "",
            moduleBatchNumber: "",
          },
        },
      ],
    }));
  };

  const removeCabinet = (index) => {
    if (form.cabinets.length <= 1) {
      showToast(t('screens.validation.mustHaveOneCabinet'), "warning");
      return;
    }

    setForm((prev) => ({
      ...prev,
      cabinets: prev.cabinets.filter((_, i) => i !== index),
    }));
  };

  const addModule = () => {
    if (form.solutionTypeInScreen !== "MODULE_SOLUTION") return;

    setForm((prev) => ({
      ...prev,
      modulesDto: [
        ...prev.modulesDto,
        {
          widthQuantity: "",
          heightQuantity: "",
          height: "",
          width: "",
          moduleBatchNumber: "",
        },
      ],
    }));
  };

  const removeModule = (index) => {
    if (form.modulesDto.length <= 1) {
      showToast(t('screens.validation.mustHaveOneModule'), "warning");
      return;
    }
    setForm((prev) => ({
      ...prev,
      modulesDto: prev.modulesDto.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (name.startsWith("cabinet_") && form.solutionTypeInScreen === 'CABINET_SOLUTION') {
      const [, index, field] = name.split("_");
      const cabinetIndex = parseInt(index);

      setForm((prev) => {
        const updatedCabinets = [...prev.cabinets];
        updatedCabinets[cabinetIndex] = {
          ...updatedCabinets[cabinetIndex],
          [field]: type === 'checkbox' ? checked : (files ? files[0] : value),
        };
        return { ...prev, cabinets: updatedCabinets };
      });
    } else if (name.startsWith("moduleDto_") && form.solutionTypeInScreen === 'CABINET_SOLUTION') {
      const [, cabinetIndex, field] = name.split("_");
      const index = parseInt(cabinetIndex);

      setForm((prev) => {
        const updatedCabinets = [...prev.cabinets];
        updatedCabinets[index] = {
          ...updatedCabinets[index],
          moduleDto: {
            ...updatedCabinets[index].moduleDto,
            [field]: type === 'checkbox' ? checked : (files ? files[0] : value),
          },
        };
        return { ...prev, cabinets: updatedCabinets };
      });
    } else if (name.startsWith("moduleDto_") && form.solutionTypeInScreen === 'MODULE_SOLUTION') {
      const [, index, field] = name.split("_");
      const moduleIndex = parseInt(index);

      setForm((prev) => {
        const updatedModules = [...prev.modulesDto];
        updatedModules[moduleIndex] = {
          ...updatedModules[moduleIndex],
          [field]: type === 'checkbox' ? checked : (files ? files[0] : value),
        };
        return { ...prev, modulesDto: updatedModules };
      });
    }
    else {
      setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : (files ? files[0] : value) }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    const mapsUrlRegex = /^https?:\/\/(www\.)?(google\.)?maps\./i;

    if (currentStep === 1) {
      if (!form.name.trim()) newErrors.name = t('screens.validation.nameRequired');
      if (!form.screenType) newErrors.screenType = t('screens.validation.screenTypeRequired');
      if (!form.location.trim()) {
        newErrors.location = t('screens.validation.locationRequired');
      } else if (!mapsUrlRegex.test(form.location)) {
        newErrors.location = t('screens.validation.validMapsLink');
      }
      // if (!form.pixelScreen) newErrors.pixelScreen = t('screens.validation.pixelScreenRequired');
      if (!form.solutionTypeInScreen) newErrors.solutionTypeInScreen = t('screens.validation.solutionRequired');
      if (form.fan && !form.fanQuantity) {
        newErrors.fanQuantity = t('screens.validation.fanQuantityRequired');
      } else if (form.fan && Number(form.fanQuantity) < 0) {
        newErrors.fanQuantity = t('screens.validation.fanQuantityNonNegative');
      }

      // Dimentions validation
      if (!form.screenWidth) newErrors.screenWidth = t('screens.validation.screenWidthRequired');
      if (!form.screenHeight) newErrors.screenHeight = t('screens.validation.screenHeightRequired');

      // Pixel Pitch validation
      if (!form.irregularPixelPitch) {
        if (!form.pixelPitch) newErrors.pixelPitch = t('screens.validation.pixelPitchRequired');
      } else {
        if (!form.pixelPitchWidth) newErrors.pixelPitchWidth = t('screens.validation.pixelPitchWidthRequired');
        if (!form.pixelPitchHeight) newErrors.pixelPitchHeight = t('screens.validation.pixelPitchHeightRequired');
      }

      // Power Supply validation
      if (form.powerSupply && !form.powerSupplyQuantity) {
        newErrors.powerSupplyQuantity = t('screens.validation.powerSupplyQuantityRequired');
      } else if (form.powerSupply && Number(form.powerSupplyQuantity) <= 0) {
        newErrors.powerSupplyQuantity = t('screens.validation.powerSupplyQuantityPositive');
      }
      if (form.sparePowerSupplyQuantity && Number(form.sparePowerSupplyQuantity) < 0) {
        newErrors.sparePowerSupplyQuantity = t('screens.validation.sparePowerSupplyQuantityNonNegative');
      }

      // Receiving Card validation
      if (form.receivingCard && !form.receivingCardQuantity) {
        newErrors.receivingCardQuantity = t('screens.validation.receivingCardQuantityRequired');
      } else if (form.receivingCard && Number(form.receivingCardQuantity) <= 0) {
        newErrors.receivingCardQuantity = t('screens.validation.receivingCardQuantityPositive');
      }
      if (form.spareReceivingCardQuantity && Number(form.spareReceivingCardQuantity) < 0) {
        newErrors.spareReceivingCardQuantity = t('screens.validation.spareReceivingCardQuantityNonNegative');
      }

      // Media validation
      if (form.media && !form.mediaQuantity) {
        newErrors.mediaQuantity = t('screens.validation.mediaQuantityRequired');
      } else if (form.media && Number(form.mediaQuantity) <= 0) {
        newErrors.mediaQuantity = t('screens.validation.mediaQuantityPositive');
      }
      if (form.spareMediaQuantity && Number(form.spareMediaQuantity) < 0) {
        newErrors.spareMediaQuantity = t('screens.validation.spareMediaQuantityNonNegative');
      }

      // Hub validation
      if (form.hub && !form.hubQuantity) {
        newErrors.hubQuantity = t('screens.validation.hubQuantityRequired');
      } else if (form.hub && Number(form.hubQuantity) <= 0) {
        newErrors.hubQuantity = t('screens.validation.hubQuantityPositive');
      }
      if (form.spareHubQuantity && Number(form.spareHubQuantity) < 0) {
        newErrors.spareHubQuantity = t('screens.validation.spareHubQuantityNonNegative');
      }

      // Files validation
      if (!form.connectionFile) newErrors.connectionFile = t('screens.validation.connectionFileRequired');
      if (!form.configFile) newErrors.configFile = t('screens.validation.configFileRequired');
      if (!form.versionFile) newErrors.versionFile = t('screens.validation.versionFileRequired');
    }

    if (currentStep === 2) {
      // Main Power Cable
      if (form.mainPowerCable && !form.mainPowerCableQuantity) {
        newErrors.mainPowerCableQuantity = t('screens.validation.powerCableQuantityRequired');
      } else if (form.mainPowerCable && Number(form.mainPowerCableQuantity) <= 0) {
        newErrors.mainPowerCableQuantity = t('screens.validation.powerCableQuantityPositive');
      }
      if (form.spareMainPowerCableQuantity && Number(form.spareMainPowerCableQuantity) < 0) {
        newErrors.spareMainPowerCableQuantity = t('screens.validation.sparePowerCableQuantityNonNegative');
      }

      // Loop Power Cable
      if (form.loopPowerCable && !form.loopPowerCableQuantity) {
        newErrors.loopPowerCableQuantity = t('screens.validation.powerCableQuantityRequired');
      } else if (form.loopPowerCable && Number(form.loopPowerCableQuantity) <= 0) {
        newErrors.loopPowerCableQuantity = t('screens.validation.powerCableQuantityPositive');
      }
      if (form.spareLoopPowerCableQuantity && Number(form.spareLoopPowerCableQuantity) < 0) {
        newErrors.spareLoopPowerCableQuantity = t('screens.validation.sparePowerCableQuantityNonNegative');
      }

      // Main Data Cable
      if (form.mainDataCable && !form.mainDataCableQuantity) {
        newErrors.mainDataCableQuantity = t('screens.validation.dataCableQuantityRequired');
      } else if (form.mainDataCable && Number(form.mainDataCableQuantity) <= 0) {
        newErrors.mainDataCableQuantity = t('screens.validation.dataCableQuantityPositive');
      }
      if (form.spareMainDataCableQuantity && Number(form.spareMainDataCableQuantity) < 0) {
        newErrors.spareMainDataCableQuantity = t('screens.validation.spareDataCableQuantityNonNegative');
      }

      // Loop Data Cable
      if (form.loopDataCable && !form.loopDataCableQuantity) {
        newErrors.loopDataCableQuantity = t('screens.validation.dataCableQuantityRequired');
      } else if (form.loopDataCable && Number(form.loopDataCableQuantity) <= 0) {
        newErrors.loopDataCableQuantity = t('screens.validation.dataCableQuantityPositive');
      }
      if (form.spareLoopDataCableQuantity && Number(form.spareLoopDataCableQuantity) < 0) {
        newErrors.spareLoopDataCableQuantity = t('screens.validation.spareDataCableQuantityNonNegative');
      }
    }

    if (currentStep === 3) {
      if (form.solutionTypeInScreen === "CABINET_SOLUTION") {
        form.cabinets.forEach((cabinet, index) => {
          if (!cabinet.cabinetName)
            newErrors[`cabinet_${index}_cabinetName`] = t('screens.validation.cabinetNameRequired');
          if (!cabinet.widthQuantity)
            newErrors[`cabinet_${index}_widthQuantity`] = t('screens.validation.widthQuantityRequired');
          else if (Number(cabinet.widthQuantity) <= 0)
            newErrors[`cabinet_${index}_widthQuantity`] = t('screens.validation.widthQuantityPositive');
          if (!cabinet.heightQuantity)
            newErrors[`cabinet_${index}_heightQuantity`] = t('screens.validation.heightQuantityRequired');
          else if (Number(cabinet.heightQuantity) <= 0)
            newErrors[`cabinet_${index}_heightQuantity`] = t('screens.validation.heightQuantityPositive');
          if (!cabinet.height)
            newErrors[`cabinet_${index}_height`] = t('screens.validation.heightRequired');
          if (!cabinet.width)
            newErrors[`cabinet_${index}_width`] = t('screens.validation.widthRequired');
        });
      }

      if (form.solutionTypeInScreen === "MODULE_SOLUTION") {
        form.modulesDto.forEach((module, index) => {
          if (!module.widthQuantity)
            newErrors[`moduleDto_${index}_widthQuantity`] = t('screens.validation.quantityRequired');
          else if (Number(module.widthQuantity) <= 0)
            newErrors[`moduleDto_${index}_widthQuantity`] = t('screens.validation.quantityPositive');
          if (!module.heightQuantity)
            newErrors[`moduleDto_${index}_heightQuantity`] = t('screens.validation.heightQuantityRequired');
          else if (Number(module.heightQuantity) <= 0)
            newErrors[`moduleDto_${index}_heightQuantity`] = t('screens.validation.heightQuantityPositive');
          if (!module.height)
            newErrors[`moduleDto_${index}_height`] = t('screens.validation.heightRequired');
          if (!module.width)
            newErrors[`moduleDto_${index}_width`] = t('screens.validation.widthRequired');
          if (!module.moduleBatchNumber)
            newErrors[`moduleDto_${index}_moduleBatchNumber`] = t('screens.validation.batchNumberRequired');
        });
      }
    }

    if (currentStep === 4) {
      form.cabinets.forEach((cabinet, index) => {
        if (!cabinet.moduleDto.widthQuantity)
          newErrors[`moduleDto_${index}_widthQuantity`] = t('screens.validation.widthQuantityRequired');
        else if (Number(cabinet.moduleDto.widthQuantity) <= 0)
          newErrors[`moduleDto_${index}_widthQuantity`] = t('screens.validation.widthQuantityPositive');
        if (!cabinet.moduleDto.heightQuantity)
          newErrors[`moduleDto_${index}_heightQuantity`] = t('screens.validation.heightQuantityRequired');
        else if (Number(cabinet.moduleDto.heightQuantity) <= 0)
          newErrors[`moduleDto_${index}_heightQuantity`] = t('screens.validation.heightQuantityPositive');
        if (!cabinet.moduleDto.height)
          newErrors[`moduleDto_${index}_height`] = t('screens.validation.heightRequired');
        if (!cabinet.moduleDto.width)
          newErrors[`moduleDto_${index}_width`] = t('screens.validation.widthRequired');
        if (!cabinet.moduleDto.moduleBatchNumber)
          newErrors[`moduleDto_${index}_moduleBatchNumber`] = t('screens.validation.batchNumberRequired');
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      showToast(t('screens.validation.fillRequiredFields'), "error");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(step)) {
      showToast(t('screens.validation.fillRequiredFields'), "error");
      return;
    }

    setLoading(true);
    try {
      const asNumberOrUndefined = (v) => (v === '' || v === undefined || v === null ? undefined : Number(v));

      // Prepare solution-specific data first
      let solutionData = {};
      if (form.solutionTypeInScreen === "MODULE_SOLUTION") {
        solutionData.modulesDto = form.modulesDto.map(module => ({
          moduleBatchNumber: module.moduleBatchNumber,
          widthQuantity: asNumberOrUndefined(module.widthQuantity),
          heightQuantity: asNumberOrUndefined(module.heightQuantity),
          height: asNumberOrUndefined(module.height),
          width: asNumberOrUndefined(module.width),
        }));
      } else {
        solutionData.cabinDtoListJson = JSON.stringify(
          form.cabinets.map(cabinet => ({
            cabinetName: cabinet.cabinetName,
            widthQuantity: asNumberOrUndefined(cabinet.widthQuantity),
            heightQuantity: asNumberOrUndefined(cabinet.heightQuantity),
            height: asNumberOrUndefined(cabinet.height),
            width: asNumberOrUndefined(cabinet.width),
            moduleDto: {
              moduleBatchNumber: cabinet.moduleDto.moduleBatchNumber,
              widthQuantity: asNumberOrUndefined(cabinet.moduleDto.widthQuantity),
              heightQuantity: asNumberOrUndefined(cabinet.moduleDto.heightQuantity),
              height: asNumberOrUndefined(cabinet.moduleDto.height),
              width: asNumberOrUndefined(cabinet.moduleDto.width)
            }
          }))
        );
      }

      // Prepare the complete form data
      const formData = {
        // Basic Information
        name: form.name,
        screenType: form.screenType,
        solutionTypeInScreen: form.solutionTypeInScreen,
        location: form.location,
        batchScreen: form.batchScreen,
        description: form.description,

        // Dimensions
        screenWidth: asNumberOrUndefined(form.screenWidth),
        screenHeight: asNumberOrUndefined(form.screenHeight),

        // Pixel Pitch
        pixelPitch: form.irregularPixelPitch ? undefined : asNumberOrUndefined(form.pixelPitch),
        pixelPitchWidth: form.irregularPixelPitch ? asNumberOrUndefined(form.pixelPitchWidth) : undefined,
        pixelPitchHeight: form.irregularPixelPitch ? asNumberOrUndefined(form.pixelPitchHeight) : undefined,
        irregularPixelPitch: form.irregularPixelPitch,

        // Power Supply Information
        powerSupply: form.powerSupply,
        powerSupplyQuantity: asNumberOrUndefined(form.powerSupplyQuantity),
        sparePowerSupplyQuantity: asNumberOrUndefined(form.sparePowerSupplyQuantity),

        // Receiving Card Information
        receivingCard: form.receivingCard,
        receivingCardQuantity: asNumberOrUndefined(form.receivingCardQuantity),
        spareReceivingCardQuantity: asNumberOrUndefined(form.spareReceivingCardQuantity),

        // Cable Information
        // aligned fields are used below instead

        // Power Cable Information
        mainPowerCable: form.mainPowerCable,
        mainPowerCableQuantity: asNumberOrUndefined(form.mainPowerCableQuantity),
        spareMainPowerCableQuantity: asNumberOrUndefined(form.spareMainPowerCableQuantity),
        loopPowerCable: form.loopPowerCable,
        loopPowerCableQuantity: asNumberOrUndefined(form.loopPowerCableQuantity),
        spareLoopPowerCableQuantity: asNumberOrUndefined(form.spareLoopPowerCableQuantity),

        // Data Cable Information
        mainDataCable: form.mainDataCable,
        mainDataCableQuantity: asNumberOrUndefined(form.mainDataCableQuantity),
        spareMainDataCableQuantity: asNumberOrUndefined(form.spareMainDataCableQuantity),
        loopDataCable: form.loopDataCable,
        loopDataCableQuantity: asNumberOrUndefined(form.loopDataCableQuantity),
        spareLoopDataCableQuantity: asNumberOrUndefined(form.spareLoopDataCableQuantity),

        // Media Information
        media: form.media,
        mediaQuantity: asNumberOrUndefined(form.mediaQuantity),
        spareMediaQuantity: asNumberOrUndefined(form.spareMediaQuantity),

        // Fan Information
        fan: form.fan,
        fanQuantity: asNumberOrUndefined(form.fanQuantity),

        // Hub Information
        hub: form.hub,
        hubQuantity: asNumberOrUndefined(form.hubQuantity),
        spareHubQuantity: asNumberOrUndefined(form.spareHubQuantity),

        // Files
        connectionFile: form.connectionFile,
        configFile: form.configFile,
        versionFile: form.versionFile,

        // Add the solution-specific data
        ...solutionData
      };

      console.log("Submitting form data:", formData);
      await createScreen(formData);

      showToast(t('screens.messages.screenCreated'));
      setForm(initialFormState);
      setStep(1);
    } catch (err) {
      console.error("Error creating screen:", err);
      showToast(
        t('screens.messages.errorCreatingScreen') + ": " + (err.message || t('common.unknownError')),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};

export { useAddScreenForm };
