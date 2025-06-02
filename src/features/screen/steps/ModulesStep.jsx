import React from 'react';
import { Input, Button } from '../../../components';

const ModulesStep = ({ form, errors, onChange, onBack, loading }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Module Information</h2>
      <hr className="mb-4" />

      {form.cabinets.map((cabinet, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-medium">Module for Cabinet {index + 1}</h3>
          <Input
            label="Quantity"
            name={`moduleDto_${index}_quantity`}
            type="number"
            value={cabinet.moduleDto.quantity}
            onChange={onChange}
            error={errors[`moduleDto_${index}_quantity`]}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Height"
              name={`moduleDto_${index}_height`}
              type="number"
              value={cabinet.moduleDto.height}
              onChange={onChange}
              error={errors[`moduleDto_${index}_height`]}
              required
            />
            <Input
              label="Width"
              name={`moduleDto_${index}_width`}
              type="number"
              value={cabinet.moduleDto.width}
              onChange={onChange}
              error={errors[`moduleDto_${index}_width`]}
              required
            />
          </div>
          <Input
            label="Batch Number"
            name={`moduleDto_${index}_moduleBatchNumber`}
            value={cabinet.moduleDto.moduleBatchNumber}
            onChange={onChange}
            error={errors[`moduleDto_${index}_moduleBatchNumber`]}
            required
          />
        </div>
      ))}

      <div className="flex justify-between pt-6">
        <Button type="button" variant="ghost" onClick={onBack}>Back</Button>
        <Button type="submit" isLoading={loading}>Create Screen</Button>
      </div>
    </div>
  );
};

export default ModulesStep;