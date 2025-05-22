import React, { useState, useRef } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { showToast } from "../../components/ToastNotifier";
import { createScreen, createModule, createCabin } from "./ScreenService";
const StepIndicator = ({ stepNumber, title, currentStep }) => (
    <div className="flex-1 text-center">
      <div className={`w-10 h-10 rounded-full mx-auto mb-2 text-white flex items-center justify-center text-sm font-semibold 
        ${currentStep === stepNumber ? "bg-primary" : "bg-gray-300"}`}>
        {stepNumber}
      </div>
      <p className={`text-sm ${currentStep === stepNumber ? "text-primary font-semibold" : "text-gray-500"}`}>
        {title}
      </p>
    </div>
  );

  const FileInput = ({ name, label, value, onChange }) => {
    const [isFocused, setIsFocused] = useState(false);
  
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="relative">
          <input 
            type="file" 
            name={name} 
            onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className={`flex items-center justify-between px-3 py-2 border rounded-md shadow-sm bg-white ${
            isFocused 
              ? "border-primary ring-1 ring-primary" 
              : "border-gray-300 hover:border-gray-400"
          }`}>
            <span className="text-sm text-gray-500 truncate">
              {value ? value.name : "Choose file"}
            </span>
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        </div>
      </div>
    );
  };
FileInput.displayName = "FileInput";

