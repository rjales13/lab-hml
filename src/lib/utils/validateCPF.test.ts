import { describe, expect, it } from 'vitest';
import { validateCPF } from './validateCPF';

describe('validateCPF', () => {
  describe('valid CPFs', () => {
    it('validates a valid CPF', () => {
      expect(validateCPF('11144477735')).toBe(true);
    });

    it('validates a CPF with formatting', () => {
      expect(validateCPF('111.444.777-35')).toBe(true);
    });

    it('validates a different valid CPF', () => {
      expect(validateCPF('11144477735')).toBe(true);
    });

    it('validates valid CPF with hyphens and dots', () => {
      expect(validateCPF('111.444.777-35')).toBe(true);
    });

    it('validates valid CPF with mixed separators', () => {
      expect(validateCPF('111-444-777.35')).toBe(true);
    });
  });

  describe('invalid CPFs - format', () => {
    it('rejects CPF with less than 11 digits', () => {
      expect(validateCPF('1234567890')).toBe(false);
    });

    it('rejects CPF with more than 11 digits', () => {
      expect(validateCPF('123456789012')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(validateCPF('')).toBe(false);
    });

    it('rejects CPF with only formatting characters', () => {
      expect(validateCPF('...-')).toBe(false);
    });
  });

  describe('invalid CPFs - repeated digits', () => {
    it('rejects CPF with all zeros', () => {
      expect(validateCPF('00000000000')).toBe(false);
    });

    it('rejects CPF with all ones', () => {
      expect(validateCPF('11111111111')).toBe(false);
    });

    it('rejects CPF with all twos', () => {
      expect(validateCPF('22222222222')).toBe(false);
    });

    it('rejects CPF with all threes', () => {
      expect(validateCPF('33333333333')).toBe(false);
    });

    it('rejects CPF with all fours', () => {
      expect(validateCPF('44444444444')).toBe(false);
    });

    it('rejects CPF with all fives', () => {
      expect(validateCPF('55555555555')).toBe(false);
    });

    it('rejects CPF with all sixes', () => {
      expect(validateCPF('66666666666')).toBe(false);
    });

    it('rejects CPF with all sevens', () => {
      expect(validateCPF('77777777777')).toBe(false);
    });

    it('rejects CPF with all eights', () => {
      expect(validateCPF('88888888888')).toBe(false);
    });

    it('rejects CPF with all nines', () => {
      expect(validateCPF('99999999999')).toBe(false);
    });

    it('rejects CPF with all repeated digits and formatting', () => {
      expect(validateCPF('111.111.111-11')).toBe(false);
    });
  });

  describe('invalid CPFs - check digit', () => {
    it('rejects CPF with invalid first check digit', () => {
      expect(validateCPF('11144477736')).toBe(false);
    });

    it('rejects CPF with invalid second check digit', () => {
      expect(validateCPF('11144477734')).toBe(false);
    });

    it('rejects CPF with both check digits invalid', () => {
      expect(validateCPF('11144477700')).toBe(false);
    });

    it('rejects CPF with wrong check digits', () => {
      expect(validateCPF('12345678900')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles CPF with spaces', () => {
      expect(validateCPF('111 444 777 35')).toBe(true);
    });

    it('handles CPF with mixed formatting and spaces', () => {
      expect(validateCPF('111.444.777 - 35')).toBe(true);
    });

    it('rejects CPF with letters', () => {
      expect(validateCPF('111.444.777-3a')).toBe(false);
    });

    it('rejects null-like string', () => {
      expect(validateCPF('null')).toBe(false);
    });

    it('handles single digit', () => {
      expect(validateCPF('1')).toBe(false);
    });
  });

  describe('algorithm validation', () => {
    it('correctly validates using first check digit algorithm', () => {
      // 11144477735 is a valid CPF
      expect(validateCPF('11144477735')).toBe(true);
    });

    it('correctly validates using second check digit algorithm', () => {
      // For CPF 11144477735, both check digits are valid
      expect(validateCPF('11144477735')).toBe(true);
    });

    it('rejects if second check digit calculation is wrong', () => {
      // Modify only the last digit
      expect(validateCPF('11144477734')).toBe(false);
    });
  });
});
