import { FormComponentData, Option } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Category } from "@/services/api";

export const sectionComponents = [
  { type: "section", label: "Product Information", icon: "LayoutGrid" },
  { type: "section", label: "Category", icon: "LayoutGrid", isLocked: true },
  // { type: "section", label: "Product Details", icon: "LayoutGrid" },
  { type: "section", label: "Stock", icon: "LayoutGrid" },
  { type: "section", label: "Product Description", icon: "LayoutGrid" },
  // { type: "section", label: "Colours", icon: "LayoutGrid" },
  { type: "section", label: "Product Size & Dimensions", icon: "LayoutGrid" },
  { type: "section", label: "Sales & Purchase Information", icon: "LayoutGrid" },
  { type: "section", label: "Save and next", icon: "LayoutGrid" },
  { type: "section", label: "Print Options", icon: "LayoutGrid" },
  { type: "section", label: "Tax", icon: "LayoutGrid" },
];

export const textInputComponents = [
  { type: "text-input", label: "Product Name", icon: "Type" },
  { type: "text-input", label: "Collection", icon: "Type" },
  { type: "text-input", label: "Description", icon: "Type" },
];

export const numberInputComponents = [
  { type: "number-input", label: "Contents", icon: "Hash" },
  { type: "number-input", label: "Length", icon: "Hash" },
  { type: "number-input", label: "Width", icon: "Hash" },
  { type: "number-input", label: "Height", icon: "Hash" },
  { type: "number-input", label: "Weight", icon: "Hash" },
  { type: "number-input", label: "MRP(INR)", icon: "Hash" },
  { type: "number-input", label: "Selling Price", icon: "Hash" },
  { type: "number-input", label: "Purchase Price", icon: "Hash" },
  { type: "number-input", label: "Wholesale Price", icon: "Hash" },
  { type: "number-input", label: "Vendor Code", icon: "Hash" },
  { type: "number-input", label: "HSN", icon: "Hash" },
  { type: "number-input", label: "Barcode", icon: "Hash" },
  { type: "number-input", label: "SKU", icon: "Hash" },
  { type: "number-input", label: "Opening Stock", icon: "Hash" },
  { type: "number-input", label: "Opening Stock Value", icon: "Hash" },
];

// Add new component type for alphanumeric fields
export const alphanumericComponents = [
  { type: "alphanumeric-input", label: "SKU", icon: "Hash", hasGenerateButton: true },
  { type: "alphanumeric-input", label: "HSN", icon: "Hash" },
  { type: "alphanumeric-input", label: "Barcode", icon: "Hash" },
];

export const dropdownComponents = [
  { type: "dropdown", label: "Select Category", icon: "ChevronDown" },
  { type: "dropdown", label: "Select Subcategory", icon: "ChevronDown" },
  { type: "dropdown", label: "Select Subcategory Type", icon: "ChevronDown" },
  { type: "dropdown", label: "Select Product Type", icon: "ChevronDown" },
  { type: "dropdown", label: "Select Product Style", icon: "ChevronDown" },
  { type: "dropdown", label: "Select Brand", icon: "ChevronDown" },
  { type: "dropdown", label: "Select Manufacturer", icon: "ChevronDown" },
  { type: "dropdown", label: "Select Material", icon: "ChevronDown" },
  { type: "dropdown", label: "Select Pattern", icon: "ChevronDown" },
  { type: "dropdown", label: "First Colour", icon: "ChevronDown" },
  { type: "dropdown", label: "Second Colour", icon: "ChevronDown" },
  { type: "dropdown", label: "Third Colour", icon: "ChevronDown" },
  { type: "dropdown", label: "Select Tax%", icon: "ChevronDown" },
  { type: "dropdown", label: "Select Printer Type", icon: "ChevronDown" },
  { type: "dropdown", label: "Select Size", icon: "ChevronDown" },
];

export const otherComponents = [
  { type: "radio-group", label: "Radio Group", icon: "Circle" },
  { type: "checkbox-group", label: "Checkbox Group", icon: "CheckSquare" },
  { type: "image-picker", label: "Image Upload", icon: "Image" },
];

export const buttons = [
  { 
    type: "button", 
    label: "Save Product", 
    icon: "Save",
    variant: "success",
    buttonType: "save-product"
  },
  { 
    type: "button", 
    label: "Save and Next", 
    icon: "ArrowRightCircle",
    variant: "primary",
    buttonType: "save-next"
  },
  { 
    type: "button", 
    label: "Print MRP Label", 
    icon: "Printer",
    variant: "warning",
    buttonType: "print-mrp"
  },
  { 
    type: "button", 
    label: "Print Catalogue Label", 
    icon: "FileText",
    variant: "info",
    buttonType: "print-catalogue"
  },
  { 
    type: "button", 
    label: "QR Code", 
    icon: "QrCode",
    variant: "dark",
    buttonType: "qr-code"
  },
];