const AddScreen = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    screenType: "",
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
    connectionFile: null,
    configFile: null,
    versionFile: null,
    module: {
      quantity: "",
      height: "",
      width: ""
    },
    cabin: {
      quantity: "",
      height: "",
      width: "",
      type: ""
    }
  });

  // Create refs for file inputs
  const connectionFileRef = useRef(null);
  const configFileRef = useRef(null);
  const versionFileRef = useRef(null);

  const screenTypeOptions = [
    { value: "IN_DOOR", label: "Indoor" },
    { value: "OUT_DOOR", label: "Outdoor" }
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name.startsWith("module_")) {
      const fieldName = name.replace("module_", "");
      setForm({
        ...form,
        module: {
          ...form.module,
          [fieldName]: files ? files[0] : value
        }
      });
    } else if (name.startsWith("cabin_")) {
      const fieldName = name.replace("cabin_", "");
      setForm({
        ...form,
        cabin: {
          ...form.cabin,
          [fieldName]: files ? files[0] : value
        }
      });
    } else {
      setForm({
        ...form,
        [name]: files ? files[0] : value
      });
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const screenFormData = new FormData();

      Object.keys(form).forEach(key => {
        if (key !== "module" && key !== "cabin" && form[key] !== null && form[key] !== undefined) {
          screenFormData.append(key, form[key]);
        }
      });

      screenFormData.append("moduleQuantity", form.module.quantity);
      screenFormData.append("moduleHeight", form.module.height);
      screenFormData.append("moduleWidth", form.module.width);
      screenFormData.append("cabinQuantity", form.cabin.quantity);
      screenFormData.append("cabinHeight", form.cabin.height);
      screenFormData.append("cabinWidth", form.cabin.width);
      screenFormData.append("cabinType", form.cabin.type);

      await createScreen(screenFormData);
      await createModule(form.module);
      await createCabin(form.cabin);

      showToast("Screen, module, and cabin created successfully");
      window.location.reload();
    } catch (err) {
      showToast("Error creating screen: " + (err.message || "Unknown error"), "error");
    }

    setLoading(false);
  };

  const renderSection = (title, children) => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <hr className="mb-4" />
      {children}
    </div>
  );

  const renderScreenFields = () => renderSection("Screen Information", <>
    <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Screen Type *</label>
      <select
        name="screenType"
        value={form.screenType}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        required
      >
        <option value="">Select Screen Type</option>
        {screenTypeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
    <Input label="Location" name="location" value={form.location} onChange={handleChange} required />
    <div className="grid grid-cols-2 gap-4">
      <Input label="Height" name="height" type="number" value={form.height} onChange={handleChange} />
      <Input label="Width" name="width" type="number" value={form.width} onChange={handleChange} />
    </div>

    {renderSection("Power Supply", <>
      <Input label="Power Supply Type" name="powerSupply" value={form.powerSupply} onChange={handleChange} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Quantity" name="powerSupplyQuantity" type="number" value={form.powerSupplyQuantity} onChange={handleChange} />
        <Input label="Spare Quantity" name="sparePowerSupplyQuantity" type="number" value={form.sparePowerSupplyQuantity} onChange={handleChange} />
      </div>
    </>)}

    {renderSection("Receiving Card", <>
      <Input label="Receiving Card Type" name="receivingCard" value={form.receivingCard} onChange={handleChange} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Quantity" name="receivingCardQuantity" type="number" value={form.receivingCardQuantity} onChange={handleChange} />
        <Input label="Spare Quantity" name="spareReceivingCardQuantity" type="number" value={form.spareReceivingCardQuantity} onChange={handleChange} />
      </div>
    </>)}

    {renderSection("Files", <>
      <div className="grid grid-cols-3 gap-4">
        <div onClick={() => connectionFileRef.current?.click()} className="cursor-pointer">
          <FileInput 
            ref={connectionFileRef}
            name="connectionFile" 
            label="Connection File" 
            value={form.connectionFile} 
            onChange={handleChange} 
          />
        </div>
        <div onClick={() => configFileRef.current?.click()} className="cursor-pointer">
          <FileInput 
            ref={configFileRef}
            name="configFile" 
            label="Config File" 
            value={form.configFile} 
            onChange={handleChange} 
          />
        </div>
        <div onClick={() => versionFileRef.current?.click()} className="cursor-pointer">
          <FileInput 
            ref={versionFileRef}
            name="versionFile" 
            label="Version File" 
            value={form.versionFile} 
            onChange={handleChange} 
          />
        </div>
      </div>
    </>)}

    <div className="flex justify-end pt-6">
      <Button type="button" onClick={nextStep}>Next: Module</Button>
    </div>
  </>);

  const renderModuleFields = () => renderSection("Module Information", <>
    <Input label="Quantity" name="module_quantity" type="number" value={form.module.quantity} onChange={handleChange} required />
    <div className="grid grid-cols-2 gap-4">
      <Input label="Height" name="module_height" type="number" value={form.module.height} onChange={handleChange} />
      <Input label="Width" name="module_width" type="number" value={form.module.width} onChange={handleChange} />
    </div>
    <div className="flex justify-between pt-6">
      <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>
      <Button type="button" onClick={nextStep}>Next: Cabin</Button>
    </div>
  </>);

  const renderCabinFields = () => renderSection("Cabin Information", <>
    <Input label="Quantity" name="cabin_quantity" type="number" value={form.cabin.quantity} onChange={handleChange} required />
    <div className="grid grid-cols-2 gap-4">
      <Input label="Height" name="cabin_height" type="number" value={form.cabin.height} onChange={handleChange} />
      <Input label="Width" name="cabin_width" type="number" value={form.cabin.width} onChange={handleChange} />
    </div>
    <Input label="Type" name="cabin_type" value={form.cabin.type} onChange={handleChange} />
    <div className="flex justify-between pt-6">
      <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>
      <Button type="button" onClick={nextStep}>Next: Cables</Button>
    </div>
  </>);

  const renderCableFields = () => renderSection("Cable Information", <>
    {renderSection("Main Cables", <>
      <Input label="Main Cable Type" name="cable" value={form.cable} onChange={handleChange} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Quantity" name="cableQuantity" type="number" value={form.cableQuantity} onChange={handleChange} />
        <Input label="Spare Quantity" name="spareCableQuantity" type="number" value={form.spareCableQuantity} onChange={handleChange} />
      </div>
    </>)}

    {renderSection("Power Cables", <>
      <Input label="Power Cable Type" name="powerCable" value={form.powerCable} onChange={handleChange} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Quantity" name="powerCableQuantity" type="number" value={form.powerCableQuantity} onChange={handleChange} />
        <Input label="Spare Quantity" name="sparePowerCableQuantity" type="number" value={form.sparePowerCableQuantity} onChange={handleChange} />
      </div>
    </>)}

    {renderSection("Data Cables", <>
      <Input label="Data Cable Type" name="dataCable" value={form.dataCable} onChange={handleChange} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Quantity" name="dataCableQuantity" type="number" value={form.dataCableQuantity} onChange={handleChange} />
        <Input label="Spare Quantity" name="spareDataCableQuantity" type="number" value={form.spareDataCableQuantity} onChange={handleChange} />
      </div>
    </>)}

    <div className="flex justify-between pt-6">
      <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>
      <Button type="submit" isLoading={loading}>Create Screen</Button>
    </div>
  </>);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-10 px-4 md:px-12">
        <StepIndicator stepNumber={1} title="Screen" currentStep={step} />
        <StepIndicator stepNumber={2} title="Module" currentStep={step} />
        <StepIndicator stepNumber={3} title="Cabin" currentStep={step} />
        <StepIndicator stepNumber={4} title="Cables" currentStep={step} />
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl space-y-6 border border-gray-100">
        {step === 1 && renderScreenFields()}
        {step === 2 && renderModuleFields()}
        {step === 3 && renderCabinFields()}
        {step === 4 && renderCableFields()}
      </form>
    </div>
  );
};

export default AddScreen;