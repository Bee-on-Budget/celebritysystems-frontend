import React from 'react';
import { Input, Button } from '../../../components';
import { SectionContainer } from '../components';

const CablesStep = ({ form, errors, onChange, onNext, onBack }) => {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <SectionContainer title="Cable Information">
        <div className="space-y-4 sm:space-y-6">
          {/* Main Cables */}
          <SectionContainer title="Main Cables">
            <div className="space-y-3 sm:space-y-4">
              <Input 
                label="Main Cable Type" 
                name="cable" 
                value={form.cable} 
                onChange={onChange} 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Quantity"
                  name="cableQuantity"
                  type="number"
                  value={form.cableQuantity}
                  onChange={onChange}
                  error={errors.cableQuantity}
                  required={!!form.cable}
                  disabled={!form.cable}
                />
                <Input
                  label="Spare Quantity"
                  name="spareCableQuantity"
                  type="number"
                  value={form.spareCableQuantity}
                  onChange={onChange}
                  disabled={!form.cable}
                />
              </div>
            </div>
          </SectionContainer>

          {/* Power Cables */}
          <SectionContainer title="Power Cables">
            <div className="space-y-3 sm:space-y-4">
              <Input 
                label="Power Cable Type" 
                name="powerCable" 
                value={form.powerCable} 
                onChange={onChange} 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Quantity"
                  name="powerCableQuantity"
                  type="number"
                  value={form.powerCableQuantity}
                  onChange={onChange}
                  error={errors.powerCableQuantity}
                  required={!!form.powerCable}
                  disabled={!form.powerCable}
                />
                <Input
                  label="Spare Quantity"
                  name="sparePowerCableQuantity"
                  type="number"
                  value={form.sparePowerCableQuantity}
                  onChange={onChange}
                  disabled={!form.powerCable}
                />
              </div>
            </div>
          </SectionContainer>

          {/* Data Cables */}
          <SectionContainer title="Data Cables">
            <div className="space-y-3 sm:space-y-4">
              <Input 
                label="Data Cable Type" 
                name="dataCable" 
                value={form.dataCable} 
                onChange={onChange} 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Input
                  label="Quantity"
                  name="dataCableQuantity"
                  type="number"
                  value={form.dataCableQuantity}
                  onChange={onChange}
                  error={errors.dataCableQuantity}
                  required={!!form.dataCable}
                  disabled={!form.dataCable}
                />
                <Input
                  label="Spare Quantity"
                  name="spareDataCableQuantity"
                  type="number"
                  value={form.spareDataCableQuantity}
                  onChange={onChange}
                  disabled={!form.dataCable}
                />
              </div>
            </div>
          </SectionContainer>
        </div>
      </SectionContainer>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onBack}
          className="w-full sm:w-auto min-w-[100px] order-2 sm:order-1"
        >
          Back
        </Button>
        <Button 
          type="button" 
          onClick={onNext}
          className="w-full sm:w-auto min-w-[140px] order-1 sm:order-2"
        >
          Next: Cabinets
        </Button>
      </div>
    </div>
  );
};

export default CablesStep;