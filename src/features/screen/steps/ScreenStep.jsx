import { useRef } from "react";
import { Input, Button, DropdownInput } from "../../../components";
import { FileInput, SectionContainer } from '../components';

const ScreenStep = ({ form, errors, onChange, onNext }) => {
  const connectionFileRef = useRef(null);
  const configFileRef = useRef(null);
  const versionFileRef = useRef(null);

  const screenTypeOptions = [
    { value: "IN_DOOR", label: "Indoor" },
    { value: "OUT_DOOR", label: "Outdoor" }
  ];

  const solutionOptions = [
    { value: "CABINET_SOLUTION", label: "Cabinet" },
    { value: "MODULE_SOLUTION", label: "Module" }
  ];

  return (
    <>
      {/* Screen name */}
      <Input label="Name" name="name" value={form.name} onChange={onChange} error={errors.name} required />

      {/* Screen type & Solution type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DropdownInput
          name="screenType"
          value={form.screenType}
          options={screenTypeOptions}
          onChange={onChange}
          label="Screen Type"
          error={errors.screenType}
          required
        />
        <DropdownInput
          name="solutionTypeInScreen"
          value={form.solutionTypeInScreen}
          options={solutionOptions}
          onChange={onChange}
          label="Solution"
          error={errors.solutionTypeInScreen}
          required
        />
      </div>

      {/* Screen fan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Screen Fan"
          name="fan"
          value={form.fan}
          onChange={onChange}
          error={errors.fan}
          required={form.solutionTypeInScreen === "CABINET_SOLUTION"}
          disabled={form.solutionTypeInScreen === "MODULE_SOLUTION"}
        />

        <Input
          label="Screen Fan Quantity"
          name="fanQuantity"
          value={form.fanQuantity}
          onChange={onChange}
          error={errors.fanQuantity}
          required={form.solutionTypeInScreen === "CABINET_SOLUTION"}
          disabled={form.solutionTypeInScreen === "MODULE_SOLUTION"}
        />
      </div>

      {/* Screen Location */}
      <Input
        label="Location (Google Maps Link)"
        name="location"
        type="url"
        placeholder="https://www.google.com/maps/place/..."
        value={form.location}
        onChange={onChange}
        error={errors.location}
        required
      />

      {/* Screen pixelScreen */}
      <Input 
        label="Pixel Screen" 
        name="pixelScreen" 
        type="text" 
        placeholder="e.g., 1920x1080, 3840x2160"
        value={form.pixelScreen} 
        onChange={onChange} 
        error={errors.pixelScreen} 
        required 
      />

      {/* Screen Description */}
      <div className="space-y-1">
        <label className="block text-sm font-medium capitalize text-dark">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Enter screen description (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          rows={3}
        />
      </div>

      {/* Power Supply */}
      <SectionContainer title={"Power Supply"}>
        <Input label="Power Supply Type" name="powerSupply" value={form.powerSupply} onChange={onChange} />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantity"
            name="powerSupplyQuantity"
            type="number"
            value={form.powerSupplyQuantity}
            onChange={onChange}
            error={errors.powerSupplyQuantity}
            required={!!form.powerSupply}
            disabled={!form.powerSupply}
          />
          <Input
            label="Spare Quantity"
            name="sparePowerSupplyQuantity"
            type="number" value={form.sparePowerSupplyQuantity}
            onChange={onChange}
            disabled={!form.powerSupply}
          />
        </div>
      </SectionContainer>

      {/* Receiving card */}
      <SectionContainer title="Receiving Card">
        <Input label="Receiving Card Type" name="receivingCard" value={form.receivingCard} onChange={onChange} />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantity"
            name="receivingCardQuantity"
            type="number"
            value={form.receivingCardQuantity}
            onChange={onChange}
            error={errors.receivingCardQuantity}
            disabled={!form.receivingCard}
            required={!!form.receivingCard}
          />
          <Input
            label="Spare Quantity"
            name="spareReceivingCardQuantity"
            type="number" value={form.spareReceivingCardQuantity}
            onChange={onChange}
            disabled={!form.receivingCard}
          />
        </div>
      </SectionContainer>

      {/* Media */}
      <SectionContainer title="Media">
        <Input label="Media Type" name="media" value={form.media} onChange={onChange} />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantity"
            name="mediaQuantity"
            type="number"
            value={form.mediaQuantity}
            onChange={onChange}
            error={errors.mediaQuantity}
            disabled={!form.media}
            required={!!form.media}
          />
          <Input label="Spare Media Quantity"
            name="spareMediaQuantity"
            type="number"
            value={form.spareMediaQuantity}
            onChange={onChange}
            disabled={!form.media} />
        </div>
      </SectionContainer>

      {/* Files */}
      <SectionContainer title="Files">
        <div className="grid grid-cols-3 gap-4">
          <FileInput
            ref={connectionFileRef}
            name="connectionFile"
            label="Connection File"
            value={form.connectionFile}
            onChange={onChange}
            error={errors.connectionFile}
          />
          <FileInput
            ref={configFileRef}
            name="configFile"
            label="Config File"
            value={form.configFile}
            onChange={onChange}
            error={errors.configFile}
          />
          <FileInput
            ref={versionFileRef}
            name="versionFile"
            label="Version File"
            value={form.versionFile}
            onChange={onChange}
            error={errors.versionFile}
          />
        </div>
      </SectionContainer>
      <div className="flex justify-end pt-6">
        <Button type="button" onClick={onNext}>Next: Cables</Button>
      </div>
    </>
  );
};

export default ScreenStep;