// api.ts

export interface Category {
  category_id: string;
  category_name: string;
  depth: number;
  parent_category_id: string;
  visibility: boolean;
  has_active_items: boolean;
  show_in_menu: boolean;
  image_url: string;
  description: string;
  created_time: string;
}

export interface CategoryCreateData {
  category_id?: string;
  category_name: string;
  visibility: boolean;
  show_in_menu: boolean;
  parent_category_id: string;
  has_active_items: boolean;
  depth: number;
  description: string;
  image: File;
}

interface CategoryCreateResponse {
  message: string;
  data: {
    message: string;
    imageUrl: string;
  };
}

interface CategoryApiResponse {
  message: string;
  data: {
    message: string;
    category_id: string;
    category_code: string;
    imageUrl: string;
  };
}

export interface Subcategory {
  updated_time: string;
  category_id: string;
  sub_category_id: string;
  form_data: string;
  depth: number;
  visibility: number;
  has_active_items: string;
  sub_category_name: string;
  sub_category_code: string;
  created_time: string;
  show_in_menu: string;
  image_url: string;
  description: string;
}

export interface SubcategoryType {
  updated_time: string;
  sub_category_id: string;
  form_data: string;
  depth: number;
  visibility: number;
  has_active_items: string;
  sub_category_type_code: string;
  created_time: string;
  sub_category_type_id: string;
  sub_category_type_name: string;
  show_in_menu: string;
  image_url: string;
  description: string;
}

export interface ProductType {
  product_type_code: string;
  updated_time: string;
  product_type_id: string;
  form_data: string;
  depth: number;
  visibility: number;
  has_active_items: string;
  created_time: string;
  sub_category_type_id: string;
  show_in_menu: string;
  product_type_name: string;
  image_url: string;
  description: string;
}

export interface ProductStyle {
  updated_time: string;
  product_type_id: string;
  product_style_code: string;
  form_data: string;
  depth: number;
  visibility: number;
  has_active_items: string;
  created_time: string;
  product_style_id: string;
  product_style_name: string;
  show_in_menu: string;
  image_url: string;
  description: string;
}

// Fetch categories from the API
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch('http://3.111.34.117/api/categories');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Create a category
export const createCategoryApi = async (formData: FormData): Promise<CategoryApiResponse> => {
  try {
    const response = await fetch('http://3.111.34.117/api/categories', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create category');
    }

    return data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Create a subcategory
export const createSubcategoryApi = async (formData: FormData): Promise<CategoryApiResponse> => {
  try {
    const response = await fetch('http://3.111.34.117/api/subcategories', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    // Log the response from the server for debugging
    console.log("API Response:", data);

    if (!response.ok) {
      // More detailed error logging
      console.error('Error Response:', data);
      throw new Error(data.message || 'Failed to create subcategory');
    }

    return data;
  } catch (error) {
    console.error('Error creating subcategory:', error);
    if (error instanceof Error) {
      // Log the error message in full for debugging purposes
      console.error('Detailed Error Message:', error.message);
    }
    throw error;
  }
};

// api.ts

export const createSubcategoryTypeApi = async (formData: FormData): Promise<CategoryApiResponse> => {
  try {
    const response = await fetch('http://3.111.34.117/api/subcategoriesTypes', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create subcategory type');
    }

    return data;
  } catch (error) {
    console.error('Error creating subcategory type:', error);
    throw error;
  }
};

export const createProductTypeApi = async (formData: FormData): Promise<CategoryApiResponse> => {
  try {
    const response = await fetch('http://3.111.34.117/api/productTypes', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create product type');
    }

    return data;
  } catch (error) {
    console.error('Error creating product type:', error);
    throw error;
  }
};

export const createProductStyleApi = async (formData: FormData): Promise<CategoryApiResponse> => {
  try {
    const response = await fetch('http://3.111.34.117/api/productStyle', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create product style');
    }

    return data;
  } catch (error) {
    console.error('Error creating product style:', error);
    throw error;
  }
};




// Fetch subcategories for a category
export const fetchSubcategories = async (categoryId?: string): Promise<Subcategory[]> => {
  try {
    const response = await fetch('http://3.111.34.117/api/subcategories');
    const data = await response.json();
    if (categoryId) {
      return data.filter((sub: Subcategory) => sub.category_id === categoryId);
    }
    return data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
};

// Fetch subcategory types for a subcategory
export const fetchSubcategoryTypes = async (subcategoryId?: string): Promise<SubcategoryType[]> => {
  try {
    const response = await fetch('http://3.111.34.117/api/subcategoriesTypes');
    const data = await response.json();
    if (subcategoryId) {
      return data.filter((type: SubcategoryType) => type.sub_category_id === subcategoryId);
    }
    return data;
  } catch (error) {
    console.error('Error fetching subcategory types:', error);
    return [];
  }
};

// Fetch product types for a subcategory type
export const fetchProductTypes = async (subcategoryTypeId?: string): Promise<ProductType[]> => {
  try {
    const response = await fetch('http://3.111.34.117/api/productTypes');
    const data = await response.json();
    if (subcategoryTypeId) {
      return data.filter((type: ProductType) => type.sub_category_type_id === subcategoryTypeId);
    }
    return data;
  } catch (error) {
    console.error('Error fetching product types:', error);
    return [];
  }
};

// Fetch product styles for a product type
export const fetchProductStyles = async (productTypeId?: string): Promise<ProductStyle[]> => {
  try {
    const response = await fetch('http://3.111.34.117/api/productStyle');
    const data = await response.json();
    if (productTypeId) {
      return data.filter((style: ProductStyle) => style.product_type_id.trim() === productTypeId);
    }
    return data;
  } catch (error) {
    console.error('Error fetching product styles:', error);
    return [];
  }
};

// Save a category to local storage (useful for quick testing or offline persistence)
export const saveCategory = (categoryData: Partial<Category>): void => {
  const category: Category = {
    category_id: categoryData.category_id || `cat_${Date.now()}`,
    category_name: categoryData.category_name || '',
    depth: categoryData.depth || 1,
    parent_category_id: categoryData.parent_category_id || '',
    visibility: categoryData.visibility || true,
    has_active_items: categoryData.has_active_items || false,
    show_in_menu: categoryData.show_in_menu || true,
    image_url: categoryData.image_url || '',
    description: categoryData.description || '',
    created_time: new Date().toISOString(),
  };

  const categories = getCategories();
  categories.push(category);
  localStorage.setItem('categories', JSON.stringify(categories));
};

// Get all categories from local storage
export const getCategories = (): Category[] => {
  const categories = localStorage.getItem('categories');
  return categories ? JSON.parse(categories) : [];
};
