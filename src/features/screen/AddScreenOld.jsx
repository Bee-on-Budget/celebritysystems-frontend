// import React, { useState, useRef } from "react";
// import Input from "../../components/Input";
// import Button from "../../components/Button";
// import DropdownInput from "../../components/DropdownInput";
// import { showToast } from "../../components/ToastNotifier";
// import { createScreen, createModules, createCabinets } from "./ScreenService";

// const StepIndicator = ({ stepNumber, title, currentStep, visible = true }) => (
//   visible && (
//     <div className="flex-1 text-center">
//       <div className={`w-10 h-10 rounded-full mx-auto mb-2 text-white flex items-center justify-center text-sm font-semibold
//           ${currentStep === stepNumber ? "bg-primary" : "bg-gray-300"}`}>
//         {stepNumber}
//       </div>
//       <p className={`text-sm ${currentStep === stepNumber ? "text-primary font-semibold" : "text-gray-500"}`}>
//         {title}
//       </p>
//     </div>
//   )
// );

// const FileInput = ({ name, label, value, onChange, error }) => {
//   const [isFocused, setIsFocused] = useState(false);

//   return (
//     <div className="space-y-1">
//       <label className="block text-sm font-medium text-gray-700">{label}</label>
//       <div className="relative">
//         <input
//           type="file"
//           name={name}
//           onChange={onChange}
//           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//         />
//         <div className={`flex items-center justify-between px-3 py-2 border rounded-md shadow-sm bg-white ${isFocused
//           ? "border-primary ring-1 ring-primary"
//           : error ? "border-red-500" : "border-gray-300 hover:border-gray-400"
//           }`}>
//           <span className="text-sm text-gray-500 truncate">
//             {value ? value.name : "Choose file"}
//           </span>
//           <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//           </svg>
//         </div>
//         {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//       </div>
//     </div>
//   );
// };
// FileInput.displayName = "FileInput";

// const AddScreen = () => {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [form, setForm] = useState({
//     name: "",
//     screenType: "",
//     location: "",
//     height: "",
//     width: "",
//     solution: "",
//     screenFan: "",
//     powerSupply: "",
//     powerSupplyQuantity: "",
//     sparePowerSupplyQuantity: "",
//     receivingCard: "",
//     receivingCardQuantity: "",
//     spareReceivingCardQuantity: "",
//     cable: "",
//     cableQuantity: "",
//     spareCableQuantity: "",
//     powerCable: "",
//     powerCableQuantity: "",
//     sparePowerCableQuantity: "",
//     dataCable: "",
//     dataCableQuantity: "",
//     spareDataCableQuantity: "",
//     connectionFile: null,
//     configFile: null,
//     versionFile: null,
//     cabinets: [
//       {
//         quantity: "",
//         height: "",
//         width: "",
//         type: "",
//         module: {
//           quantity: "",
//           height: "",
//           width: "",
//           batchNumber: ""
//         }
//       }
//     ]
//   });

//   const connectionFileRef = useRef(null);
//   const configFileRef = useRef(null);
//   const versionFileRef = useRef(null);

//   const screenTypeOptions = [
//     { value: "IN_DOOR", label: "Indoor" },
//     { value: "OUT_DOOR", label: "Outdoor" }
//   ];

//   const solutionOptions = [
//     { value: "Cabinet", label: "Cabinet" },
//     { value: "Module", label: "Module" }
//   ];

//   const addCabinet = () => {
//     setForm(prev => ({
//       ...prev,
//       cabinets: [
//         ...prev.cabinets,
//         {
//           quantity: "",
//           height: "",
//           width: "",
//           type: "",
//           module: {
//             quantity: "",
//             height: "",
//             width: "",
//             batchNumber: ""
//           }
//         }
//       ]
//     }));
//   };

//   const removeCabinet = (index) => {
//     if (form.cabinets.length <= 1) {
//       showToast("You must have at least one cabinet", "warning");
//       return;
//     }
    
//     setForm(prev => ({
//       ...prev,
//       cabinets: prev.cabinets.filter((_, i) => i !== index)
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }

//     if (name.startsWith("cabinet_")) {
//       const [, index, field] = name.split("_");
//       const cabinetIndex = parseInt(index);
      
//       setForm(prev => {
//         const updatedCabinets = [...prev.cabinets];
//         updatedCabinets[cabinetIndex] = {
//           ...updatedCabinets[cabinetIndex],
//           [field]: files ? files[0] : value
//         };
//         return { ...prev, cabinets: updatedCabinets };
//       });
//     }
//     else if (name.startsWith("module_")) {
//       const [, cabinetIndex, field] = name.split("_");
//       const index = parseInt(cabinetIndex);
      
//       setForm(prev => {
//         const updatedCabinets = [...prev.cabinets];
//         updatedCabinets[index] = {
//           ...updatedCabinets[index],
//           module: {
//             ...updatedCabinets[index].module,
//             [field]: files ? files[0] : value
//           }
//         };
//         return { ...prev, cabinets: updatedCabinets };
//       });
//     }
//     else {
//       setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
//     }
//   };

//   const validateStep = (currentStep) => {
//     const newErrors = {};
    
//     if (currentStep === 1) {
//       if (!form.name.trim()) newErrors.name = "Name is required";
//       if (!form.screenType) newErrors.screenType = "Screen type is required";
//       if (!form.location.trim()) newErrors.location = "Location is required";
//       if (!form.height) newErrors.height = "Height is required";
//       if (!form.width) newErrors.width = "Width is required";
//       if (!form.solution) newErrors.solution = "Solution is required";
//       if (form.solution === "Cabinet" && !form.screenFan) {
//         newErrors.screenFan = "Screen fan is required for Cabinet solution";
//       }
      
