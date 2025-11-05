// src/pages/category/mockCategoryApi.js

let categories = [
  {
    id: "CAT001",
    name: "Antibiotics",
    code: "ABX",
    type: "Tablet",
    status: "Active",
    description: "Used for bacterial infections",
  },
];

// Simulate delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getCategories = async () => {
  await delay(300);
  return [...categories];
};

export const addCategory = async (data) => {
  await delay(300);
  const newCategory = { ...data, id: `CAT${Date.now()}` };
  categories.push(newCategory);
  return newCategory;
};

export const updateCategory = async (index, data) => {
  await delay(300);
  categories[index] = data;
  return data;
};

export const deleteCategory = async (index) => {
  await delay(300);
  categories.splice(index, 1);
  return true;
};