export const componentLibrary = [
  ...sectionComponents,
  ...textInputComponents,
  ...numberInputComponents,
  ...dropdownComponents,
  ...otherComponents,
  ...buttons,
];

// Add this section-components mapping
export const sectionDefaultComponents = {
  "Product Information": [
    { type: "text-input", label: "Product Name", icon: "Type" },
    { type: "number-input", label: "Contents", icon: "Hash" }
  ],
  "Product Description": [
    { 
      type: "dropdown", 
      label: "Select Brand", 
      icon: "ChevronDown",
      name: "brand",
      options: [
        { id: uuidv4(), label: "Nike", value: "nike" },
        { id: uuidv4(), label: "Adidas", value: "adidas" },
        { id: uuidv4(), label: "Puma", value: "puma" }
      ]
    },
    { 
      type: "dropdown", 
      label: "Select Manufacturer", 
      icon: "ChevronDown",
      name: "manufacturer",
      options: [
        { id: uuidv4(), label: "Manufacturer A", value: "mfg_a" },
        { id: uuidv4(), label: "Manufacturer B", value: "mfg_b" }
      ]
    },
    { 
      type: "dropdown", 
      label: "Select Material", 
      icon: "ChevronDown",
      name: "material",
      options: [
        { id: uuidv4(), label: "Cotton", value: "cotton" },
        { id: uuidv4(), label: "Polyester", value: "polyester" },
        { id: uuidv4(), label: "Wool", value: "wool" }
      ]
    },
    { 
      type: "dropdown", 
      label: "Select Pattern", 
      icon: "ChevronDown",
      name: "pattern",
      options: [
        { id: uuidv4(), label: "Solid", value: "solid" },
        { id: uuidv4(), label: "Striped", value: "striped" },
        { id: uuidv4(), label: "Printed", value: "printed" }
      ]
    },
    { 
      type: "dropdown", 
      label: "Select Size", 
      icon: "ChevronDown",
      name: "size",
      options: [
        { id: uuidv4(), label: "Small", value: "s" },
        { id: uuidv4(), label: "Medium", value: "m" },
        { id: uuidv4(), label: "Large", value: "l" }
      ]
    },
    { 
      type: "text-input", 
      label: "Collection", 
      icon: "Type",
      name: "collection",
      placeholder: "Enter your Collection"
    },
    { 
      type: "number-input", 
      label: "Weight", 
      icon: "Hash",
      name: "weight",
      placeholder: "Enter weight"
    }
  ],
  "Sales & Purchase Information": [
    { type: "number-input", label: "MRP(INR)", icon: "Hash" },
    { type: "number-input", label: "Selling Price", icon: "Hash" },
    { type: "number-input", label: "Purchase Price", icon: "Hash" },
    { type: "number-input", label: "Wholesale Price", icon: "Hash" },
    { type: "number-input", label: "Vendor Code", icon: "Hash" },
    { type: "text-input", label: "Description", icon: "Type" }
  ],
  // Add other section default components as needed
  "Tax": [
    { type: "radio-group", label: "Taxable", icon: "Circle" },
    { type: "dropdown", label: "Select Tax%", icon: "ChevronDown" }
  ],  
  "Stock": [
    { type: "number-input", label: "Opening Stock", icon: "Hash" },
    { type: "number-input", label: "Opening Stock Value", icon: "Hash" },
    { type: "alphanumeric-input", label: "SKU", icon: "Hash", hasGenerateButton: true },
    { type: "alphanumeric-input", label: "HSN", icon: "Hash" },
    { type: "alphanumeric-input", label: "Barcode", icon: "Hash" }
  ],
  "Category": [
    { 
      type: "dropdown", 
      label: "Select Category", 
      icon: "ChevronDown",
      name: "category",
      required: true,
      options: [] // Will be populated dynamically
    },
    { 
      type: "dropdown", 
      label: "Select Subcategory", 
      icon: "ChevronDown",
      name: "subcategory",
      required: true,
      options: [] // Will be populated dynamically
    },
    {
      type: "dropdown",
      label: "Select Subcategory Type",
      icon: "ChevronDown",
      name: "subcategory_type",
      required: true,
      options: [] // Will be populated dynamically
    },
    {
      type: "dropdown",
      label: "Select Product Type",
      icon: "ChevronDown",
      name: "product_type",
      required: true,
      options: [] // Will be populated dynamically
    },
    {
      type: "dropdown",
      label: "Select Product Style",
      icon: "ChevronDown",
      name: "product_style",
      required: true,
      options: [] // Will be populated dynamically
    }
  ],
  "Print Options": [
    { type: "dropdown", label: "Select Printer Type", icon: "ChevronDown" },
    { 
      type: "button", 
      label: "Print MRP Label", 
      icon: "Printer",
      variant: "warning",
      buttonType: "print-mrp"
    },
    { 
      type: "button", 
      label: "Print Catalogue Label", 
      icon: "FileText",
      variant: "info",
      buttonType: "print-catalogue"
    }
  ],
  "Save and next": [
    { 
      type: "button", 
      label: "Save Product", 
      icon: "Save",
      variant: "success",
      buttonType: "save-product"
    },
    { 
      type: "button", 
      label: "Save and Next", 
      icon: "ArrowRightCircle",
      variant: "primary",
      buttonType: "save-next"
    }
  ],
};

