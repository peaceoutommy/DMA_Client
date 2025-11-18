export const formatCurrency = (value, options = {}) => {
    const {
        locale = 'nl-NL',
        currency = 'EUR',
        minimumFractionDigits = 0,
        maximumFractionDigits = 0,
    } = options;

    // If value is a string (from input), strip non-numeric characters
    let numericValue;
    if (typeof value === 'string') {
        numericValue = value.replace(/[^0-9]/g, '');
        if (!numericValue) return '';
        numericValue = parseFloat(numericValue);
    } else {
        // If it's already a number, use it directly
        numericValue = value;
    }

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(numericValue);
};