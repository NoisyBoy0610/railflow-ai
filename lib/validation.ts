/**
 * RailFlow AI - Official Indian Railways Business Logic & Validation Engine
 * Enforces authentic IRCTC booking rules, quota eligibility, Gazette TDR terms, and payment validations.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

// 1. PNR 10-Digit Validation
export function validatePNR(pnr: string): ValidationResult {
  if (!pnr) {
    return { isValid: false, error: 'PNR number is required.' };
  }
  const clean = pnr.replace(/[^0-9]/g, '');
  if (clean.length !== 10) {
    return { 
      isValid: false, 
      error: `Invalid PNR length (${clean.length}/10 digits). Indian Railways PNR must be exactly 10 digits.` 
    };
  }
  // Standard railway PNR zone prefix check (first digit 1-8)
  const firstDigit = parseInt(clean[0], 10);
  if (firstDigit < 1 || firstDigit > 8) {
    return { 
      isValid: false, 
      error: 'Invalid PNR prefix. Indian Railways PNR starts with digit 1 through 8 corresponding to railway zones.' 
    };
  }
  return { isValid: true };
}

// 2. Station Pair Validation
export function validateStationPair(sourceCode: string, destCode: string): ValidationResult {
  if (!sourceCode || !destCode) {
    return { isValid: false, error: 'Please select both origin and destination stations.' };
  }
  if (sourceCode.trim().toUpperCase() === destCode.trim().toUpperCase()) {
    return { 
      isValid: false, 
      error: 'Origin and Destination stations cannot be identical. Please select different stations.' 
    };
  }
  return { isValid: true };
}

// 3. Travel Date Validation (IRCTC 120-Day Advance Reservation Period)
export function validateTravelDate(dateStr: string): ValidationResult {
  if (!dateStr) {
    return { isValid: false, error: 'Journey date is required.' };
  }
  const selectedDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(selectedDate.getTime())) {
    return { isValid: false, error: 'Invalid date format.' };
  }

  // Check if date is in past
  if (selectedDate < today) {
    return { isValid: false, error: 'Journey date cannot be in the past.' };
  }

  // Check 120 days ARP (Advance Reservation Period)
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 120);

  if (selectedDate > maxDate) {
    return { 
      isValid: false, 
      error: 'Date exceeds IRCTC 120-day Advance Reservation Period (ARP).' 
    };
  }

  return { isValid: true };
}

// 4. Passenger Details & Quota Eligibility (IRCTC Rules)
export interface PassengerInput {
  name: string;
  age: number | string;
  gender: 'M' | 'F' | 'T';
  berthPreference?: string;
  aadhaar?: string;
}

export function validatePassenger(p: PassengerInput, index: number = 1): ValidationResult {
  if (!p.name || p.name.trim().length < 3) {
    return { 
      isValid: false, 
      error: `Passenger ${index}: Name must contain at least 3 alphabetical characters.` 
    };
  }
  if (!/^[a-zA-Z\s.]+$/.test(p.name.trim())) {
    return { 
      isValid: false, 
      error: `Passenger ${index}: Name contains invalid special characters.` 
    };
  }

  const age = typeof p.age === 'string' ? parseInt(p.age, 10) : p.age;
  if (isNaN(age) || age < 1 || age > 120) {
    return { 
      isValid: false, 
      error: `Passenger ${index}: Please enter a valid age between 1 and 120 years.` 
    };
  }

  if (p.aadhaar && p.aadhaar.trim()) {
    const cleanAadhaar = p.aadhaar.replace(/[^0-9]/g, '');
    if (cleanAadhaar.length !== 12) {
      return {
        isValid: false,
        error: `Passenger ${index}: Aadhaar number must be exactly 12 digits (entered ${cleanAadhaar.length}).`
      };
    }
  }

  return { isValid: true };
}

// 5. Quota Eligibility Validator (Senior Citizen / Ladies / Tatkal)
export function validateQuotaEligibility(
  quota: string, 
  passengers: PassengerInput[]
): ValidationResult {
  if (passengers.length === 0) {
    return { isValid: false, error: 'At least one passenger is required.' };
  }

  if (quota === 'SS') { // Senior Citizen Lower Berth Quota
    // IRCTC Rule: Male age >= 60, Female age >= 45 traveling alone or as a senior couple
    const ineligible = passengers.find(p => {
      const age = typeof p.age === 'string' ? parseInt(p.age, 10) : p.age;
      if (p.gender === 'F' && age >= 45) return false;
      if (p.gender === 'M' && age >= 60) return false;
      if (p.gender === 'T' && age >= 60) return false;
      return true;
    });

    if (ineligible) {
      return {
        isValid: false,
        error: `Senior Citizen Quota (SS) Ineligible: ${ineligible.name || 'Passenger'} does not meet IRCTC age criteria (Male >= 60 years, Female >= 45 years).`
      };
    }
  }

  if (quota === 'LD') { // Ladies Quota
    // IRCTC Rule: Female passengers of any age, or male child under 12
    const ineligible = passengers.find(p => {
      const age = typeof p.age === 'string' ? parseInt(p.age, 10) : p.age;
      if (p.gender === 'F') return false;
      if (p.gender === 'M' && age <= 12) return false;
      return true;
    });

    if (ineligible) {
      return {
        isValid: false,
        error: `Ladies Quota (LD) Ineligible: ${ineligible.name || 'Passenger'} is a male over 12 years. Ladies quota is reserved for women or children under 12.`
      };
    }
  }

  if (quota === 'TQ' || quota === 'PT') {
    if (passengers.length > 4) {
      return {
        isValid: false,
        error: 'Tatkal Quota Limit: Indian Railways limits Tatkal bookings to a maximum of 4 passengers per PNR.'
      };
    }
  }

  return { isValid: true };
}

// 6. Indian Mobile Number (10 Digits starting with 6-9)
export function validateIndianMobile(phone: string): ValidationResult {
  const clean = phone.replace(/[^0-9]/g, '');
  if (!clean || clean.length !== 10) {
    return { 
      isValid: false, 
      error: 'Please enter a valid 10-digit Indian mobile number.' 
    };
  }
  if (!/^[6-9]/.test(clean)) {
    return { 
      isValid: false, 
      error: 'Indian mobile numbers must start with digit 6, 7, 8, or 9.' 
    };
  }
  return { isValid: true };
}

// 7. UPI Virtual Payment Address (VPA) Validator
export function validateUPIId(upiId: string): ValidationResult {
  if (!upiId || !upiId.trim()) {
    return { isValid: false, error: 'UPI ID is required.' };
  }
  const vpaRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  if (!vpaRegex.test(upiId.trim())) {
    return { 
      isValid: false, 
      error: 'Invalid UPI ID format. Expected format: username@bank (e.g. mobile@paytm, user@okaxis, user@ybl).' 
    };
  }
  return { isValid: true };
}

// 8. Card Number Luhn Algorithm Validator
export function validateCreditCard(cardNumber: string, expiry: string, cvv: string): ValidationResult {
  const cleanCard = cardNumber.replace(/[^0-9]/g, '');
  if (cleanCard.length < 15 || cleanCard.length > 19) {
    return { isValid: false, error: 'Card number must be 15 to 16 digits.' };
  }

  // Luhn Check
  let sum = 0;
  let shouldDouble = false;
  for (let i = cleanCard.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanCard.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  if (sum % 10 !== 0) {
    return { isValid: false, error: 'Invalid card number checksum (Luhn check failed).' };
  }

  // Expiry check (MM/YY)
  if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) {
    return { isValid: false, error: 'Invalid expiry date format. Expected MM/YY.' };
  }

  // CVV check
  if (!/^[0-9]{3,4}$/.test(cvv)) {
    return { isValid: false, error: 'CVV must be 3 or 4 numeric digits.' };
  }

  return { isValid: true };
}

// 9. TDR Gazette Dispute Validator
export function validateTDRFiling(
  pnr: string, 
  delayMinutes: number, 
  reason: string
): ValidationResult {
  const pnrVal = validatePNR(pnr);
  if (!pnrVal.isValid) return pnrVal;

  if (!reason || reason.trim().length < 8) {
    return { 
      isValid: false, 
      error: 'Please provide a detailed dispute reason statement (minimum 8 characters).' 
    };
  }

  if (delayMinutes < 0) {
    return { isValid: false, error: 'Train delay minutes cannot be negative.' };
  }

  return { isValid: true };
}
