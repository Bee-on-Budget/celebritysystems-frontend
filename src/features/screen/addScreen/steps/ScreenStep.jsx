import { useRef } from "react";
import Input from '../../../../components/Input';
import DropdownInput from '../../../../components/DropdownInput';
import Button from '../../../../components/Button';
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
    { value: "Cabinet", label: "Cabinet" },
    { value: "Module", label: "Module" }
  ];

  return (
    <>
      <Input label="Name" name="name" value={form.name} onChange={onChange} error={errors.name} required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DropdownInput
          name="solution"
          value={form.solution}
          options={solutionOptions}
          onChange={onChange}
          label="Solution"
          error={errors.solution}
          required
        />
        <Input
          label="Screen Fan"
          name="screenFan"
          value={form.screenFan}
          onChange={onChange}
          error={errors.screenFan}
          required={form.solution === "Cabinet"}
          disabled={form.solution === "Module"}
        />
      </div>
      <DropdownInput
        name="screenType"
        value={form.screenType}
        options={screenTypeOptions}
        onChange={onChange}
        label="Screen Type"
        error={errors.screenType}
        required
      />

      <Input label="Location" name="location" value={form.location} onChange={onChange} error={errors.location} required />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Height" name="height" type="number" value={form.height} onChange={onChange} error={errors.height} required />
        <Input label="Width" name="width" type="number" value={form.width} onChange={onChange} error={errors.width} required />
      </div>

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
          />
          <Input label="Spare Quantity" name="sparePowerSupplyQuantity" type="number" value={form.sparePowerSupplyQuantity} onChange={onChange} />
        </div>
      </SectionContainer>

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
            required={!!form.receivingCard}
          />
          <Input label="Spare Quantity" name="spareReceivingCardQuantity" type="number" value={form.spareReceivingCardQuantity} onChange={onChange} />
        </div>
      </SectionContainer>

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