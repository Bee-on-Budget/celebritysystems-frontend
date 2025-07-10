import React from 'react';
import { Button, Input } from '../../../components';

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
            label="Name"
            name={`cabinet_${index}_cabinetName`}
            value={cabinet.cabinetName}
            onChange={onChange}
            error={errors[`cabinet_${index}_cabinetName`]}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Height Quantity"
              name={`cabinet_${index}_heightQuantity`}
              type="number"
              value={cabinet.heightQuantity}
              onChange={onChange}
              error={errors[`cabinet_${index}_heightQuantity`]}
              required
            />
            <Input
              label="Width Quantity"
              name={`cabinet_${index}_widthQuantity`}
              type="number"
              value={cabinet.widthQuantity}
              onChange={onChange}
              error={errors[`cabinet_${index}_widthQuantity`]}
              required
            />
          </div>
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
          <div className="grid grid-cols-2 gap-4">
            <input
            name={`cabinet_${index}_isWidth`}
            type='checkbox'
            checked={cabinet.isWidth}
            onChange={onChange}
            /> <span>Is Width</span>
            <input
            name={`cabinet_${index}_isHeight`}
            type='checkbox'
            checked={cabinet.isHeight}
            onChange={onChange}
            /> <span>Is Height</span>
          </div>
        </div>
      ))}

      <div className="flex justify-between pt-6">
        <Button type="button" variant="ghost" onClick={onBack}>Back</Button>
        <Button
          type={form.solutionTypeInScreen === "MODULE_SOLUTION" ? "submit" : "button"}
          onClick={onNext}
          isLoading={loading}
        >
          {form.solutionTypeInScreen === "MODULE_SOLUTION" ? "Create Screen" : "Next: Module"}
        </Button>
      </div>
    </div>);
};

export default CabinetsStep;