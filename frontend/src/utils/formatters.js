/**
 * Format a date string or Date object to dd/MM/yyyy format
 * @param {string|Date} dateInput - The date to format
 * @returns {string} Formatted date in dd/MM/yyyy format
 */
export const formatDate = (dateInput) => {
    if (!dateInput) return '';
    
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    if (isNaN(date.getTime())) return '';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
};

/**
 * Format a date-time string to dd/MM/yyyy HH:mm format
 * @param {string|Date} dateInput - The date-time to format
 * @returns {string} Formatted date-time in dd/MM/yyyy HH:mm format
 */
export const formatDateTime = (dateInput) => {
    if (!dateInput) return '';
    
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    if (isNaN(date.getTime())) return '';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Format currency to Indian Rupee format
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted currency with ₹ symbol
 */
export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) return '₹0';
    
    return `₹${numAmount.toLocaleString('en-IN')}`;
};
