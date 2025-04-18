import React, { createContext, useState, useContext, useCallback } from "react";
import { toast } from "sonner";
import { FormComponentData, FormContextType, CategoryData, EntityData } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface ProductDescriptionJson {
  name: string;
  label: string;
  type: string;
  options?: string[];
  placeholder?: string;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [components, setFormComponents] = useState<FormComponentData[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<FormComponentData | null>(null);
  const [isGeneratingForm, setIsGeneratingForm] = useState(false);
  const [generatedForm, setGeneratedForm] = useState<FormComponentData[] | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [entityData, setEntityData] = useState<EntityData | null>(null);

  const setComponents = useCallback(
    (newComponents: FormComponentData[] | ((prev: FormComponentData[]) => FormComponentData[])) => {
      setFormComponents(newComponents);
    },
    []
  );

  const setCategoryFormData = useCallback((data: CategoryData) => {
    setCategoryData(data);
  }, []);

  const setEntityFormData = useCallback((data: EntityData) => {
    setEntityData(data);
  }, []);

  const editGeneratedForm = useCallback(() => {
    if (generatedForm) {
      setComponents(generatedForm);
      setGeneratedForm(null);
      setIsGeneratingForm(false);
    }
  }, [generatedForm, setComponents]);

  const addComponent = useCallback(
    (component: FormComponentData, parentId?: string, index?: number) => {
      setComponents((prev: FormComponentData[]) => {
        // If it's a section with children, make sure all children get proper IDs
        if (component.type === 'section' && component.children?.length) {
          component.children = component.children.map(child => ({
            ...child,
            id: uuidv4(), // Ensure each child has a unique ID
          }));
        }

        if (parentId) {
          const parentExists = prev.some((p) => p.id === parentId && p.type === "section");
          if (!parentExists) {
            toast.error(`Parent section with ID ${parentId} not found`);
            return prev;
          }
          return prev.map((parent) => {
            if (parent.id === parentId && parent.type === "section") {
              const updatedChildren = [...(parent.children || [])];
              if (typeof index === "number") {
                updatedChildren.splice(index, 0, component);
              } else {
                updatedChildren.push(component);
              }
              return { ...parent, children: updatedChildren };
            }
            return parent;
          });
        } else {
          const newComponents = [...prev];
          if (typeof index === "number") {
            newComponents.splice(index, 0, component);
          } else {
            newComponents.push(component);
          }
          return newComponents;
        }
      });

      toast.success(`Added ${component.label}`);
      setSelectedComponent(component);
    },
    [setComponents]
  );

  const updateComponent = useCallback(
    (id: string, data: Partial<FormComponentData>) => {
      setComponents((prev: FormComponentData[]) => {
        const updateRecursive = (components: FormComponentData[]): FormComponentData[] => {
          return components.map((component) => {
            if (component.id === id) {
              const updated = { ...component, ...data };
              if (selectedComponent?.id === id) {
                setSelectedComponent(updated);
              }
              return updated;
            } else if (component.type === "section" && component.children) {
              return { ...component, children: updateRecursive(component.children) };
            }
            return component;
          });
        };
        return updateRecursive(prev);
      });
    },
    [selectedComponent]
  );

  const removeComponent = useCallback(
    (id: string) => {
      setComponents((prev: FormComponentData[]) => {
        const removeRecursive = (components: FormComponentData[]): FormComponentData[] => {
          return components.filter((component) => {
            if (component.id === id) {
              return false;
            } else if (component.type === "section" && component.children) {
              component.children = removeRecursive(component.children);
            }
            return true;
          });
        };
        return removeRecursive(prev);
      });

      if (selectedComponent?.id === id) {
        setSelectedComponent(null);
      }

      toast.info("Component removed");
    },
    [selectedComponent]
  );

  const moveComponent = useCallback(
    (
      dragIndex: number,
      hoverIndex: number,
      sourceParentId?: string,
      targetParentId?: string
    ) => {
      setComponents((prev: FormComponentData[]) => {
        // Case 1: Move within the same level
        if (sourceParentId === targetParentId) {
          if (sourceParentId) {
            return prev.map((component) => {
              if (component.id === sourceParentId && component.type === "section" && component.children) {
                const newChildren = [...component.children];
                const draggedItem = newChildren[dragIndex];
                newChildren.splice(dragIndex, 1);
                newChildren.splice(hoverIndex, 0, draggedItem);
                return { ...component, children: newChildren };
              }
              return component;
            });
          } else {
            const newComponents = [...prev];
            const draggedItem = newComponents[dragIndex];
            newComponents.splice(dragIndex, 1);
            newComponents.splice(hoverIndex, 0, draggedItem);
            return newComponents;
          }
        } 
        // Case 2: Move between levels
        else {
          let draggedItem: FormComponentData | undefined;
          let newComponents = [...prev];

          // Remove from source
          if (sourceParentId) {
            newComponents = newComponents.map((component) => {
              if (component.id === sourceParentId && component.type === "section" && component.children) {
                const newChildren = [...component.children];
                draggedItem = newChildren[dragIndex];
                newChildren.splice(dragIndex, 1);
                return { ...component, children: newChildren };
              }
              return component;
            });
          } else {
            draggedItem = newComponents[dragIndex];
            newComponents.splice(dragIndex, 1);
          }

          if (!draggedItem) return prev;

          // Add to target
          if (targetParentId) {
            return newComponents.map((component) => {
              if (component.id === targetParentId && component.type === "section" && component.children) {
                const newChildren = [...component.children];
                newChildren.splice(hoverIndex, 0, draggedItem!);
                return { ...component, children: newChildren };
              }
              return component;
            });
          } else {
            newComponents.splice(hoverIndex, 0, draggedItem);
            return newComponents;
          }
        }
      });
    },
    [setComponents]
  );

  const generateForm = useCallback(() => {
    if (components.length === 0) {
      toast.error("Please add components to your form first");
      return;
    }

    setIsGeneratingForm(true);

    setTimeout(() => {
      setGeneratedForm([...components]);
      setIsGeneratingForm(false);
      toast.success("Form generated successfully!");
    }, 800);
  }, [components]);

  const updateFormData = useCallback((name: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev };
      if (name.endsWith('_count')) {
        const baseName = name.replace('_count', '');
        if (value === 0) {
          delete newData[baseName];
        }
      }
      newData[name] = value;
      return newData;
    });
  }, []);

  const resetFormData = useCallback(() => {
    setFormData({});
  }, []);

  const submitForm = useCallback(() => {
    // Create Product Description JSON
    const productDescSection = components.find(c => c.label === "Product Description");
    if (productDescSection && productDescSection.children) {
      const productDescJson: ProductDescriptionJson[] = productDescSection.children.map(child => {
        if (child.type === 'dropdown') {
          return {
            name: child.name,
            label: child.label,
            type: 'dropdown',
            options: child.options?.map(opt => opt.label) || []
          };
        } else if (child.type === 'text-input') {
          return {
            name: child.name,
            label: child.label,
            type: 'textField',
            placeholder: `Enter your ${child.label}`
          };
        } else if (child.type === 'number-input') {
          return {
            name: child.name,
            label: child.label,
            type: 'numberField',
            placeholder: `Enter ${child.label.toLowerCase()}`
          };
        }
        return {
          name: child.name,
          label: child.label,
          type: child.type
        };
      });

      console.log("Product Description JSON:", JSON.stringify(productDescJson, null, 2));
    }

    toast.success("Form submitted successfully!");
    console.log("Form data:", formData);
    resetFormData();
  }, [components, formData, resetFormData]);

  const getComponentCount = useCallback((type: string) => {
    return components.filter((c) => c.type === type).length;
  }, [components]);

  return (
    <FormContext.Provider
      value={{
        components,
        addComponent,
        updateComponent,
        removeComponent,
        moveComponent,
        selectedComponent,
        setSelectedComponent,
        isGeneratingForm,
        setIsGeneratingForm,
        generatedForm,
        generateForm,
        formData,
        updateFormData,
        resetFormData,
        submitForm,
        setComponents,
        editGeneratedForm,
        getComponentCount,
        categoryData,
        setCategoryFormData,
        entityData,
        setEntityFormData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};