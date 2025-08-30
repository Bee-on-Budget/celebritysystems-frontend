import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Input, Button, DropdownInput } from "../../../components";
import { FileInput, SectionContainer } from '../components';

const ScreenStep = ({ form, errors, onChange, onNext }) => {
  const { t } = useTranslation();
  const connectionFileRef = useRef(null);
  const configFileRef = useRef(null);
  const versionFileRef = useRef(null);

  const screenTypeOptions = [
    { value: "IN_DOOR", label: t('screens.options.indoor') },
    { value: "OUT_DOOR", label: t('screens.options.outdoor') }
  ];

  const solutionOptions = [
    { value: "CABINET_SOLUTION", label: t('screens.options.cabinet') },
    { value: "MODULE_SOLUTION", label: t('screens.options.module') }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Screen name */}
      <div className="space-y-2">
        <Input 
          label={t('screens.screenForm.name')} 
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
          label={t('screens.screenForm.screenType')}
          error={errors.screenType}
          required
        />
        <DropdownInput
          name="solutionTypeInScreen"
          value={form.solutionTypeInScreen}
          options={solutionOptions}
          onChange={onChange}
          label={t('screens.screenForm.solution')}
          error={errors.solutionTypeInScreen}
          required
        />
      </div>

      {/* Screen fan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <Input
          label={t('screens.screenForm.screenFan')}
          name="fan"
          value={form.fan}
          onChange={onChange}
          error={errors.fan}
        />
        <Input
          label={t('screens.screenForm.screenFanQuantity')}
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
          label={t('screens.screenForm.location')}
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
          label={t('screens.screenForm.pixelScreen')} 
          name="pixelScreen" 
          type="text" 
          placeholder={t('screens.screenForm.pixelScreenPlaceholder')}
          value={form.pixelScreen} 
          onChange={onChange} 
          error={errors.pixelScreen} 
          required 
        />
      </div>

      {/* Screen Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium capitalize text-dark">
          {t('screens.screenForm.description')}
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder={t('screens.screenForm.descriptionPlaceholder')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-colors"
          rows={3}
        />
      </div>

      {/* Power Supply */}
      <SectionContainer title={t('screens.screenForm.powerSupply')}>
        <div className="space-y-3 sm:space-y-4">
          <Input 
            label={t('screens.screenForm.powerSupplyType')} 
            name="powerSupply" 
            value={form.powerSupply} 
            onChange={onChange} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label={t('screens.screenForm.quantity')}
              name="powerSupplyQuantity"
              type="number"
              value={form.powerSupplyQuantity}
              onChange={onChange}
              error={errors.powerSupplyQuantity}
              required={!!form.powerSupply}
              disabled={!form.powerSupply}
            />
            <Input
              label={t('screens.screenForm.spareQuantity')}
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
      <SectionContainer title={t('screens.screenForm.receivingCard')}>
        <div className="space-y-3 sm:space-y-4">
          <Input 
            label={t('screens.screenForm.receivingCardType')} 
            name="receivingCard" 
            value={form.receivingCard} 
            onChange={onChange} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label={t('screens.screenForm.quantity')}
              name="receivingCardQuantity"
              type="number"
              value={form.receivingCardQuantity}
              onChange={onChange}
              error={errors.receivingCardQuantity}
              disabled={!form.receivingCard}
              required={!!form.receivingCard}
            />
            <Input
              label={t('screens.screenForm.spareQuantity')}
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
      <SectionContainer title={t('screens.screenForm.media')}>
        <div className="space-y-3 sm:space-y-4">
          <Input 
            label={t('screens.screenForm.mediaType')} 
            name="media" 
            value={form.media} 
            onChange={onChange} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label={t('screens.screenForm.quantity')}
              name="mediaQuantity"
              type="number"
              value={form.mediaQuantity}
              onChange={onChange}
              error={errors.mediaQuantity}
              disabled={!form.media}
              required={!!form.media}
            />
            <Input 
              label={t('screens.screenForm.spareMediaQuantity')}
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
      <SectionContainer title={t('screens.screenForm.hub')}>
        <div className="space-y-3 sm:space-y-4">
          <Input 
            label={t('screens.screenForm.hubType')} 
            name="hub" 
            value={form.hub} 
            onChange={onChange} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label={t('screens.screenForm.quantity')}
              name="hubQuantity"
              type="number"
              value={form.hubQuantity}
              onChange={onChange}
              error={errors.hubQuantity}
              disabled={!form.hub}
              required={!!form.hub}
            />
            <Input 
              label={t('screens.screenForm.spareHubQuantity')}
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
      <SectionContainer title={t('screens.screenForm.files')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <FileInput
            ref={connectionFileRef}
            name="connectionFile"
            label={t('screens.screenForm.connectionFile')}
            value={form.connectionFile}
            onChange={onChange}
            error={errors.connectionFile}
          />
          <FileInput
            ref={configFileRef}
            name="configFile"
            label={t('screens.screenForm.configFile')}
            value={form.configFile}
            onChange={onChange}
            error={errors.configFile}
          />
          <div className="sm:col-span-2 lg:col-span-1">
            <FileInput
              ref={versionFileRef}
              name="versionFile"
              label={t('screens.screenForm.versionFile')}
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
          {t('screens.screenForm.nextCables')}
        </Button>
      </div>
    </div>
  );
};

export default ScreenStep;