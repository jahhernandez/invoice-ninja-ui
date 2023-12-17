/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { Button } from './forms';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {
  blockedNavigationActionAtom,
  isNavigationModalVisibleAtom,
} from '$app/common/hooks/usePreventNavigation';
import { preventLeavingPageAtom } from '$app/App';
import { useNavigate } from 'react-router-dom';

export function PreventNavigationModal() {
  const [t] = useTranslation();
  const navigate = useNavigate();

  const blockedNavigationAction = useAtomValue(blockedNavigationActionAtom);

  const setPreventLeavingPage = useSetAtom(preventLeavingPageAtom);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [isNavigationModalVisible, setIsNavigationModalVisible] = useAtom(
    isNavigationModalVisibleAtom
  );

  const handleDiscardChanges = () => {
    setPreventLeavingPage({ prevent: false, actionKey: undefined });
    setIsNavigationModalVisible(false);

    if (blockedNavigationAction) {
      const { url, externalLink, fn } = blockedNavigationAction;

      if (url) {
        if (url === 'back') {
          navigate(-1);
        } else {
          if (externalLink) {
            window.open(url, '_blank');
          } else {
            navigate(url);
          }
        }
      }

      fn?.();
    }
  };

  useEffect(() => {
    setIsModalVisible(isNavigationModalVisible);
  }, [isNavigationModalVisible]);

  return (
    <Modal visible={isModalVisible} onClose={() => {}} disableClosing>
      <div className="flex flex-col space-y-8">
        <span className="font-medium text-lg text-center">
          {t('error_unsaved_changes')}
        </span>

        <div className="flex justify-between">
          <Button
            type="secondary"
            onClick={() => setIsNavigationModalVisible(false)}
          >
            {t('continue_editing')}
          </Button>
          <Button onClick={handleDiscardChanges}>{t('discard_changes')}</Button>
        </div>
      </div>
    </Modal>
  );
}
