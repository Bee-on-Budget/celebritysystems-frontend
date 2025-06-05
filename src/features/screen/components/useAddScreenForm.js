import { useState } from "react";
import { showToast } from "../../../components/ToastNotifier";
import { createScreen } from "../../../api/ScreenService";

const initialFormState = {
  name: "",
  screenType: "",
  solutionTypeInScreen: "",
  location: "",
  height: "",
  width: "",
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
      quantity: "",
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
        quantity: "",
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
            quantity: "",
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
          quantity: "",
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

    if (currentStep === 1) {
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.screenType) newErrors.screenType = "Screen type is required";
      if (!form.location.trim()) newErrors.location = "Location is required";
      if (!form.height) newErrors.height = "Height is required";
      if (!form.width) newErrors.width = "Width is required";
      if (!form.solutionTypeInScreen)
        newErrors.solutionTypeInScreen = "Solution is required";
      if (form.solutionTypeInScreen === "CABINET_SOLUTION" && !form.fan) {
        newErrors.fan = "Screen fan is required for Cabinet solution";
      }
      if (form.solutionTypeInScreen === "CABINET_SOLUTION" && !form.fanQuantity) {
        newErrors.fanQuantity =
          "Screen fan quantity is required for Cabinet solution";
      }

      if (form.powerSupply && !form.powerSupplyQuantity) {
        newErrors.powerSupplyQuantity =
          "Quantity is required when power supply type is specified";
      }

      if (form.receivingCard && !form.receivingCardQuantity) {
        newErrors.receivingCardQuantity =
          "Quantity is required when receiving card type is specified";
      }

      if (form.media && !form.mediaQuantity) {
        newErrors.mediaQuantity =
          "Quantity is required when media type is specified";
      }
    }

    if (currentStep === 2) {
      if (form.cable && !form.cableQuantity)
        newErrors.cableQuantity = "Main cable quantity is required";
      if (form.powerCable && !form.powerCableQuantity)
        newErrors.powerCableQuantity = "Power cable quantity is required";
      if (form.dataCable && !form.dataCableQuantity)
        newErrors.dataCableQuantity = "Data cable quantity is required";
    }

    if (currentStep === 3) {
      if (form.solutionTypeInScreen === "CABINET_SOLUTION") {
        form.cabinets.forEach((cabinet, index) => {
          if (!cabinet.cabinetName)
            newErrors[`cabinet_${index}_name`] = "Cabinet name is required";
          if (!cabinet.widthQuantity)
            newErrors[`cabinet_${index}_widthQuantity`] = "Width quantity is required";
          if (!cabinet.heightQuantity)
            newErrors[`cabinet_${index}_heightQuantity`] = "Height quantity is required";
          if (!cabinet.height)
            newErrors[`cabinet_${index}_height`] = "Height is required";
          if (!cabinet.width)
            newErrors[`cabinet_${index}_width`] = "Width is required";
        });
      }

      if (form.solutionTypeInScreen === "MODULE_SOLUTION") {
        form.modulesDto.forEach((module, index) => {
          if (!module.quantity)
            newErrors[`moduleDto_${index}_quantity`] = "Quantity is required";
          if (!module.height)
            newErrors[`moduleDto_${index}_height`] = "Height is required";
          if (!module.width)
            newErrors[`moduleDto_${index}_width`] = "Width is required";
          if (!module.moduleBatchNumber)
            newErrors[`moduleDto_${index}_moduleBatchNumber`] =
              "Batch number is required";
        })
      }
    }

    if (currentStep === 4) {
      form.cabinets.forEach((cabinet, index) => {
        if (!cabinet.moduleDto.quantity)
          newErrors[`moduleDto_${index}_quantity`] = "Quantity is required";
        if (!cabinet.moduleDto.height)
          newErrors[`moduleDto_${index}_height`] = "Height is required";
        if (!cabinet.moduleDto.width)
          newErrors[`moduleDto_${index}_width`] = "Width is required";
        if (!cabinet.moduleDto.moduleBatchNumber)
          newErrors[`moduleDto_${index}_moduleBatchNumber`] =
            "Batch number is required";
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
          quantity: Number(module.quantity),
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
              quantity: Number(cabinet.moduleDto.quantity),
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
