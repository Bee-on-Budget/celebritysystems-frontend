import React from 'react';
import { Input, Button } from '../../../components';
import { SectionContainer } from '../components';

const CablesStep = ({ form, errors, onChange, onNext, onBack }) => {
  return (
    <SectionContainer title="Cable Information">
      <SectionContainer title="Main Cables">
        <Input label="Main Cable Type" name="cable" value={form.cable} onChange={onChange} />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantity"
            name="cableQuantity"
            type="number"
            value={form.cableQuantity}
            onChange={onChange}
            error={errors.cableQuantity}
            required={!!form.cable}
          />
          <Input label="Spare Quantity" name="spareCableQuantity" type="number" value={form.spareCableQuantity} onChange={onChange} />
        </div>
      </SectionContainer>

      <SectionContainer title="Power Cables">
        <Input label="Power Cable Type" name="powerCable" value={form.powerCable} onChange={onChange} />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantity"
            name="powerCableQuantity"
            type="number"
            value={form.powerCableQuantity}
            onChange={onChange}
            error={errors.powerCableQuantity}
            required={!!form.powerCable}
          />
          <Input label="Spare Quantity" name="sparePowerCableQuantity" type="number" value={form.sparePowerCableQuantity} onChange={onChange} />
        </div>
      </SectionContainer>

      <SectionContainer title="Data Cables">
        <Input label="Data Cable Type" name="dataCable" value={form.dataCable} onChange={onChange} />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantity"
            name="dataCableQuantity"
            type="number"
            value={form.dataCableQuantity}
            onChange={onChange}
            error={errors.dataCableQuantity}
            required={!!form.dataCable}
          />
          <Input label="Spare Quantity" name="spareDataCableQuantity" type="number" value={form.spareDataCableQuantity} onChange={onChange} />
        </div>
      </SectionContainer>

      <div className="flex justify-between pt-6">
        <Button type="button" variant="ghost" onClick={onBack}>Back</Button>
        <Button type="button" onClick={onNext}>Next: Cabinets</Button>
      </div>
    </SectionContainer>
  );
};

export default CablesStep;