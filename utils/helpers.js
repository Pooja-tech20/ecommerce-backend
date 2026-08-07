// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Calculate commission
const calculateCommission = (amount, rate = 10) => {
  return (amount * rate) / 100;
};

// Calculate net earnings
const calculateNetEarnings = (amount, commissionRate = 10) => {
  const commission = (amount * commissionRate) / 100;
  return {
    total: amount,
    commission: commission,
    netAmount: amount - commission,
  };
};

// Format currency
const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Pagination helper
const paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return {
    skip,
    limit: parseInt(limit),
    page: parseInt(page),
  };
};

// Generate slug from name
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

// Validate email
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone (Indian)
const isValidPhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

module.exports = {
  generateOrderId,
  calculateCommission,
  calculateNetEarnings,
  formatCurrency,
  paginate,
  generateSlug,
  isValidEmail,
  isValidPhone,
};