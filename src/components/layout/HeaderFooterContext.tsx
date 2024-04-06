import React, { ReactNode, useState, useContext, useCallback } from 'react';


export interface AddMenuItem {
  key: string,
  idx?: number, // Сделали idx необязательным
  val: ReactNode;
}

export interface HeaderFooterContextProps {
  headerMenu: AddMenuItem[];
  addHeaderMenu: (items: AddMenuItem[]) => void;
  removeHeaderMenu: (keys: string[]) => void;
  updateHeaderMenu: (items: AddMenuItem[]) => void;
  footerMenu: AddMenuItem[];
  addFooterMenu: (items: AddMenuItem[]) => void;
  removeFooterMenu: (keys: string[]) => void;
  updateFooterMenu: (items: AddMenuItem[]) => void;
}

export const HeaderFooterContext = React.createContext<HeaderFooterContextProps | undefined>(undefined);

export const HeaderFooterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [headerMenuMap, setHeaderMenuMap] = useState<Map<string, AddMenuItem>>(new Map());
  const [footerMenuMap, setFooterMenuMap] = useState<Map<string, AddMenuItem>>(new Map());

  const addMenuItems = useCallback((setMap: React.Dispatch<React.SetStateAction<Map<string, AddMenuItem>>>, items: AddMenuItem[]) => {
    setMap((prevMap) => {
      const newMap = new Map(prevMap);
      items.forEach(item => newMap.set(item.key, item));
      return new Map([...Array.from(newMap.entries())].sort((a, b) => (a[1].idx || 0) - (b[1].idx || 0)));
    });
  }, []);

  const updateMenuItems = useCallback((setMap: React.Dispatch<React.SetStateAction<Map<string, AddMenuItem>>>, items: AddMenuItem[]) => {
    setMap((prevMap) => {
      const newMap = new Map(prevMap);
      items.forEach(item => {
        if(newMap.has(item.key)) {
          newMap.set(item.key, item);
        }
      });
      return newMap;
    });
  }, []);

  const removeMenuItem = useCallback((setMap: React.Dispatch<React.SetStateAction<Map<string, AddMenuItem>>>, keys: string[]) => {
    setMap((prevMap) => {
      const newMap = new Map(prevMap);
      for (let i = 0; i < keys.length; i++) {
        newMap.delete(keys[i]);
      }
      return newMap;
    });
  }, []);

  const addHeaderMenu = useCallback((items: AddMenuItem[]) => addMenuItems(setHeaderMenuMap, items), [addMenuItems]);
  const addFooterMenu = useCallback((items: AddMenuItem[]) => addMenuItems(setFooterMenuMap, items), [addMenuItems]);

  const removeHeaderMenu = useCallback((keys: string[]) => removeMenuItem(setHeaderMenuMap, keys), [removeMenuItem]);
  const removeFooterMenu = useCallback((keys: string[]) => removeMenuItem(setFooterMenuMap, keys), [removeMenuItem]);

  const updateHeaderMenu = useCallback((items: AddMenuItem[]) => updateMenuItems(setHeaderMenuMap, items), [updateMenuItems]);
  const updateFooterMenu = useCallback((items: AddMenuItem[]) => updateMenuItems(setFooterMenuMap, items), [updateMenuItems]);

  const headerMenu = Array.from(headerMenuMap.values());
  const footerMenu = Array.from(footerMenuMap.values());

  return (
    <HeaderFooterContext.Provider value={{ headerMenu, addHeaderMenu, removeHeaderMenu, updateHeaderMenu, footerMenu, addFooterMenu, removeFooterMenu, updateFooterMenu }}>
      {children}
    </HeaderFooterContext.Provider>
  );
}

export function useHeaderFooterContext() {
  const context = useContext(HeaderFooterContext);
  if (!context) {
    throw new Error('useHeaderFooterContext must be used within a HeaderFooterProvider');
  }
  return context;
}
