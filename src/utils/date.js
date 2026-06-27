export const getDateValue = (record, ...keys) => {
  if (!record) return null;

  for (const key of keys) {
    if (record[key]) return record[key];
  }

  return record.createdAt || record.created_at || record.updatedAt || record.updated_at || null;
};

export const toValidDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value, options, fallback = 'Not available') => {
  const date = toValidDate(value);
  if (!date) return fallback;
  return date.toLocaleDateString('en-US', options);
};

export const formatDateTime = (value, options, fallback = 'Not available') => {
  const date = toValidDate(value);
  if (!date) return fallback;
  return date.toLocaleString('en-US', options);
};

export const isPastDate = (value) => {
  const date = toValidDate(value);
  return date ? date < new Date() : false;
};

export const isFutureDate = (value) => {
  const date = toValidDate(value);
  return date ? date > new Date() : false;
};
