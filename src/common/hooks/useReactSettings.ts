/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { RootState } from '$app/common/stores/store';
import { useSelector } from 'react-redux';
import { useInjectUserChanges } from './useInjectUserChanges';
import { merge } from 'lodash';

export type ChartsDefaultView = 'day' | 'week' | 'month';

export interface ReactSettings {
  show_pdf_preview: boolean;
  react_table_columns?: Record<ReactTableColumns, string[]>;
  react_notification_link: boolean;
  preferences: {
    dashboard_charts: {
      default_view: 'day' | 'week' | 'month';
      range: string;
      currency: number;
    };
    datatables: {
      clients: {
        sort: string;
      };
    };
  };
}

export type ReactTableColumns =
  | 'invoice'
  | 'client'
  | 'product'
  | 'recurringInvoice'
  | 'payment'
  | 'quote'
  | 'credit'
  | 'project'
  | 'task'
  | 'vendor'
  | 'purchaseOrder'
  | 'expense'
  | 'recurringExpense';

export function useReactSettings() {
  const user = useInjectUserChanges();

  const reactSettings =
    useSelector(
      (state: RootState) => state.user.changes?.company_user?.react_settings
    ) || {};

  const previousReactTableColumns =
    user?.company_user?.settings?.react_table_columns;

  const settings: ReactSettings = {
    show_pdf_preview: true,
    react_notification_link: true,
    // This is legacy fallback for old settings location. If you see this in 2 years, feel free to remove it.
    react_table_columns: {
      ...previousReactTableColumns,
      ...reactSettings.react_table_columns,
    },
    preferences: {
      dashboard_charts: {
        default_view: 'month',
        currency: 1,
        range: 'last_7_days',
      },
      datatables: {
        clients: {
          sort: 'id|desc',
        },
      },
    },
  };

  return merge<ReactSettings, ReactSettings>(
    { ...settings },
    { ...reactSettings }
  );
}
