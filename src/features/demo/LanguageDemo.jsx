import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../components';

const LanguageDemo = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('language.switchLanguage')}
        </h1>
        <LanguageSwitcher />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ticket Form Demo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t('tickets.createTicket')}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('tickets.ticketForm.title')}*
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('tickets.ticketForm.titlePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('tickets.ticketForm.serviceType')}*
              </label>
              <select className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">{t('tickets.placeholders.selectServiceType')}</option>
                <option value="REGULAR_SERVICE">{t('tickets.serviceTypes.REGULAR_SERVICE')}</option>
                <option value="EMERGENCY_SERVICE">{t('tickets.serviceTypes.EMERGENCY_SERVICE')}</option>
                <option value="PREVENTIVE_MAINTENANCE">{t('tickets.serviceTypes.PREVENTIVE_MAINTENANCE')}</option>
                <option value="CALL_BACK_SERVICE">{t('tickets.serviceTypes.CALL_BACK_SERVICE')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('tickets.ticketForm.description')}*
              </label>
              <textarea
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder={t('tickets.ticketForm.descriptionPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('tickets.ticketForm.status')}
              </label>
              <select className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">{t('tickets.placeholders.selectStatus')}</option>
                <option value="OPEN">{t('tickets.statuses.OPEN')}</option>
                <option value="IN_PROGRESS">{t('tickets.statuses.IN_PROGRESS')}</option>
                <option value="PENDING">{t('tickets.statuses.PENDING')}</option>
                <option value="RESOLVED">{t('tickets.statuses.RESOLVED')}</option>
                <option value="CLOSED">{t('tickets.statuses.CLOSED')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ticket List Demo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t('tickets.ticketList')}
          </h2>
          
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">
                  {t('tickets.ticketNumber', { number: '001' })}
                </h3>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  {t('tickets.statuses.OPEN')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {t('tickets.ticketForm.title')}: {t('tickets.ticketForm.titlePlaceholder')}
              </p>
              <p className="text-sm text-gray-500">
                {t('tickets.ticketForm.serviceType')}: {t('tickets.serviceTypes.REGULAR_SERVICE')}
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">
                  {t('tickets.ticketNumber', { number: '002' })}
                </h3>
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  {t('tickets.statuses.PENDING')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {t('tickets.ticketForm.title')}: {t('tickets.ticketForm.titlePlaceholder')}
              </p>
              <p className="text-sm text-gray-500">
                {t('tickets.ticketForm.serviceType')}: {t('tickets.serviceTypes.EMERGENCY_SERVICE')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Common Actions Demo */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {t('common.actions')}
        </h2>
        
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            {t('common.create')}
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            {t('common.save')}
          </button>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
            {t('common.edit')}
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            {t('common.delete')}
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
            {t('common.cancel')}
          </button>
        </div>
      </div>

      {/* Navigation Demo */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {t('navigation.dashboard')}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">25</div>
            <div className="text-sm text-gray-600">{t('tickets.title')}</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">{t('navigation.companies')}</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">8</div>
            <div className="text-sm text-gray-600">{t('navigation.screens')}</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">15</div>
            <div className="text-sm text-gray-600">{t('navigation.contracts')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageDemo;


