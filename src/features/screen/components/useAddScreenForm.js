import { useState } from "react";
import { showToast } from "../../../components/ToastNotifier";
import { createScreen, createModules, createCabinets } from "../../../api/ScreenService";

const useAddScreenForm = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
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
        cabinets: [
            {
                cabinetName: "",
                quantity: "",
                height: "",
                width: "",
                moduleDto: {
                    quantity: "",
                    height: "",
                    width: "",
                    moduleBatchNumber: ""
                }
            }
        ]
    });

    const addCabinet = () => {
        setForm(prev => ({
            ...prev,
            cabinets: [
                ...prev.cabinets,
                {
                    cabinetName: "",
                    quantity: "",
                    height: "",
                    width: "",
                    moduleDto: {
                        quantity: "",
                        height: "",
                        width: "",
                        moduleBatchNumber: ""
                    }
                }
            ]
        }));
    };

    const removeCabinet = (index) => {
        if (form.cabinets.length <= 1) {
            showToast("You must have at least one cabinet", "warning");
            return;
        }

        setForm(prev => ({
            ...prev,
            cabinets: prev.cabinets.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }

        if (name.startsWith("cabinet_")) {
            const [, index, field] = name.split("_");
            const cabinetIndex = parseInt(index);

            setForm(prev => {
                const updatedCabinets = [...prev.cabinets];
                updatedCabinets[cabinetIndex] = {
                    ...updatedCabinets[cabinetIndex],
                    [field]: files ? files[0] : value
                };
                return { ...prev, cabinets: updatedCabinets };
            });
        }
        else if (name.startsWith("moduleDto_")) {
            const [, cabinetIndex, field] = name.split("_");
            const index = parseInt(cabinetIndex);

            setForm(prev => {
                const updatedCabinets = [...prev.cabinets];
                updatedCabinets[index] = {
                    ...updatedCabinets[index],
                    moduleDto: {
                        ...updatedCabinets[index].moduleDto,
                        [field]: files ? files[0] : value
                    }
                };
                return { ...prev, cabinets: updatedCabinets };
            });
        }
        else {
            setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
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
            if (!form.solutionTypeInScreen) newErrors.solutionTypeInScreen = "Solution is required";
            if (form.solutionTypeInScreen === "Cabinet" && !form.fan) {
                newErrors.fan = "Screen fan is required for Cabinet solution";
            }
            if (form.solutionTypeInScreen === "Cabinet" && !form.fanQuantity) {
                newErrors.fanQuantity = "Screen fan quantity is required for Cabinet solution";
            }

            if (form.powerSupply && !form.powerSupplyQuantity) {
                newErrors.powerSupplyQuantity = "Quantity is required when power supply type is specified";
            }

            if (form.receivingCard && !form.receivingCardQuantity) {
                newErrors.receivingCardQuantity = "Quantity is required when receiving card type is specified";
            }

            if (form.media && !form.mediaQuantity) {
                newErrors.mediaQuantity = "Quantity is required when media type is specified";
            }
        }

        if (currentStep === 2) {
            if (form.cable && !form.cableQuantity) newErrors.cableQuantity = "Main cable quantity is required";
            if (form.powerCable && !form.powerCableQuantity) newErrors.powerCableQuantity = "Power cable quantity is required";
            if (form.dataCable && !form.dataCableQuantity) newErrors.dataCableQuantity = "Data cable quantity is required";
        }

        if (currentStep === 3) {
            form.cabinets.forEach((cabinet, index) => {
                if (!cabinet.cabinetName) newErrors[`cabinet_${index}_name`] = "Cabinet name is required";
                if (!cabinet.quantity) newErrors[`cabinet_${index}_quantity`] = "Quantity is required";
                if (!cabinet.height) newErrors[`cabinet_${index}_height`] = "Height is required";
                if (!cabinet.width) newErrors[`cabinet_${index}_width`] = "Width is required";
            });
        }

        if (currentStep === 4 && form.solutionTypeInScreen === "Module") {
            form.cabinets.forEach((cabinet, index) => {
                if (!cabinet.moduleDto.quantity) newErrors[`moduleDto_${index}_quantity`] = "Quantity is required";
                if (!cabinet.moduleDto.height) newErrors[`moduleDto_${index}_height`] = "Height is required";
                if (!cabinet.moduleDto.width) newErrors[`moduleDto_${index}_width`] = "Width is required";
                if (!cabinet.moduleDto.moduleBatchNumber) newErrors[`moduleDto_${index}_moduleBatchNumber`] = "Batch number is required";
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
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(step)) {
            showToast("Please fill all required fields correctly", "error");
            return;
        }

        setLoading(true);
        try {
            const screenFormData = new FormData();
            Object.keys(form).forEach(key => {
                if (key !== "cabinets" && form[key] !== null && form[key] !== undefined) {
                    screenFormData.append(key, form[key]);
                }
            });

            const cabinetsData = form.cabinets.map(cabinet => ({
                cabinetName: cabinet.cabinetName,
                quantity: cabinet.quantity,
                height: cabinet.height,
                width: cabinet.width
            }));

            await createScreen(screenFormData);
            await createCabinets(cabinetsData);

            if (form.solutionTypeInScreen === "Module") {
                const modulesData = form.cabinets.map(cabinet => ({
                    quantity: cabinet.moduleDto.quantity,
                    height: cabinet.moduleDto.height,
                    width: cabinet.moduleDto.width,
                    moduleBatchNumber: cabinet.moduleDto.moduleBatchNumber
                }));
                await createModules(modulesData);
            }

            showToast("Screen created successfully");
            window.location.reload();
        } catch (err) {
            showToast("Error creating screen: " + (err.message || "Unknown error"), "error");
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
        removeCabinet
    };
};

export { useAddScreenForm };