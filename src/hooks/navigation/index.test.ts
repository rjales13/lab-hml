import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useNavigation } from './index';
import { NAVIGATION_ITENS } from './itens';
import type { iNavigation } from '@/models/navigation';

describe('useNavigation', () => {
  it('maps navigation items to button responses', () => {
    const navigationItems: iNavigation[] = [
      { nav: 'home', applyDisable: false },
      { nav: 'salvar', applyDisable: true },
    ];

    const { result } = renderHook(() => useNavigation(navigationItems));

    expect(result.current.navigationButtons).toHaveLength(2);
  });

  it('includes button name from NAVIGATION_ITENS', () => {
    const navigationItems: iNavigation[] = [{ nav: 'home', applyDisable: false }];

    const { result } = renderHook(() => useNavigation(navigationItems));

    expect(result.current.navigationButtons[0].name).toBe(
      NAVIGATION_ITENS.home.name
    );
  });

  it('includes button type from NAVIGATION_ITENS', () => {
    const navigationItems: iNavigation[] = [{ nav: 'salvar', applyDisable: false }];

    const { result } = renderHook(() => useNavigation(navigationItems));

    expect(result.current.navigationButtons[0].type).toBe(
      NAVIGATION_ITENS.salvar.type
    );
  });

  it('includes button icon from NAVIGATION_ITENS', () => {
    const navigationItems: iNavigation[] = [{ nav: 'deletar', applyDisable: false }];

    const { result } = renderHook(() => useNavigation(navigationItems));

    expect(result.current.navigationButtons[0].icon).toBe(
      NAVIGATION_ITENS.deletar.icon
    );
  });

  it('includes applyDisable property', () => {
    const navigationItems: iNavigation[] = [
      { nav: 'home', applyDisable: true },
    ];

    const { result } = renderHook(() => useNavigation(navigationItems));

    expect(result.current.navigationButtons[0].applyDisable).toBe(true);
  });

  it('includes action property when provided', () => {
    const navigationItems: iNavigation[] = [
      { nav: 'home', applyDisable: false, action: 'custom-action' },
    ];

    const { result } = renderHook(() => useNavigation(navigationItems));

    expect(result.current.navigationButtons[0].action).toBe('custom-action');
  });

  it('handles empty navigation array', () => {
    const navigationItems: iNavigation[] = [];

    const { result } = renderHook(() => useNavigation(navigationItems));

    expect(result.current.navigationButtons).toHaveLength(0);
  });

  it('maps multiple navigation items in correct order', () => {
    const navigationItems: iNavigation[] = [
      { nav: 'voltar', applyDisable: false },
      { nav: 'salvar', applyDisable: false },
      { nav: 'deletar', applyDisable: true },
    ];

    const { result } = renderHook(() => useNavigation(navigationItems));

    expect(result.current.navigationButtons).toHaveLength(3);
    expect(result.current.navigationButtons[0].name).toBe(
      NAVIGATION_ITENS.voltar.name
    );
    expect(result.current.navigationButtons[1].name).toBe(
      NAVIGATION_ITENS.salvar.name
    );
    expect(result.current.navigationButtons[2].name).toBe(
      NAVIGATION_ITENS.deletar.name
    );
  });

  it('memoizes navigationButtons result', () => {
    const navigationItems: iNavigation[] = [{ nav: 'home', applyDisable: false }];

    const { result, rerender } = renderHook(() =>
      useNavigation(navigationItems)
    );

    const firstResult = result.current.navigationButtons;

    rerender();

    expect(result.current.navigationButtons).toBe(firstResult);
  });

  it('updates navigationButtons when navigation items change', () => {
    let navigationItems: iNavigation[] = [{ nav: 'home', applyDisable: false }];

    const { result, rerender } = renderHook(() =>
      useNavigation(navigationItems)
    );

    expect(result.current.navigationButtons).toHaveLength(1);

    navigationItems = [
      { nav: 'home', applyDisable: false },
      { nav: 'salvar', applyDisable: false },
    ];

    rerender();

    expect(result.current.navigationButtons).toHaveLength(2);
  });

  it('handles all navigation provider types', () => {
    const navigationItems: iNavigation[] = [
      { nav: 'voltar', applyDisable: false },
      { nav: 'salvar', applyDisable: false },
      { nav: 'deletar', applyDisable: false },
      { nav: 'home', applyDisable: false },
      { nav: 'print', applyDisable: false },
      { nav: 'refresh', applyDisable: false },
    ];

    const { result } = renderHook(() => useNavigation(navigationItems));

    expect(result.current.navigationButtons).toHaveLength(6);
    navigationItems.forEach((item, index) => {
      expect(result.current.navigationButtons[index].name).toBe(
        NAVIGATION_ITENS[item.nav].name
      );
    });
  });
});
