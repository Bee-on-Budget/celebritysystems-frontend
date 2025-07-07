import { useState } from "react";
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
      showToast("You must have at least one cabinet", "warning");
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
      showToast("You must have at least one module", "warning");
      return;
    }
    setForm((prev) => ({
      ...prev,
      modulesDto: prev.modulesDto.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

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
          [field]: files ? files[0] : value,
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
            [field]: files ? files[0] : value,
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
          [field]: files ? files[0] : value,
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
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.screenType) newErrors.screenType = "Screen type is required";
      if (!form.location.trim()) {
        newErrors.location = "Location is required";
      } else if (!mapsUrlRegex.test(form.location)) {
        newErrors.location = "Please enter a valid Google Maps link";
      }
      if (!form.pixelScreen) newErrors.pixelScreen = "Pixel screen is required";
      if (!form.solutionTypeInScreen)
        newErrors.solutionTypeInScreen = "Solution is required";
      if (form.solutionTypeInScreen === "CABINET_SOLUTION" && !form.fan) {
        newErrors.fan = "Screen fan is required for Cabinet solution";
      }
      if (form.solutionTypeInScreen === "CABINET_SOLUTION" && !form.fanQuantity) {
        newErrors.fanQuantity = "Screen fan quantity is required for Cabinet solution";
      } else if (form.solutionTypeInScreen === "CABINET_SOLUTION" && Number(form.fanQuantity) <= 0) {
        newErrors.fanQuantity = "Fan quantity must be greater than 0";
      }

      // Power Supply validation
      if (form.powerSupply && !form.powerSupplyQuantity) {
        newErrors.powerSupplyQuantity = "Quantity is required when power supply type is specified";
      } else if (form.powerSupply && Number(form.powerSupplyQuantity) <= 0) {
        newErrors.powerSupplyQuantity = "Power supply quantity must be greater than 0";
      }
      if (form.sparePowerSupplyQuantity && Number(form.sparePowerSupplyQuantity) < 0) {
        newErrors.sparePowerSupplyQuantity = "Spare power supply quantity cannot be negative";
      }

      // Receiving Card validation
      if (form.receivingCard && !form.receivingCardQuantity) {
        newErrors.receivingCardQuantity = "Quantity is required when receiving card type is specified";
      } else if (form.receivingCard && Number(form.receivingCardQuantity) <= 0) {
        newErrors.receivingCardQuantity = "Receiving card quantity must be greater than 0";
      }
      if (form.spareReceivingCardQuantity && Number(form.spareReceivingCardQuantity) < 0) {
        newErrors.spareReceivingCardQuantity = "Spare receiving card quantity cannot be negative";
      }

      // Media validation
      if (form.media && !form.mediaQuantity) {
        newErrors.mediaQuantity = "Quantity is required when media type is specified";
      } else if (form.media && Number(form.mediaQuantity) <= 0) {
        newErrors.mediaQuantity = "Media quantity must be greater than 0";
      }
      if (form.spareMediaQuantity && Number(form.spareMediaQuantity) < 0) {
        newErrors.spareMediaQuantity = "Spare media quantity cannot be negative";
      }
    }

    if (currentStep === 2) {
      // Cable validation
      if (form.cable && !form.cableQuantity) {
        newErrors.cableQuantity = "Main cable quantity is required";
      } else if (form.cable && Number(form.cableQuantity) <= 0) {
        newErrors.cableQuantity = "Cable quantity must be greater than 0";
      }
      if (form.spareCableQuantity && Number(form.spareCableQuantity) < 0) {
        newErrors.spareCableQuantity = "Spare cable quantity cannot be negative";
      }

      // Power Cable validation
      if (form.powerCable && !form.powerCableQuantity) {
        newErrors.powerCableQuantity = "Power cable quantity is required";
      } else if (form.powerCable && Number(form.powerCableQuantity) <= 0) {
        newErrors.powerCableQuantity = "Power cable quantity must be greater than 0";
      }
      if (form.sparePowerCableQuantity && Number(form.sparePowerCableQuantity) < 0) {
        newErrors.sparePowerCableQuantity = "Spare power cable quantity cannot be negative";
      }

      // Data Cable validation
      if (form.dataCable && !form.dataCableQuantity) {
        newErrors.dataCableQuantity = "Data cable quantity is required";
      } else if (form.dataCable && Number(form.dataCableQuantity) <= 0) {
        newErrors.dataCableQuantity = "Data cable quantity must be greater than 0";
      }
      if (form.spareDataCableQuantity && Number(form.spareDataCableQuantity) < 0) {
        newErrors.spareDataCableQuantity = "Spare data cable quantity cannot be negative";
      }
    }

    if (currentStep === 3) {
      if (form.solutionTypeInScreen === "CABINET_SOLUTION") {
        form.cabinets.forEach((cabinet, index) => {
          if (!cabinet.cabinetName)
            newErrors[`cabinet_${index}_cabinetName`] = "Cabinet name is required";
          if (!cabinet.widthQuantity)
            newErrors[`cabinet_${index}_widthQuantity`] = "Width quantity is required";
          else if (Number(cabinet.widthQuantity) <= 0)
            newErrors[`cabinet_${index}_widthQuantity`] = "Width quantity must be greater than 0";
          if (!cabinet.heightQuantity)
            newErrors[`cabinet_${index}_heightQuantity`] = "Height quantity is required";
          else if (Number(cabinet.heightQuantity) <= 0)
            newErrors[`cabinet_${index}_heightQuantity`] = "Height quantity must be greater than 0";
          if (!cabinet.height)
            newErrors[`cabinet_${index}_height`] = "Height is required";
          if (!cabinet.width)
            newErrors[`cabinet_${index}_width`] = "Width is required";
        });
      }

      if (form.solutionTypeInScreen === "MODULE_SOLUTION") {
        form.modulesDto.forEach((module, index) => {
          if (!module.widthQuantity)
            newErrors[`moduleDto_${index}_widthQuantity`] = "Quantity is required";
          else if (Number(module.widthQuantity) <= 0)
            newErrors[`moduleDto_${index}_widthQuantity`] = "Quantity must be greater than 0";
          if (!module.heightQuantity)
            newErrors[`moduleDto_${index}_heightQuantity`] = "Height quantity is required";
          else if (Number(module.heightQuantity) <= 0)
            newErrors[`moduleDto_${index}_heightQuantity`] = "Height quantity must be greater than 0";
          if (!module.height)
            newErrors[`moduleDto_${index}_height`] = "Height is required";
          if (!module.width)
            newErrors[`moduleDto_${index}_width`] = "Width is required";
          if (!module.moduleBatchNumber)
            newErrors[`moduleDto_${index}_moduleBatchNumber`] = "Batch number is required";
        });
      }
    }

    if (currentStep === 4) {
      form.cabinets.forEach((cabinet, index) => {
        if (!cabinet.moduleDto.widthQuantity)
          newErrors[`moduleDto_${index}_widthQuantity`] = "Width quantity is required";
        else if (Number(cabinet.moduleDto.widthQuantity) <= 0)
          newErrors[`moduleDto_${index}_widthQuantity`] = "Width quantity must be greater than 0";
        if (!cabinet.moduleDto.heightQuantity)
          newErrors[`moduleDto_${index}_heightQuantity`] = "Height quantity is required";
        else if (Number(cabinet.moduleDto.heightQuantity) <= 0)
          newErrors[`moduleDto_${index}_heightQuantity`] = "Height quantity must be greater than 0";
        if (!cabinet.moduleDto.height)
          newErrors[`moduleDto_${index}_height`] = "Height is required";
        if (!cabinet.moduleDto.width)
          newErrors[`moduleDto_${index}_width`] = "Width is required";
        if (!cabinet.moduleDto.moduleBatchNumber)
          newErrors[`moduleDto_${index}_moduleBatchNumber`] = "Batch number is required";
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      showToast("Please fill all required fields correctly", "error");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(step)) {
      showToast("Please fill all required fields correctly", "error");
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
          width: Number(module.width)
        }));
      } else {
        solutionData.cabinDtoListJson = JSON.stringify(
          form.cabinets.map(cabinet => ({
            cabinetName: cabinet.cabinetName,
            widthQuantity: Number(cabinet.widthQuantity),
            heightQuantity: Number(cabinet.heightQuantity),
            height: Number(cabinet.height),
            width: Number(cabinet.width),
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

        // Files
        connectionFile: form.connectionFile,
        configFile: form.configFile,
        versionFile: form.versionFile,

        // Add the solution-specific data
        ...solutionData
      };

      console.log("Submitting form data:", formData);
      await createScreen(formData);

      showToast("Screen created successfully");
      setForm(initialFormState);
      setStep(1);
    } catch (err) {
      console.error("Error creating screen:", err);
      showToast(
        "Error creating screen: " + (err.message || "Unknown error"),
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
