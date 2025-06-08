import React from 'react';
import { Input, Button } from '../../../components';

const ModulesStep = ({ form, errors, onChange, onBack, addModule, removeModule, loading }) => {
  if (form.solutionTypeInScreen === "MODULE_SOLUTION") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Module Information</h2>
          <Button type="button" onClick={addModule} size="sm">Add Module</Button>
        </div>
        <hr className="mb-4" />
        {form.modulesDto.map((module, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg relative">
            {form.modulesDto.length > 1 && (
              <button
                type="button"
                onClick={() => removeModule(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            )}
            <h3 className="font-medium">Module {index + 1}</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Width Quantity"
                name={`moduleDto_${index}_widthQuantity`}
                type="number"
                value={module.widthQuantity}
                onChange={onChange}
                error={errors[`moduleDto_${index}_widthQuantity`]}
                required
              />
              <Input
                label="Height Quantity"
                name={`moduleDto_${index}_heightQuantity`}
                type="number"
                value={module.heightQuantity}
                onChange={onChange}
                error={errors[`moduleDto_${index}_heightQuantity`]}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Height"
                name={`moduleDto_${index}_height`}
                type="number"
                value={module.height}
                onChange={onChange}
                error={errors[`moduleDto_${index}_height`]}
                required
              />
              <Input
                label="Width"
                name={`moduleDto_${index}_width`}
                type="number"
                value={module.width}
                onChange={onChange}
                error={errors[`moduleDto_${index}_width`]}
                required
              />
            </div>
            <Input
              label="Batch Number"
              name={`moduleDto_${index}_moduleBatchNumber`}
              value={module.moduleBatchNumber}
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
      </div>);
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Module Information</h2>
      <hr className="mb-4" />

      {form.cabinets.map((cabinet, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-medium">Module for Cabinet {index + 1}</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Width Quantity"
              name={`moduleDto_${index}_widthQuantity`}
              type="number"
              value={cabinet.moduleDto.widthQuantity}
              onChange={onChange}
              error={errors[`moduleDto_${index}_widthQuantity`]}
              required
            />
            <Input
              label="Height Quantity"
              name={`moduleDto_${index}_heightQuantity`}
              type="number"
              value={cabinet.moduleDto.heightQuantity}
              onChange={onChange}
              error={errors[`moduleDto_${index}_heightQuantity`]}
              required
            />
          </div>
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