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
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Screen name */}
      <div className="space-y-2">
        <Input 
          label="Name" 
          name="name" 
          value={form.name} 
          onChange={onChange} 
          error={errors.name} 
          required 
        />
      </div>

      {/* Screen type & Solution type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <Input
          label="Screen Fan"
          name="fan"
          value={form.fan}
          onChange={onChange}
          error={errors.fan}
        />
        <Input
          label="Screen Fan Quantity"
          name="fanQuantity"
          type="number"
          value={form.fanQuantity}
          onChange={onChange}
          error={errors.fanQuantity}
          disabled={!form.fan}
          required={!!form.fan}
        />
      </div>

      {/* Screen Location */}
      <div className="space-y-2">
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
      </div>

      {/* Screen pixelScreen */}
      <div className="space-y-2">
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
      </div>

      {/* Screen Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium capitalize text-dark">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Enter screen description (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-colors"
          rows={3}
        />
      </div>

      {/* Power Supply */}
      <SectionContainer title="Power Supply">
        <div className="space-y-3 sm:space-y-4">
          <Input 
            label="Power Supply Type" 
            name="powerSupply" 
            value={form.powerSupply} 
            onChange={onChange} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
              type="number" 
              value={form.sparePowerSupplyQuantity}
              onChange={onChange}
              disabled={!form.powerSupply}
            />
          </div>
        </div>
      </SectionContainer>

      {/* Receiving card */}
      <SectionContainer title="Receiving Card">
        <div className="space-y-3 sm:space-y-4">
          <Input 
            label="Receiving Card Type" 
            name="receivingCard" 
            value={form.receivingCard} 
            onChange={onChange} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
              type="number" 
              value={form.spareReceivingCardQuantity}
              onChange={onChange}
              disabled={!form.receivingCard}
            />
          </div>
        </div>
      </SectionContainer>

      {/* Media */}
      <SectionContainer title="Media">
        <div className="space-y-3 sm:space-y-4">
          <Input 
            label="Media Type" 
            name="media" 
            value={form.media} 
            onChange={onChange} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            <Input 
              label="Spare Media Quantity"
              name="spareMediaQuantity"
              type="number"
              value={form.spareMediaQuantity}
              onChange={onChange}
              disabled={!form.media} 
            />
          </div>
        </div>
      </SectionContainer>

      {/* Hub */}
      <SectionContainer title="Hub">
        <div className="space-y-3 sm:space-y-4">
          <Input 
            label="Hub Type" 
            name="hub" 
            value={form.hub} 
            onChange={onChange} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label="Quantity"
              name="hubQuantity"
              type="number"
              value={form.hubQuantity}
              onChange={onChange}
              error={errors.hubQuantity}
              disabled={!form.hub}
              required={!!form.hub}
            />
            <Input 
              label="Spare Quantity"
              name="spareHubQuantity"
              type="number" 
              value={form.spareHubQuantity}
              onChange={onChange}
              error={errors.spareHubQuantity}
              disabled={!form.hub} 
            />
          </div>
        </div>
      </SectionContainer>

      {/* Files */}
      <SectionContainer title="Files">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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
          <div className="sm:col-span-2 lg:col-span-1">
            <FileInput
              ref={versionFileRef}
              name="versionFile"
              label="Version File"
              value={form.versionFile}
              onChange={onChange}
              error={errors.versionFile}
            />
          </div>
        </div>
      </SectionContainer>

      {/* Next Button */}
      <div className="flex justify-end pt-4 sm:pt-6 border-t border-gray-200">
        <Button 
          type="button" 
          onClick={onNext}
          className="w-full sm:w-auto min-w-[120px]"
        >
          Next: Cables
        </Button>
      </div>
    </div>
  );
};

export default ScreenStep;