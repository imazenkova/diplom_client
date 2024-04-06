import { useEffect } from 'react';
import { AddMenuItem, useHeaderFooterContext } from '../components/layout/HeaderFooterContext';

export interface UseHeaderMenuProps {
  items: AddMenuItem[];
}

export interface UseFooterMenuProps {
  items: AddMenuItem[];
}

export const useHeaderMenu = ({ items }: UseHeaderMenuProps): (items: AddMenuItem[]) => void => {
  const { addHeaderMenu, removeHeaderMenu, updateHeaderMenu } = useHeaderFooterContext();
  const itemKeysToRemove = items.map(item => item.key);

  useEffect(() => {
    addHeaderMenu(items);

    return () => {
      removeHeaderMenu(itemKeysToRemove);
    };
  }, []);
  return updateHeaderMenu
}

export const useFooterMenu = ({ items }: UseFooterMenuProps): (items: AddMenuItem[]) => void => {
  const { addFooterMenu, removeFooterMenu, updateFooterMenu } = useHeaderFooterContext();
  const itemKeysToRemove = items.map(item => item.key);

  useEffect(() => {
    addFooterMenu(items);

    return () => {
      removeFooterMenu(itemKeysToRemove);
    };
  }, []);

  return updateFooterMenu
}
