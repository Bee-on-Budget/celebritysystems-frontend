import React from 'react';
import { Button, Input } from '../../../../components';

const CabinetsStep = ({
  form,
  errors,
  onChange,
  onBack,
  onNext,
  addCabinet,
  removeCabinet,
  loading
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Cabinet Information</h2>
        <Button type="button" onClick={addCabinet} size="sm">Add Cabinet</Button>
      </div>
      <hr className="mb-4" />

      {form.cabinets.map((cabinet, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg relative">
          {form.cabinets.length > 1 && (
            <button
              type="button"
              onClick={() => removeCabinet(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          )}
          <h3 className="font-medium">Cabinet {index + 1}</h3>
          <Input
            label="Quantity"
            name={`cabinet_${index}_quantity`}
            type="number"
            value={cabinet.quantity}
            onChange={onChange}
            error={errors[`cabinet_${index}_quantity`]}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Height"
              name={`cabinet_${index}_height`}
              type="number"
              value={cabinet.height}
              onChange={onChange}
              error={errors[`cabinet_${index}_height`]}
              required
            />
            <Input
              label="Width"
              name={`cabinet_${index}_width`}
              type="number"
              value={cabinet.width}
              onChange={onChange}
              error={errors[`cabinet_${index}_width`]}
              required
            />
          </div>
          <Input
            label="Type"
            name={`cabinet_${index}_type`}
            value={cabinet.type}
            onChange={onChange}
            error={errors[`cabinet_${index}_type`]}
            required
          />
        </div>
      ))}

      <div className="flex justify-between pt-6">
        <Button type="button" variant="ghost" onClick={onBack}>Back</Button>
        <Button
          type={form.solution === "Cabinet" ? "submit" : "button"}
          onClick={form.solution === "Cabinet" ? null : onNext}
          isLoading={loading}
        >
          {form.solution === "Cabinet" ? "Create Screen" : "Next: Module"}
        </Button>
      </div>
    </div>);
};

export default CabinetsStep;