//       if (form.powerSupply && !form.powerSupplyQuantity) {
//         newErrors.powerSupplyQuantity = "Quantity is required when power supply type is specified";
//       }
      
//       if (form.receivingCard && !form.receivingCardQuantity) {
//         newErrors.receivingCardQuantity = "Quantity is required when receiving card type is specified";
//       }
//     }
    
//     if (currentStep === 2) {
//       if (form.cable && !form.cableQuantity) newErrors.cableQuantity = "Main cable quantity is required";
//       if (form.powerCable && !form.powerCableQuantity) newErrors.powerCableQuantity = "Power cable quantity is required";
//       if (form.dataCable && !form.dataCableQuantity) newErrors.dataCableQuantity = "Data cable quantity is required";
//     }
    
//     if (currentStep === 3) {
//       form.cabinets.forEach((cabinet, index) => {
//         if (!cabinet.quantity) newErrors[`cabinet_${index}_quantity`] = "Quantity is required";
//         if (!cabinet.height) newErrors[`cabinet_${index}_height`] = "Height is required";
//         if (!cabinet.width) newErrors[`cabinet_${index}_width`] = "Width is required";
//         if (!cabinet.type) newErrors[`cabinet_${index}_type`] = "Type is required";
//       });
//     }
    
//     if (currentStep === 4 && form.solution === "Module") {
//       form.cabinets.forEach((cabinet, index) => {
//         if (!cabinet.module.quantity) newErrors[`module_${index}_quantity`] = "Quantity is required";
//         if (!cabinet.module.height) newErrors[`module_${index}_height`] = "Height is required";
//         if (!cabinet.module.width) newErrors[`module_${index}_width`] = "Width is required";
//         if (!cabinet.module.batchNumber) newErrors[`module_${index}_batchNumber`] = "Batch number is required";
//       });
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const nextStep = () => {
//     if (!validateStep(step)) {
//       showToast("Please fill all required fields correctly", "error");
//       return;
//     }
//     setStep(prev => prev + 1);
//   };

//   const prevStep = () => setStep(prev => prev - 1);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateStep(step)) {
//       showToast("Please fill all required fields correctly", "error");
//       return;
//     }

//     setLoading(true);
//     try {
//       const screenFormData = new FormData();
//       Object.keys(form).forEach(key => {
//         if (key !== "cabinets" && form[key] !== null && form[key] !== undefined) {
//           screenFormData.append(key, form[key]);
//         }
//       });

//       const cabinetsData = form.cabinets.map(cabinet => ({
//         quantity: cabinet.quantity,
//         height: cabinet.height,
//         width: cabinet.width,
//         type: cabinet.type
//       }));

//       await createScreen(screenFormData);
//       await createCabinets(cabinetsData);

//       if (form.solution === "Module") {
//         const modulesData = form.cabinets.map(cabinet => ({
//           quantity: cabinet.module.quantity,
//           height: cabinet.module.height,
//           width: cabinet.module.width,
//           batchNumber: cabinet.module.batchNumber
//         }));
//         await createModules(modulesData);
//       }

//       showToast("Screen created successfully");
//       window.location.reload();
//     } catch (err) {
//       showToast("Error creating screen: " + (err.message || "Unknown error"), "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderSection = (title, children) => (
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold">{title}</h2>
//       <hr className="mb-4" />
//       {children}
//     </div>
//   );

//   const renderScreenFields = () => renderSection("Screen Information", <>
//     <Input label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
    
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <DropdownInput
//         name="solution"
//         value={form.solution}
//         options={solutionOptions}
//         onChange={handleChange}
//         label="Solution"
//         error={errors.solution}
//         required
//       />
//       <Input
//         label="Screen Fan"
//         name="screenFan"
//         value={form.screenFan}
//         onChange={handleChange}
//         error={errors.screenFan}
//         required={form.solution === "Cabinet"}
//         disabled={form.solution === "Module"}
//       />
//     </div>

//     <DropdownInput
//       name="screenType"
//       value={form.screenType}
//       options={screenTypeOptions}
//       onChange={handleChange}
//       label="Screen Type"
//       error={errors.screenType}
//       required
//     />

//     <Input label="Location" name="location" value={form.location} onChange={handleChange} error={errors.location} required />
    
//     <div className="grid grid-cols-2 gap-4">
//       <Input label="Height" name="height" type="number" value={form.height} onChange={handleChange} error={errors.height} required />
//       <Input label="Width" name="width" type="number" value={form.width} onChange={handleChange} error={errors.width} required />
//     </div>

//     {renderSection("Power Supply", <>
//       <Input label="Power Supply Type" name="powerSupply" value={form.powerSupply} onChange={handleChange} />
//       <div className="grid grid-cols-2 gap-4">
//         <Input 
//           label="Quantity" 
//           name="powerSupplyQuantity" 
//           type="number" 
//           value={form.powerSupplyQuantity} 
//           onChange={handleChange} 
//           error={errors.powerSupplyQuantity}
//           required={!!form.powerSupply}
//         />
//         <Input label="Spare Quantity" name="sparePowerSupplyQuantity" type="number" value={form.sparePowerSupplyQuantity} onChange={handleChange} />
//       </div>
//     </>)}

//     {renderSection("Receiving Card", <>
//       <Input label="Receiving Card Type" name="receivingCard" value={form.receivingCard} onChange={handleChange} />
//       <div className="grid grid-cols-2 gap-4">
//         <Input 
//           label="Quantity" 
//           name="receivingCardQuantity" 
//           type="number" 
//           value={form.receivingCardQuantity} 
//           onChange={handleChange} 
//           error={errors.receivingCardQuantity}
//           required={!!form.receivingCard}
//         />
//         <Input label="Spare Quantity" name="spareReceivingCardQuantity" type="number" value={form.spareReceivingCardQuantity} onChange={handleChange} />
//       </div>
//     </>)}

//     {renderSection("Files", <>
//       <div className="grid grid-cols-3 gap-4">
//         <FileInput
//           ref={connectionFileRef}
//           name="connectionFile"
//           label="Connection File"
//           value={form.connectionFile}
//           onChange={handleChange}
//           error={errors.connectionFile}
//         />
//         <FileInput
//           ref={configFileRef}
//           name="configFile"
//           label="Config File"
//           value={form.configFile}
//           onChange={handleChange}
//           error={errors.configFile}
//         />
//         <FileInput
//           ref={versionFileRef}
//           name="versionFile"
//           label="Version File"
//           value={form.versionFile}
//           onChange={handleChange}
//           error={errors.versionFile}
//         />
//       </div>
//     </>)}

//     <div className="flex justify-end pt-6">
//       <Button type="button" onClick={nextStep}>Next: Cables</Button>
//     </div>
//   </>);

//   const renderCableFields = () => renderSection("Cable Information", <>
//     {renderSection("Main Cables", <>
//       <Input label="Main Cable Type" name="cable" value={form.cable} onChange={handleChange} />
//       <div className="grid grid-cols-2 gap-4">
//         <Input 
//           label="Quantity" 
//           name="cableQuantity" 
//           type="number" 
//           value={form.cableQuantity} 
//           onChange={handleChange} 
//           error={errors.cableQuantity}
//           required={!!form.cable}
//         />
//         <Input label="Spare Quantity" name="spareCableQuantity" type="number" value={form.spareCableQuantity} onChange={handleChange} />
//       </div>
//     </>)}

//     {renderSection("Power Cables", <>
//       <Input label="Power Cable Type" name="powerCable" value={form.powerCable} onChange={handleChange} />
//       <div className="grid grid-cols-2 gap-4">
//         <Input 
//           label="Quantity" 
//           name="powerCableQuantity" 
//           type="number" 
//           value={form.powerCableQuantity} 
//           onChange={handleChange} 
//           error={errors.powerCableQuantity}
//           required={!!form.powerCable}
//         />
//         <Input label="Spare Quantity" name="sparePowerCableQuantity" type="number" value={form.sparePowerCableQuantity} onChange={handleChange} />
//       </div>
//     </>)}

//     {renderSection("Data Cables", <>
//       <Input label="Data Cable Type" name="dataCable" value={form.dataCable} onChange={handleChange} />
//       <div className="grid grid-cols-2 gap-4">
//         <Input 
//           label="Quantity" 
//           name="dataCableQuantity" 
//           type="number" 
//           value={form.dataCableQuantity} 
//           onChange={handleChange} 
//           error={errors.dataCableQuantity}
//           required={!!form.dataCable}
//         />
//         <Input label="Spare Quantity" name="spareDataCableQuantity" type="number" value={form.spareDataCableQuantity} onChange={handleChange} />
//       </div>
//     </>)}

//     <div className="flex justify-between pt-6">
//       <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>
//       <Button type="button" onClick={nextStep}>Next: Cabinets</Button>
//     </div>
//   </>);

//   const renderCabinetFields = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold">Cabinet Information</h2>
//         <Button type="button" onClick={addCabinet} size="sm">Add Cabinet</Button>
//       </div>
//       <hr className="mb-4" />

//       {form.cabinets.map((cabinet, index) => (
//         <div key={index} className="space-y-4 p-4 border rounded-lg relative">
//           {form.cabinets.length > 1 && (
//             <button
//               type="button"
//               onClick={() => removeCabinet(index)}
//               className="absolute top-2 right-2 text-red-500 hover:text-red-700"
//             >
//               ×
//             </button>
//           )}
//           <h3 className="font-medium">Cabinet {index + 1}</h3>
//           <Input 
//             label="Quantity" 
//             name={`cabinet_${index}_quantity`} 
//             type="number" 
//             value={cabinet.quantity} 
//             onChange={handleChange} 
//             error={errors[`cabinet_${index}_quantity`]}
//             required 
//           />
//           <div className="grid grid-cols-2 gap-4">
//             <Input 
//               label="Height" 
//               name={`cabinet_${index}_height`} 
//               type="number" 
//               value={cabinet.height} 
//               onChange={handleChange} 
//               error={errors[`cabinet_${index}_height`]}
//               required
//             />
//             <Input 
//               label="Width" 
//               name={`cabinet_${index}_width`} 
//               type="number" 
//               value={cabinet.width} 
//               onChange={handleChange} 
//               error={errors[`cabinet_${index}_width`]}
//               required
//             />
//           </div>
//           <Input 
//             label="Type" 
//             name={`cabinet_${index}_type`} 
//             value={cabinet.type} 
//             onChange={handleChange} 
//             error={errors[`cabinet_${index}_type`]}
//             required
//           />
//         </div>
//       ))}

//       <div className="flex justify-between pt-6">
//         <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>
//         <Button
//           type={form.solution === "Cabinet" ? "submit" : "button"}
//           onClick={form.solution === "Cabinet" ? null : nextStep}
//           isLoading={loading}
//         >
//           {form.solution === "Cabinet" ? "Create Screen" : "Next: Module"}
//         </Button>
//       </div>
//     </div>
//   );

//   const renderModuleFields = () => (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold">Module Information</h2>
//       <hr className="mb-4" />

//       {form.cabinets.map((cabinet, index) => (
//         <div key={index} className="space-y-4 p-4 border rounded-lg">
//           <h3 className="font-medium">Module for Cabinet {index + 1}</h3>
//           <Input 
//             label="Quantity" 
//             name={`module_${index}_quantity`} 
//             type="number" 
//             value={cabinet.module.quantity} 
//             onChange={handleChange} 
//             error={errors[`module_${index}_quantity`]}
//             required 
//           />
//           <div className="grid grid-cols-2 gap-4">
//             <Input 
//               label="Height" 
//               name={`module_${index}_height`} 
//               type="number" 
//               value={cabinet.module.height} 
//               onChange={handleChange} 
//               error={errors[`module_${index}_height`]}
//               required
//             />
//             <Input 
//               label="Width" 
//               name={`module_${index}_width`} 
//               type="number" 
//               value={cabinet.module.width} 
//               onChange={handleChange} 
//               error={errors[`module_${index}_width`]}
//               required
//             />
//           </div>
//           <Input 
//             label="Batch Number" 
//             name={`module_${index}_batchNumber`} 
//             value={cabinet.module.batchNumber} 
//             onChange={handleChange} 
//             error={errors[`module_${index}_batchNumber`]}
//             required
//           />
//         </div>
//       ))}

//       <div className="flex justify-between pt-6">
//         <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>
//         <Button type="submit" isLoading={loading}>Create Screen</Button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-3xl mx-auto mt-10">
//       <div className="flex items-center justify-between mb-10 px-4 md:px-12">
//         <StepIndicator stepNumber={1} title="Screen" currentStep={step} />
//         <StepIndicator stepNumber={2} title="Cables" currentStep={step} />
//         <StepIndicator stepNumber={3} title="Cabinets" currentStep={step} />
//         <StepIndicator 
//           stepNumber={4} 
//           title="Modules" 
//           currentStep={step} 
//           visible={form.solution === "Module"} 
//         />
//       </div>

//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl space-y-6 border border-gray-100">
//         {step === 1 && renderScreenFields()}
//         {step === 2 && renderCableFields()}
//         {step === 3 && renderCabinetFields()}
//         {step === 4 && form.solution === "Module" && renderModuleFields()}
//       </form>
//     </div>
//   );
// };

// export default AddScreen;

// import React, { useState, useRef, useEffect } from "react";
// import { showToast } from "../../components/ToastNotifier";
// import { createScreen, createModule, createCabin } from "./ScreenService";
// import StepIndicator from "./StepIndicator";
// import ScreenFormStep from "./screenSteps/ScreenFormStep";
// import CablesFormStep from "./screenSteps/CablesFormStep";
// import ModuleFormStep from "./screenSteps/ModuleFormStep";
// import CabinFormStep from "./screenSteps/CabinFormStep";
// import { validateStep } from "./validation";

// const AddScreen = () => {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [completedSteps, setCompletedSteps] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     screenType: "",
//     solution: "",
//     screenFan: "",
//     location: "",
//     height: "",
//     width: "",
//     powerSupply: "",
//     powerSupplyQuantity: "",
//     sparePowerSupplyQuantity: "",
//     receivingCard: "",
//     receivingCardQuantity: "",
//     spareReceivingCardQuantity: "",
//     cable: "",
//     cableQuantity: "",
//     spareCableQuantity: "",
//     powerCable: "",
//     powerCableQuantity: "",
//     sparePowerCableQuantity: "",
//     dataCable: "",
//     dataCableQuantity: "",
//     spareDataCableQuantity: "",
//     connectionFile: null,
//     configFile: null,
//     versionFile: null,
//     cabinets: [{
//       quantity: "",
//       height: "",
//       width: "",
//       type: ""
//     }],
//     modules: [{
//       quantity: "",
//       height: "",
//       width: "",
//       batchNumber: ""
//     }]
//   });

//   const [cabinetsForm, setCabinetsForm] = useState([{
//     quantity: "",
//     height: "",
//     width: "",
//     type: ""
//   }]);

//   const [modulesForm, setModulesForm] = useState([{
//     quantity: "",
//     height: "",
//     width: "",
//     batchNumber: ""
//   }]);

//   const connectionFileRef = useRef(null);
//   const configFileRef = useRef(null);
//   const versionFileRef = useRef(null);

//   useEffect(() => {
//     // Update screenFan when solution changes
//     if (form.solution === "Module") {
//       setForm(prev => ({
//         ...prev,
//         screenFan: "No fan needed"
//       }));
//     }
//   }, [form.solution]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     // Clear error when field changes
//     if (errors[name]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }

//     if (name.startsWith("module_")) {
//       const fieldName = name.replace("module_", "");
//       setForm({
//         ...form,
//         module: {
//           ...form.modules,
//           [fieldName]: files ? files[0] : value
//         }
//       });
//     } else {
//       setForm({
//         ...form,
//         [name]: files ? files[0] : value
//       });
//     }
//   };

//   const handleCabinChange = (index, e) => {
//     const { name, value } = e.target;
//     setForm(prev => {
//       const updatedCabins = [...prev.cabins];
//       updatedCabins[index] = {
//         ...updatedCabins[index],
//         [name]: value
//       };
//       return {
//         ...prev,
//         cabins: updatedCabins
//       };
//     });
//   };

//   const addCabinet = () => {
//     setForm(prev => ({
//       ...prev,
//       cabinets: [
//         ...prev.cabinets,
//         {
//           quantity: "",
//           height: "",
//           width: "",
//           type: ""
//         }
//       ]
//     }));
//   };

//   const addModule = () => {
//     setForm(prev => ({
//       ...prev,
//       modules: [
//         ...prev.modules,
//         {
//           quantity: "",
//           height: "",
//           width: "",
//           batchNumber: ""
//         }
//       ]
//     }));
//   };

//   const removeCabin = (index) => {
//     setForm(prev => {
//       const updatedCabins = [...prev.cabins];
//       updatedCabins.splice(index, 1);
//       return {
//         ...prev,
//         cabins: updatedCabins
//       };
//     });
//   };

//   const handleNext = () => {
//     const stepErrors = validateStep(step, form);
//     if (Object.keys(stepErrors).length > 0) {
//       setErrors(stepErrors);
//       showToast("Please fill all required fields", "error");
//       return;
//     }
//     setCompletedSteps(prev => [...prev, step]);
//     setStep(prev => prev + 1);
//   };

//   const handleBack = () => setStep(prev => prev - 1);

//   const nextStep = () => {
//     const stepErrors = validateStep(step, form, isModuleSkipped);
//     if (Object.keys(stepErrors).length > 0) {
//       setErrors(stepErrors);
//       showToast("Please fill all required fields", "error");
//       return;
//     }

//     setCompletedSteps(prev => [...prev, step]);
//     setStep(prev => prev + 1);
//   };

//   const prevStep = () => setStep(prev => prev - 1);

//   const isStepCompleted = (stepNumber) => completedSteps.includes(stepNumber);
//   const isModuleSkipped = form.solution === "Cabinet";

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate form
//     const stepErrors = validateStep(step, form);
//     if (Object.keys(stepErrors).length > 0) {
//       setErrors(stepErrors);
//       showToast("Please fill all required fields", "error");
//       return;
//     }

//     setLoading(true);
//     try {
//       const screenFormData = new FormData();

//       // Append screen data
//       Object.keys(form).forEach((key) => {
//         if (key !== "modules" && key !== "cabins" && form[key] !== null && form[key] !== undefined) {
//           screenFormData.append(key, form[key]);
//         }
//       });

//       // Submit screen
//       await createScreen(screenFormData);

//       // Submit modules if solution is Cabinet
//       if (form.solution === "Cabinet") {
//         for (const module of form.modules) {
//           await createModule(module);
//         }
//       }

//       // Submit all cabins
//       for (const cabin of form.cabins) {
//         await createCabin(cabin);
//       }

//       showToast("Screen created successfully!", "success");
//       // Reset form
//       setForm({
//         // ... initial form state
//       });
//     } catch (err) {
//       showToast(err.response?.data?.message || "Failed to create screen", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8" >
//       <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New Screen</h1>
//         <p className="text-gray-600 mb-6">Fill in the details for the new screen configuration</p>

//         <div className="flex items-center justify-between mb-8 px-4">
//           <StepIndicator
//             stepNumber={1}
//             title="Screen"
//             currentStep={step}
//             completed={isStepCompleted(1)}
//           />
//           <StepIndicator
//             stepNumber={2}
//             title="Cables"
//             currentStep={step}
//             completed={isStepCompleted(2)}
//           />
//           <StepIndicator
//             stepNumber={3}
//             title="Cabin"
//             currentStep={step}
//             completed={isStepCompleted(3)}
//           />
//           <StepIndicator
//             stepNumber={4}
//             title="Module"
//             currentStep={step}
//             completed={isStepCompleted(4) && !isModuleSkipped}
//             skipped={isModuleSkipped}
//           />
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {step === 1 && (
//             <ScreenFormStep
//               form={form}
//               errors={errors}
//               onChange={handleChange}
//               onNext={nextStep}
//               connectionFileRef={connectionFileRef}
//               configFileRef={configFileRef}
//               versionFileRef={versionFileRef}
//             />
//           )}

//           {step === 2 && (
//             <CablesFormStep
//               form={form}
//               errors={errors}
//               onChange={handleChange}
//               onBack={prevStep}
//               onNext={nextStep}
//             />
//           )}

//           {step === 3 && (
//             <CabinFormStep
//               form={form}
//               errors={errors}
//               onChange={handleChange}
//               onAddCabin={addCabinet}
//               onRemoveCabin={removeCabin}
//               onBack={prevStep}
//               onNext={nextStep}
//             />
//           )}

//           {step === 4 && (
//             <ModuleFormStep
//               form={form}
//               errors={errors}
//               onChange={handleCabinChange}
//               onBack={prevStep}
//               onAddModule={addModule}
//               isLoading={loading}
//             // isModuleSkipped={isModuleSkipped}
//             />
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddScreen;


// import React, { useState, useRef } from "react";
// import { showToast } from "../../components/ToastNotifier";
// import { createScreen, createModule, createCabin } from "./ScreenService";
// import StepIndicator from "./StepIndicator";
// import ScreenFormStep from "./screenSteps/ScreenFormStep";
// import ModuleFormStep from "./screenSteps/ModuleFormStep";
// import CabinFormStep from "./screenSteps/CabinFormStep";
// import CablesFormStep from "./screenSteps/CablesFormStep";
// import { validateStep } from "./validation";
// import FormsContainer from "../../components/FormsContainer";

// const AddScreen = () => {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [form, setForm] = useState({
//     name: "",
//     screenType: "",
//     location: "",
//     height: "",
//     width: "",
//     powerSupply: "",
//     powerSupplyQuantity: "",
//     sparePowerSupplyQuantity: "",
//     receivingCard: "",
//     receivingCardQuantity: "",
//     spareReceivingCardQuantity: "",
//     cable: "",
//     cableQuantity: "",
//     spareCableQuantity: "",
//     powerCable: "",
//     powerCableQuantity: "",
//     sparePowerCableQuantity: "",
//     dataCable: "",
//     dataCableQuantity: "",
//     spareDataCableQuantity: "",
//     connectionFile: null,
//     configFile: null,
//     versionFile: null,
//     module: {
//       quantity: "",
//       height: "",
//       width: ""
//     },
//     cabin: {
//       quantity: "",
//       height: "",
//       width: "",
//       type: ""
//     }
//   });

//   const connectionFileRef = useRef(null);
//   const configFileRef = useRef(null);
//   const versionFileRef = useRef(null);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     // Clear error when field changes
//     if (errors[name]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }

//     if (name.startsWith("module_")) {
//       const fieldName = name.replace("module_", "");
//       setForm({
//         ...form,
//         module: {
//           ...form.module,
//           [fieldName]: files ? files[0] : value
//         }
//       });
//     } else if (name.startsWith("cabin_")) {
//       const fieldName = name.replace("cabin_", "");
//       setForm({
//         ...form,
//         cabin: {
//           ...form.cabin,
//           [fieldName]: files ? files[0] : value
//         }
//       });
//     } else {
//       setForm({
//         ...form,
//         [name]: files ? files[0] : value
//       });
//     }
//   };

//   const nextStep = () => {
//     const stepErrors = validateStep(step, form);
//     if (Object.keys(stepErrors).length > 0) {
//       setErrors(stepErrors);
//       showToast("Please fill all required fields", "error");
//       return;
//     }
//     setStep((prev) => prev + 1);
//   };

//   const prevStep = () => setStep((prev) => prev - 1);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate final step
//     const stepErrors = validateStep(step, form);
//     if (Object.keys(stepErrors).length > 0) {
//       setErrors(stepErrors);
//       showToast("Please fill all required fields", "error");
//       return;
//     }

//     setLoading(true);
//     try {
//       const screenFormData = new FormData();

//       // Append screen data
//       Object.keys(form).forEach((key) => {
//         if (key !== "module" && key !== "cabin" && form[key] !== null && form[key] !== undefined) {
//           screenFormData.append(key, form[key]);
//         }
//       });

//       // Append module data
//       screenFormData.append("moduleQuantity", form.module.quantity);
//       screenFormData.append("moduleHeight", form.module.height);
//       screenFormData.append("moduleWidth", form.module.width);

//       // Append cabin data
//       screenFormData.append("cabinQuantity", form.cabin.quantity);
//       screenFormData.append("cabinHeight", form.cabin.height);
//       screenFormData.append("cabinWidth", form.cabin.width);
//       screenFormData.append("cabinType", form.cabin.type);

//       // Submit all data
//       await createScreen(screenFormData);
//       await createModule(form.module);
//       await createCabin(form.cabin);

//       showToast("Screen created successfully!", "success");
//       // Reset form or redirect after successful creation
//       setForm({
//         // ... reset form to initial state
//       });
//       setStep(1);
//     } catch (err) {
//       showToast(
//         err.response?.data?.message || "Failed to create screen",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <FormsContainer>
//       <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New Screen</h1>
//       <p className="text-gray-600 mb-6">Fill in the details for the new screen configuration</p>

//       <div className="flex items-center justify-between mb-8 px-4">
//         <StepIndicator stepNumber={1} title="Screen" currentStep={step} />
//         <StepIndicator stepNumber={2} title="Cables" currentStep={step} />
//         <StepIndicator stepNumber={3} title="Module" currentStep={step} />
//         <StepIndicator stepNumber={4} title="Cabin" currentStep={step} />
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {step === 1 && (
//           <ScreenFormStep
//             form={form}
//             errors={errors}
//             onChange={handleChange}
//             onNext={nextStep}
//             connectionFileRef={connectionFileRef}
//             configFileRef={configFileRef}
//             versionFileRef={versionFileRef}
//           />
//         )}

//         {step === 2 && (
//           <CablesFormStep
//             form={form}
//             errors={errors}
//             onChange={handleChange}
//             onNext={nextStep}
//             onBack={prevStep}
//           />
//         )}

//         {step === 3 && (
//           <ModuleFormStep
//             form={form}
//             errors={errors}
//             onChange={handleChange}
//             onBack={prevStep}
//             onNext={nextStep}
//           />
//         )}

//         {step === 4 && (
//           <CabinFormStep
//             form={form}
//             errors={errors}
//             onChange={handleChange}
//             onBack={prevStep}
//             isLoading={loading}
//           />
//         )}
//       </form>
//     </FormsContainer>
//   );
// };

// export default AddScreen;



// import React, { useState, useRef } from "react";
// import Input from "../../components/Input";
// import Button from "../../components/Button";
// import DropdownInput from "../../components/DropdownInput";
// import { showToast } from "../../components/ToastNotifier";
// import { createScreen, createModule, createCabinet } from "./ScreenService";
// const StepIndicator = ({ stepNumber, title, currentStep }) => (
//   <div className="flex-1 text-center">
//     <div className={`w-10 h-10 rounded-full mx-auto mb-2 text-white flex items-center justify-center text-sm font-semibold
//         ${currentStep === stepNumber ? "bg-primary" : "bg-gray-300"}`}>
//       {stepNumber}
//     </div>
//     <p className={`text-sm ${currentStep === stepNumber ? "text-primary font-semibold" : "text-gray-500"}`}>
//       {title}
//     </p>
//   </div>
// );

// const FileInput = ({ name, label, value, onChange }) => {
//   const [isFocused, setIsFocused] = useState(false);

//   return (
//     <div className="space-y-1">
//       <label className="block text-sm font-medium text-gray-700">{label}</label>
//       <div className="relative">
//         <input
//           type="file"
//           name={name}
//           onChange={onChange}
//           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//         />
//         <div className={`flex items-center justify-between px-3 py-2 border rounded-md shadow-sm bg-white ${isFocused
//           ? "border-primary ring-1 ring-primary"
//           : "border-gray-300 hover:border-gray-400"
//           }`}>
//           <span className="text-sm text-gray-500 truncate">
//             {value ? value.name : "Choose file"}
//           </span>
//           <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };
// FileInput.displayName = "FileInput";

// const AddScreen = () => {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     screenType: "",
//     location: "",
//     height: "",
//     width: "",
//     powerSupply: "",
//     powerSupplyQuantity: "",
//     sparePowerSupplyQuantity: "",
//     receivingCard: "",
//     receivingCardQuantity: "",
//     spareReceivingCardQuantity: "",
//     cable: "",
//     cableQuantity: "",
//     spareCableQuantity: "",
//     powerCable: "",
//     powerCableQuantity: "",
//     sparePowerCableQuantity: "",
//     dataCable: "",
//     dataCableQuantity: "",
//     spareDataCableQuantity: "",
//     connectionFile: null,
//     configFile: null,
//     versionFile: null,
//     module: {
//       quantity: "",
//       height: "",
//       width: ""
//     },
//     cabin: {
//       quantity: "",
//       height: "",
//       width: "",
//       type: ""
//     }
//   });

//   // Create refs for file inputs
//   const connectionFileRef = useRef(null);
//   const configFileRef = useRef(null);
//   const versionFileRef = useRef(null);

//   const screenTypeOptions = [
//     { value: "IN_DOOR", label: "Indoor" },
//     { value: "OUT_DOOR", label: "Outdoor" }
//   ];

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name.startsWith("module_")) {
//       const fieldName = name.replace("module_", "");
//       setForm({
//         ...form,
//         module: {
//           ...form.module,
//           [fieldName]: files ? files[0] : value
//         }
//       });
//     } else if (name.startsWith("cabin_")) {
//       const fieldName = name.replace("cabin_", "");
//       setForm({
//         ...form,
//         cabin: {
//           ...form.cabin,
//           [fieldName]: files ? files[0] : value
//         }
//       });
//     } else {
//       setForm({
//         ...form,
//         [name]: files ? files[0] : value
//       });
//     }
//   };

//   const nextStep = () => setStep((prev) => prev + 1);
//   const prevStep = () => setStep((prev) => prev - 1);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const screenFormData = new FormData();

//       Object.keys(form).forEach(key => {
//         if (key !== "module" && key !== "cabin" && form[key] !== null && form[key] !== undefined) {
//           screenFormData.append(key, form[key]);
//         }
//       });

//       screenFormData.append("moduleQuantity", form.module.quantity);
//       screenFormData.append("moduleHeight", form.module.height);
//       screenFormData.append("moduleWidth", form.module.width);
//       screenFormData.append("cabinQuantity", form.cabin.quantity);
//       screenFormData.append("cabinHeight", form.cabin.height);
//       screenFormData.append("cabinWidth", form.cabin.width);
//       screenFormData.append("cabinType", form.cabin.type);

//       await createScreen(screenFormData);
//       await createModule(form.module);
//       await createCabinet(form.cabin);

//       showToast("Screen, module, and cabin created successfully");
//       window.location.reload();
//     } catch (err) {
//       showToast("Error creating screen: " + (err.message || "Unknown error"), "error");
//     }

//     setLoading(false);
//   };

//   const renderSection = (title, children) => (
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold">{title}</h2>
//       <hr className="mb-4" />
//       {children}
//     </div>
//   );

//   const renderScreenFields = () => renderSection("Screen Information", <>
//     <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
//     <div className="mb-4">
//       <DropdownInput
//         name="screenType"
//         value={form.screenType}
//         options={screenTypeOptions}
//         onChange={handleChange}
//         label="Screen Type"
//         required
//       />
//     </div>
//     <Input label="Location" name="location" value={form.location} onChange={handleChange} required />
//     <div className="grid grid-cols-2 gap-4">
//       <Input label="Height" name="height" type="number" value={form.height} onChange={handleChange} />
//       <Input label="Width" name="width" type="number" value={form.width} onChange={handleChange} />
//     </div>

//     {renderSection("Power Supply", <>
//       <Input label="Power Supply Type" name="powerSupply" value={form.powerSupply} onChange={handleChange} />
//       <div className="grid grid-cols-2 gap-4">
//         <Input label="Quantity" name="powerSupplyQuantity" type="number" value={form.powerSupplyQuantity} onChange={handleChange} />
//         <Input label="Spare Quantity" name="sparePowerSupplyQuantity" type="number" value={form.sparePowerSupplyQuantity} onChange={handleChange} />
//       </div>
//     </>)}

//     {renderSection("Receiving Card", <>
//       <Input label="Receiving Card Type" name="receivingCard" value={form.receivingCard} onChange={handleChange} />
//       <div className="grid grid-cols-2 gap-4">
//         <Input label="Quantity" name="receivingCardQuantity" type="number" value={form.receivingCardQuantity} onChange={handleChange} />
//         <Input label="Spare Quantity" name="spareReceivingCardQuantity" type="number" value={form.spareReceivingCardQuantity} onChange={handleChange} />
//       </div>
//     </>)}

//     {renderSection("Files", <>
//       <div className="grid grid-cols-3 gap-4">
//         <div onClick={() => connectionFileRef.current?.click()} className="cursor-pointer">
//           <FileInput
//             ref={connectionFileRef}
//             name="connectionFile"
//             label="Connection File"
//             value={form.connectionFile}
//             onChange={handleChange}
//           />
//         </div>
//         <div onClick={() => configFileRef.current?.click()} className="cursor-pointer">
//           <FileInput
//             ref={configFileRef}
//             name="configFile"
//             label="Config File"
//             value={form.configFile}
//             onChange={handleChange}
//           />
//         </div>
//         <div onClick={() => versionFileRef.current?.click()} className="cursor-pointer">
//           <FileInput
//             ref={versionFileRef}
//             name="versionFile"
//             label="Version File"
//             value={form.versionFile}
//             onChange={handleChange}
//           />
//         </div>
//       </div>
//     </>)}

//     <div className="flex justify-end pt-6">
//       <Button type="button" onClick={nextStep}>Next: Module</Button>
//     </div>
//   </>);

//   const renderModuleFields = () => renderSection("Module Information", <>
//     <Input label="Quantity" name="module_quantity" type="number" value={form.module.quantity} onChange={handleChange} required />
//     <div className="grid grid-cols-2 gap-4">
//       <Input label="Height" name="module_height" type="number" value={form.module.height} onChange={handleChange} />
//       <Input label="Width" name="module_width" type="number" value={form.module.width} onChange={handleChange} />
//     </div>
//     <div className="flex justify-between pt-6">
//       <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>
//       <Button type="button" onClick={nextStep}>Next: Cabin</Button>
//     </div>
//   </>);

//   const renderCabinFields = () => renderSection("Cabin Information", <>
//     <Input label="Quantity" name="cabin_quantity" type="number" value={form.cabin.quantity} onChange={handleChange} required />
//     <div className="grid grid-cols-2 gap-4">
//       <Input label="Height" name="cabin_height" type="number" value={form.cabin.height} onChange={handleChange} />
//       <Input label="Width" name="cabin_width" type="number" value={form.cabin.width} onChange={handleChange} />
//     </div>
//     <Input label="Type" name="cabin_type" value={form.cabin.type} onChange={handleChange} />
//     <div className="flex justify-between pt-6">
//       <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>
//       <Button type="button" onClick={nextStep}>Next: Cables</Button>
//     </div>
//   </>);

//   const renderCableFields = () => renderSection("Cable Information", <>
//     {renderSection("Main Cables", <>
//       <Input label="Main Cable Type" name="cable" value={form.cable} onChange={handleChange} />
//       <div className="grid grid-cols-2 gap-4">
//         <Input label="Quantity" name="cableQuantity" type="number" value={form.cableQuantity} onChange={handleChange} />
//         <Input label="Spare Quantity" name="spareCableQuantity" type="number" value={form.spareCableQuantity} onChange={handleChange} />
//       </div>
//     </>)}

//     {renderSection("Power Cables", <>
//       <Input label="Power Cable Type" name="powerCable" value={form.powerCable} onChange={handleChange} />
//       <div className="grid grid-cols-2 gap-4">
//         <Input label="Quantity" name="powerCableQuantity" type="number" value={form.powerCableQuantity} onChange={handleChange} />
//         <Input label="Spare Quantity" name="sparePowerCableQuantity" type="number" value={form.sparePowerCableQuantity} onChange={handleChange} />
//       </div>
//     </>)}

//     {renderSection("Data Cables", <>
//       <Input label="Data Cable Type" name="dataCable" value={form.dataCable} onChange={handleChange} />
//       <div className="grid grid-cols-2 gap-4">
//         <Input label="Quantity" name="dataCableQuantity" type="number" value={form.dataCableQuantity} onChange={handleChange} />
//         <Input label="Spare Quantity" name="spareDataCableQuantity" type="number" value={form.spareDataCableQuantity} onChange={handleChange} />
//       </div>
//     </>)}

//     <div className="flex justify-between pt-6">
//       <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>
//       <Button type="submit" isLoading={loading}>Create Screen</Button>
//     </div>
//   </>);

//   return (
//     <div className="max-w-3xl mx-auto mt-10">
//       <div className="flex items-center justify-between mb-10 px-4 md:px-12">
//         <StepIndicator stepNumber={1} title="Screen" currentStep={step} />
//         <StepIndicator stepNumber={2} title="Module" currentStep={step} />
//         <StepIndicator stepNumber={3} title="Cabin" currentStep={step} />
//         <StepIndicator stepNumber={4} title="Cables" currentStep={step} />
//       </div>

//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl space-y-6 border border-gray-100">
//         {step === 1 && renderScreenFields()}
//         {step === 2 && renderModuleFields()}
//         {step === 3 && renderCabinFields()}
//         {step === 4 && renderCableFields()}
//       </form>
//     </div>
//   );
// };

// export default AddScreen;