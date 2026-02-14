import { SettingsService } from "@/services/settings.service";

function clamp(value: number, [min, max]: [number, number]): number {
  return Math.min(max, Math.max(min, value));
}

function roundToStep(value: number, min: number, step: number): number {
  return Math.round((value - min) / step) * step + min;
}

function convertValueToPercentage(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}

function generateCostCode(price: number, settingsService: SettingsService): string {
  const key = settingsService.getCipherKey(); // e.g., "REPUBLICAN"
  const digits = Math.floor(price).toString().split('');
  let result = '';
  
  for (let i = 0; i < digits.length; i++) {
    let count = 1;
    // Check if the next digits are the same
    while (i + 1 < digits.length && digits[i] === digits[i + 1]) {
      count++;
      i++;
    }

    const num = parseInt(digits[i]);
    const char = key[num === 0 ? 9 : num - 1];
    
    // If count > 1, append the character then the number of repeats
    result += count > 1 ? char + count : char;
  }
  
  return result;
}

export { clamp, roundToStep, convertValueToPercentage, generateCostCode };
