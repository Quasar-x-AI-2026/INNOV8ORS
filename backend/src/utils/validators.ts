export const validateReportInput = (data: any) => {
  const errors: any = {};

  // Product name validation
  const validProducts = ['Milk', 'Onion', 'Potato', 'Sugar', 'Tomato'];
  if (!data.productName || !validProducts.includes(data.productName)) {
    errors.productName = 'Invalid product. Must be one of: Milk, Onion, Potato, Sugar, Tomato';
  }

  // Price validation
  if (!data.price || data.price <= 0) {
    errors.price = 'Price must be a positive number';
  }
  if (data.price && data.price > 1000000) {
    errors.price = 'Price seems unrealistic';
  }

  // Unit validation
  const validUnits = ['kg', 'liter'];
  if (!data.unit || !validUnits.includes(data.unit.toLowerCase())) {
    errors.unit = 'Invalid unit. Must be one of: kg, liter';
  }

  // Market name validation
  const validMarkets = ['Azadpur', 'Daryaganj', 'Ghazipur', 'INA Market', 'Keshopur', 'Okhla', 'Rohini'];
  if (!data.marketName || !validMarkets.includes(data.marketName)) {
    errors.marketName = 'Invalid market. Must be one of: Azadpur, Daryaganj, Ghazipur, INA Market, Keshopur, Okhla, Rohini';
  }

  // Month validation
  const validMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  if (!data.month || !validMonths.includes(data.month)) {
    errors.month = 'Invalid month. Must be a valid month name';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validatePagination = (page?: string, limit?: string) => {
  const pageNum = parseInt(page || '1');
  const limitNum = parseInt(limit || '10');

  return {
    page: isNaN(pageNum) || pageNum < 1 ? 1 : pageNum,
    limit: isNaN(limitNum) || limitNum < 1 || limitNum > 100 ? 10 : limitNum,
  };
};