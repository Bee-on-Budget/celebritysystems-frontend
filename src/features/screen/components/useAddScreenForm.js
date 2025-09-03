import { useState } from "react";
import { useTranslation } from "react-i18next";
import { showToast } from "../../../components/ToastNotifier";
import { createScreen } from "../../../api/services/ScreenService";

const initialFormState = {
  name: "",
  screenType: "",
  solutionTypeInScreen: "",
  location: "",
  pixelScreen: "",
  description: "",
  powerSupply: "",
  powerSupplyQuantity: "",
  sparePowerSupplyQuantity: "",
  receivingCard: "",
  receivingCardQuantity: "",
  spareReceivingCardQuantity: "",
  cable: "",
  cableQuantity: "",
  spareCableQuantity: "",
  powerCable: "",
  powerCableQuantity: "",
  sparePowerCableQuantity: "",
  dataCable: "",
  dataCableQuantity: "",
  spareDataCableQuantity: "",
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
      isWidth: false,
      isHeight: false,
    }
  ],
  cabinets: [
    {
      cabinetName: "",
      widthQuantity: "",
      heightQuantity: "",
      height: "",
      width: "",
      isHeight: false,
      isWidth: false,
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
          isHeight: false,
          isWidth: false,
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
          isWidth: false,
          isHeight: false,
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
      setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
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
      if (!form.pixelScreen) newErrors.pixelScreen = t('screens.validation.pixelScreenRequired');
      if (!form.solutionTypeInScreen) newErrors.solutionTypeInScreen = t('screens.validation.solutionRequired');
      if (form.fan && !form.fanQuantity) {
        newErrors.fanQuantity = t('screens.validation.fanQuantityRequired');
      } else if (form.fan && Number(form.fanQuantity) < 0) {
        newErrors.fanQuantity = t('screens.validation.fanQuantityNonNegative');
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
      if(!form.connectionFile) newErrors.connectionFile = t('screens.validation.connectionFileRequired');
      if(!form.configFile) newErrors.configFile = t('screens.validation.configFileRequired');
      if(!form.versionFile) newErrors.versionFile = t('screens.validation.versionFileRequired');
    }

    if (currentStep === 2) {
      // Cable validation
      if (form.cable && !form.cableQuantity) {
        newErrors.cableQuantity = t('screens.validation.cableQuantityRequired');
      } else if (form.cable && Number(form.cableQuantity) <= 0) {
        newErrors.cableQuantity = t('screens.validation.cableQuantityPositive');
      }
      if (form.spareCableQuantity && Number(form.spareCableQuantity) < 0) {
        newErrors.spareCableQuantity = t('screens.validation.spareCableQuantityNonNegative');
      }

      // Power Cable validation
      if (form.powerCable && !form.powerCableQuantity) {
        newErrors.powerCableQuantity = t('screens.validation.powerCableQuantityRequired');
      } else if (form.powerCable && Number(form.powerCableQuantity) <= 0) {
        newErrors.powerCableQuantity = t('screens.validation.powerCableQuantityPositive');
      }
      if (form.sparePowerCableQuantity && Number(form.sparePowerCableQuantity) < 0) {
        newErrors.sparePowerCableQuantity = t('screens.validation.sparePowerCableQuantityNonNegative');
      }

      // Data Cable validation
      if (form.dataCable && !form.dataCableQuantity) {
        newErrors.dataCableQuantity = t('screens.validation.dataCableQuantityRequired');
      } else if (form.dataCable && Number(form.dataCableQuantity) <= 0) {
        newErrors.dataCableQuantity = t('screens.validation.dataCableQuantityPositive');
      }
      if (form.spareDataCableQuantity && Number(form.spareDataCableQuantity) < 0) {
        newErrors.spareDataCableQuantity = t('screens.validation.spareDataCableQuantityNonNegative');
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
      // Prepare solution-specific data first
      let solutionData = {};
      if (form.solutionTypeInScreen === "MODULE_SOLUTION") {
        solutionData.modulesDto = form.modulesDto.map(module => ({
          moduleBatchNumber: module.moduleBatchNumber,
          widthQuantity: Number(module.widthQuantity),
          heightQuantity: Number(module.heightQuantity),
          height: Number(module.height),
          width: Number(module.width),
          isWidth: !!module.isWidth,
          isHeight: !!module.isHeight,
        }));
      } else {
        solutionData.cabinDtoListJson = JSON.stringify(
          form.cabinets.map(cabinet => ({
            cabinetName: cabinet.cabinetName,
            widthQuantity: Number(cabinet.widthQuantity),
            heightQuantity: Number(cabinet.heightQuantity),
            height: Number(cabinet.height),
            width: Number(cabinet.width),
            isWidth: cabinet.isWidth,
            isHeight: cabinet.isHeight,
            moduleDto: {
              moduleBatchNumber: cabinet.moduleDto.moduleBatchNumber,
              widthQuantity: Number(cabinet.moduleDto.widthQuantity),
              heightQuantity: Number(cabinet.moduleDto.heightQuantity),
              height: Number(cabinet.moduleDto.height),
              width: Number(cabinet.moduleDto.width)
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
        pixelScreen: form.pixelScreen,
        description: form.description,

        // Power Supply Information
        powerSupply: form.powerSupply,
        powerSupplyQuantity: Number(form.powerSupplyQuantity),
        sparePowerSupplyQuantity: Number(form.sparePowerSupplyQuantity),

        // Receiving Card Information
        receivingCard: form.receivingCard,
        receivingCardQuantity: Number(form.receivingCardQuantity),
        spareReceivingCardQuantity: Number(form.spareReceivingCardQuantity),

        // Cable Information
        cable: form.cable,
        cableQuantity: Number(form.cableQuantity),
        spareCableQuantity: Number(form.spareCableQuantity),

        // Power Cable Information
        powerCable: form.powerCable,
        powerCableQuantity: Number(form.powerCableQuantity),
        sparePowerCableQuantity: Number(form.sparePowerCableQuantity),

        // Data Cable Information
        dataCable: form.dataCable,
        dataCableQuantity: Number(form.dataCableQuantity),
        spareDataCableQuantity: Number(form.spareDataCableQuantity),

        // Media Information
        media: form.media,
        mediaQuantity: Number(form.mediaQuantity),
        spareMediaQuantity: Number(form.spareMediaQuantity),

        // Fan Information
        fan: form.fan,
        fanQuantity: Number(form.fanQuantity),

        // Hub Information
        hub: form.hub,
        hubQuantity: Number(form.hubQuantity),
        spareHubQuantity: Number(form.spareHubQuantity),

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
