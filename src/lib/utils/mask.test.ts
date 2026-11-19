import { describe, expect, it } from 'vitest';
import { applyMask } from './mask';

describe('applyMask', () => {
  describe('phone mask - mobile (11 digits)', () => {
    const mobileMask = '(##) #####-####';

    it('applies mobile phone mask to 11 digit input', () => {
      expect(applyMask('11987654321', mobileMask)).toBe('(11) 98765-4321');
    });

    it('handles phone number with special characters', () => {
      expect(applyMask('(11) 98765-4321', mobileMask)).toBe('(11) 98765-4321');
    });

    it('applies mask progressively as digits are added', () => {
      expect(applyMask('119', mobileMask)).toBe('(11) 9');
      expect(applyMask('1198765', mobileMask)).toBe('(11) 98765');
      expect(applyMask('11987654321', mobileMask)).toBe('(11) 98765-4321');
    });

    it('handles empty string', () => {
      expect(applyMask('', mobileMask)).toBe('');
    });

    it('ignores non-digit characters in input', () => {
      expect(applyMask('(11) 98765-4321', mobileMask)).toBe('(11) 98765-4321');
      expect(applyMask('11-98765-4321', mobileMask)).toBe('(11) 98765-4321');
    });
  });

  describe('phone mask - landline (10 digits)', () => {
    const phoneMask = '(##) #####-####';

    it('automatically switches to landline mask for 10 digit phone', () => {
      expect(applyMask('1133334444', phoneMask)).toBe('(11) 3333-4444');
    });

    it('applies correct landline mask format', () => {
      expect(applyMask('2144445555', phoneMask)).toBe('(21) 4444-5555');
    });

    it('handles landline with special characters', () => {
      expect(applyMask('(11) 3333-4444', phoneMask)).toBe('(11) 3333-4444');
    });
  });

  describe('CPF mask', () => {
    const cpfMask = '###.###.###-##';

    it('applies CPF mask to 11 digit input', () => {
      expect(applyMask('12345678900', cpfMask)).toBe('123.456.789-00');
    });

    it('handles CPF with special characters', () => {
      expect(applyMask('123.456.789-00', cpfMask)).toBe('123.456.789-00');
    });

    it('applies CPF mask progressively', () => {
      expect(applyMask('123', cpfMask)).toBe('123');
      expect(applyMask('123456', cpfMask)).toBe('123.456');
      expect(applyMask('123456789', cpfMask)).toBe('123.456.789');
      expect(applyMask('12345678900', cpfMask)).toBe('123.456.789-00');
    });
  });

  describe('CNPJ mask', () => {
    const cnpjMask = '##.###.###/####-##';

    it('applies CNPJ mask to 14 digit input', () => {
      expect(applyMask('12345678000190', cnpjMask)).toBe('12.345.678/0001-90');
    });

    it('handles CNPJ with special characters', () => {
      expect(applyMask('12.345.678/0001-90', cnpjMask)).toBe('12.345.678/0001-90');
    });

    it('applies CNPJ mask progressively', () => {
      expect(applyMask('12345678', cnpjMask)).toBe('12.345.678');
      expect(applyMask('123456780001', cnpjMask)).toBe('12.345.678/0001');
      expect(applyMask('12345678000190', cnpjMask)).toBe('12.345.678/0001-90');
    });
  });

  describe('CEP mask', () => {
    const cepMask = '#####-###';

    it('applies CEP mask to 8 digit input', () => {
      expect(applyMask('01310100', cepMask)).toBe('01310-100');
    });

    it('handles CEP with special characters', () => {
      expect(applyMask('01310-100', cepMask)).toBe('01310-100');
    });
  });

  describe('edge cases', () => {
    it('stops applying mask when input exceeds mask length', () => {
      const mask = '###';
      expect(applyMask('123456789', mask)).toBe('123');
    });

    it('handles mask with only special characters', () => {
      const mask = '--.--';
      expect(applyMask('123', mask)).toBe('--.--');
    });

    it('handles input with letters and symbols', () => {
      const phoneMask = '(##) #####-####';
      expect(applyMask('11-abc-98765-4321', phoneMask)).toBe('(11) 98765-4321');
    });

    it('handles single digit input', () => {
      const mask = '(##) #####-####';
      expect(applyMask('1', mask)).toBe('(1');
    });

    it('handles mask with consecutive non-digit characters', () => {
      const mask = '##/##/####';
      expect(applyMask('01011990', mask)).toBe('01/01/1990');
    });
  });
});
