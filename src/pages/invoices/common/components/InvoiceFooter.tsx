/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { DebouncedCombobox } from 'components/forms/DebouncedCombobox';
import Toggle from 'components/forms/Toggle';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { InvoiceDocuments } from './InvoiceDocuments';
import { useSetCurrentInvoiceProperty } from '../hooks/useSetCurrentInvoiceProperty';
import { useCurrentCompany } from 'common/hooks/useCurrentCompany';
import { useHandleCustomFieldChange } from 'common/hooks/useHandleCustomFieldChange';
import { MarkdownEditor } from 'components/forms/MarkdownEditor';
import { updateChanges } from 'common/stores/slices/company-users';
import { useDispatch } from 'react-redux';
import { Tab } from '@headlessui/react';
import { Card } from '@invoiceninja/cards';
import { InputLabel, InputField } from '@invoiceninja/forms';
import { useCurrentInvoice } from 'common/hooks/useCurrentInvoice';
import { TabGroup } from 'components/TabGroup';
import { Field } from 'pages/settings/custom-fields/components';
import { Element } from '@invoiceninja/cards';
import { useHandleCustomSurchargeFieldChange } from 'common/hooks/useHandleCustomSurchargeFieldChange';
import { Divider } from 'components/cards/Divider';

export function InvoiceFooter() {
  const [t] = useTranslation();

  const dispatch = useDispatch();
  const company = useCurrentCompany();
  const invoice = useCurrentInvoice();

  const handleChange = useSetCurrentInvoiceProperty();
  const handleCustomFieldChange = useHandleCustomFieldChange();
  const handleCustomSurchargeFieldChange =
    useHandleCustomSurchargeFieldChange();

  const surchargeValue = (index: number) => {
    switch (index) {
      case 0:
        return company?.custom_surcharge_taxes1;
      case 1:
        return company?.custom_surcharge_taxes2;
      case 2:
        return company?.custom_surcharge_taxes3;
      case 3:
        return company?.custom_surcharge_taxes4;
    }
  };

  const setSurchargeTaxValue = (index: number) => {
    switch (index) {
      case 0:
        dispatch(
          updateChanges({
            object: 'company',
            property: 'custom_surcharge_taxes1',
            value: !company?.custom_surcharge_taxes1,
          })
        );
        break;
      case 1:
        dispatch(
          updateChanges({
            object: 'company',
            property: 'custom_surcharge_taxes2',
            value: !company?.custom_surcharge_taxes2,
          })
        );
        break;
      case 2:
        dispatch(
          updateChanges({
            object: 'company',
            property: 'custom_surcharge_taxes3',
            value: !company?.custom_surcharge_taxes3,
          })
        );
        break;
      case 3:
        dispatch(
          updateChanges({
            object: 'company',
            property: 'custom_surcharge_taxes4',
            value: !company?.custom_surcharge_taxes4,
          })
        );
        break;
    }
  };

  return (
    <Card className="col-span-12 xl:col-span-8 h-max px-6">
      <TabGroup
        tabs={[
          t('public_notes'),
          t('private_notes'),
          t('terms'),
          t('footer'),
          t('documents'),
          t('settings'),
          t('custom_fields'),
        ]}
      >
        <Tab.Panel>
          <MarkdownEditor
            value={invoice?.public_notes || ''}
            onChange={(value) => handleChange('public_notes', value)}
          />
        </Tab.Panel>

        <Tab.Panel>
          <MarkdownEditor
            value={invoice?.private_notes || ''}
            onChange={(value) => handleChange('private_notes', value)}
          />
        </Tab.Panel>

        <Tab.Panel>
          <MarkdownEditor
            value={invoice?.terms || ''}
            onChange={(value) => handleChange('terms', value)}
          />
        </Tab.Panel>

        <Tab.Panel>
          <MarkdownEditor
            value={invoice?.footer || ''}
            onChange={(value) => handleChange('footer', value)}
          />
        </Tab.Panel>

        <Tab.Panel>
          <InvoiceDocuments />
        </Tab.Panel>

        <Tab.Panel>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <InputLabel>{t('project')}</InputLabel>
                <DebouncedCombobox
                  endpoint="/api/v1/projects"
                  label="name"
                  onChange={(value) => handleChange('project_id', value.value)}
                  defaultValue={invoice?.project_id}
                />
              </div>

              <InputField
                label={t('exchange_rate')}
                value={invoice?.exchange_rate || '1.00'}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleChange('exchange_rate', parseFloat(event.target.value))
                }
              />

              <Toggle
                label={t('auto_bill_enabled')}
                checked={invoice?.auto_bill_enabled || false}
                onChange={(value) => handleChange('auto_bill_enabled', value)}
              />

              <div className="space-y-2">
                <InputLabel>{t('design')}</InputLabel>

                <DebouncedCombobox
                  endpoint="/api/v1/designs"
                  label="name"
                  placeholder={t('search_designs')}
                  onChange={(payload) =>
                    handleChange('design_id', payload.value)
                  }
                  defaultValue={company?.settings?.invoice_design_id}
                />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <InputLabel>{t('user')}</InputLabel>
                <DebouncedCombobox
                  endpoint="/api/v1/users"
                  label="first_name"
                  onChange={(value) =>
                    handleChange('assigned_user_id', value.value)
                  }
                  defaultValue={invoice?.assigned_user_id}
                />
              </div>

              <div className="space-y-2">
                <InputLabel>{t('vendor')}</InputLabel>
                <DebouncedCombobox
                  endpoint="/api/v1/vendors"
                  label="name"
                  onChange={(value) => handleChange('vendor_id', value.value)}
                  defaultValue={invoice?.vendor_id}
                />
              </div>

              <Toggle
                label={t('inclusive_taxes')}
                checked={invoice?.uses_inclusive_taxes || false}
                onChange={(value) =>
                  handleChange('uses_inclusive_taxes', value)
                }
              />
            </div>
          </div>
        </Tab.Panel>

        <Tab.Panel>
          {company &&
            ['invoice1', 'invoice2', 'invoice3', 'invoice4'].map((field) => (
              <Field
                key={field}
                initialValue={company.custom_fields[field]}
                field={field}
                placeholder={t('invoice_field')}
                onChange={(value: any) => handleCustomFieldChange(field, value)}
                noExternalPadding
              />
            ))}

          <Divider />

          {company &&
            ['surcharge1', 'surcharge2', 'surcharge3', 'surcharge4'].map(
              (field, index) => (
                <Element
                  noExternalPadding
                  key={index}
                  leftSide={
                    <InputField
                      id={field}
                      value={company.custom_fields[field]}
                      placeholder={t('surcharge_field')}
                      onValueChange={(value) =>
                        handleCustomSurchargeFieldChange(field, value)
                      }
                    />
                  }
                >
                  <Toggle
                    label={t('charge_taxes')}
                    checked={surchargeValue(index)}
                    onChange={() => setSurchargeTaxValue(index)}
                  />
                </Element>
              )
            )}
        </Tab.Panel>
      </TabGroup>
    </Card>
  );
}