export const createNewComponent = (type: string, count: number, originalLabel?: string, item?: any): FormComponentData => {
  // Use the original label if provided, otherwise use a generic name
  const label = originalLabel || `New ${type}`;
  
  const baseComponent: FormComponentData = {
    id: uuidv4(),
    type,
    label: label,
    name: label.toLowerCase().replace(/\s+/g, '_').replace(/^select_/, ''),
    required: false, // Make fields required by default
  };

  switch (type) {
    case "dropdown":
      return {
        ...baseComponent,
        options: getDropdownOptions(label),
      };

    case "number-input":
      return {
        ...baseComponent,
        placeholder: `Enter ${label.toLowerCase()}`,
        validations: getNumberValidations(label),
      };

    case "text-input":
      return {
        ...baseComponent,
        placeholder: `Enter ${label}`,
        validations: getTextValidations(label),
      };

    case "section":
      const defaultChildren = sectionDefaultComponents[originalLabel || '']?.map(child => 
        createNewComponent(child.type, 0, child.label)
      ) || [];
      
      return {
        ...baseComponent,
        children: defaultChildren,
        isLocked: originalLabel === 'Category',
      };

    case "button":
      const buttonData: { icon?: string; variant?: string; buttonType?: string } = buttons.find(b => b.label === originalLabel) || {};
      return {
        ...baseComponent,
        type: "button",
        label: originalLabel || `Button ${count}`,
        icon: buttonData.icon || "Button",
        variant: buttonData.variant || "primary",
        buttonType: buttonData.buttonType || "default"
      };

    case "alphanumeric-input":
      return {
        ...baseComponent,
        placeholder: `Enter ${label.toLowerCase()}`,
        hasGenerateButton: item?.hasGenerateButton || label === "SKU",
        validations: {
          // pattern: "^[a-zA-Z0-9-]*$",
          maxLength: 50
        },
      };

    default:
      return baseComponent;
  }
};

export const createDropdownOptionsFromCategories = (categories: Category[]) => {
  return categories.map(category => ({
    id: category.category_id,
    label: category.category_name,
    value: category.category_id,
    // imageUrl: category.image_url
  }));
};

function getDropdownOptions(label: string): Option[] {
  const defaultOptions = {
    "Select Category": [],
    "Select Subcategory": [
      { 
        id: uuidv4(), 
        label: "Phones", 
        value: "phones",
        // imageUrl: "https://example.com/phones.jpg"
      },
      // ...more options with images
    ],
    "Select Brand": [
      { id: uuidv4(), label: "Apple", value: "apple" },
      { id: uuidv4(), label: "Samsung", value: "samsung" },
      { id: uuidv4(), label: "Sony", value: "sony" }
    ],
    // Add more specific options for other dropdowns
    "Select Subcategory Type": [
      { id: uuidv4(), label: "Smartphones", value: "smartphones" },
      { id: uuidv4(), label: "Feature Phones", value: "feature_phones" },
      { id: uuidv4(), label: "Tablets", value: "tablets" }
    ],
    "Select Product Type": [
      { id: uuidv4(), label: "New", value: "new" },
      { id: uuidv4(), label: "Refurbished", value: "refurbished" }, 
      { id: uuidv4(), label: "Used", value: "used" }
    ],
    "Select Printer Type": [
      { id: uuidv4(), label: "Serial Printer", value: "serial" },
      { id: uuidv4(), label: "Parallel Printer", value: "parallel" }
    ],
    "radio-group": [
      { id: uuidv4(), label: "Taxable", value: "option1" },
      { id: uuidv4(), label: "Non Taxable", value: "option2" }
    ],
  };

  return defaultOptions[label] || [
    { id: uuidv4(), label: "Option 1", value: "option1" },
    { id: uuidv4(), label: "Option 2", value: "option2" }
  ];
}

function getNumberValidations(label: string): any {
  const validations = {
    "MRP": { min: 0, max: 1000000 },
    "Selling Price": { min: 0, max: 1000000 },
    "Purchase Price": { min: 0, max: 1000000 },
    "Wholesale Price": { min: 0, max: 1000000 },
    "Length": { min: 0, max: 10000 },
    "Width": { min: 0, max: 10000 },
    "Height": { min: 0, max: 10000 },
    "Weight": { min: 0, max: 1000 },
    "Contents": { min: 0, max: 1000 }
  };

  return validations[label] || { min: 0 };
}

function getTextValidations(label: string): any {
  const validations = {
    "Product Name": { minLength: 3, maxLength: 100 },
    "Collection": { minLength: 2, maxLength: 50 }
  };

  return validations[label] || { minLength: 0, maxLength: 100 };
}
