import categoriesData from '../assets/categories.json';

export const formatDate = (dateStr, format) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(format);
};

export const categories = categoriesData.results.reduce((acc, category) => {
    acc[category.id] = category;
    return acc;
}, {});
