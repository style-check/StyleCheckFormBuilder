import React, { useState } from "react";
import { useDrag } from "react-dnd";
import {
  sectionComponents as initialSectionComponents,
  textInputComponents as initialTextInputComponents,
  numberInputComponents as initialNumberInputComponents,
  dropdownComponents as initialDropdownComponents,
  otherComponents as initialOtherComponents,
  buttons as initialButtons,
} from "@/lib/initialData";
import {
  Type,
  Hash,
  ChevronDown,
  Circle,
  CheckSquare,
  Image,
  LayoutGrid,
  Save,
  ArrowRightCircle,
  Tag,
  Printer,
  FileText,
  QrCode,
  Plus,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddComponentDialog } from "./AddComponentDialog";
import { Button } from "@/components/ui/button";
import { useFormContext } from "@/context/FormContext";

const iconMap = {
  Type,
  Hash,
  ChevronDown,
  Circle,
  CheckSquare,
  Image,
  LayoutGrid,
  Save,
  ArrowRightCircle,
  Tag,
  Printer,
  FileText,
  QrCode,
};

const iconColors = {
  "text-input": "text-blue-500",
  "number-input": "text-green-500",
  dropdown: "text-purple-500",
  "radio-group": "text-yellow-500",
  "checkbox-group": "text-pink-500",
  "image-picker": "text-indigo-500",
  section: "text-teal-500",
  button: "text-orange-500",
  "save-product": "text-green-500",
  "save-next": "text-blue-500",
  "generate-sku": "text-purple-500",
  "print-mrp": "text-orange-500",
  "print-catalogue": "text-red-500",
  "qr-code": "text-indigo-500",
};

const defaultIcons = {
  section: "LayoutGrid",
  "text-input": "Type",
  "number-input": "Hash",
  dropdown: "ChevronDown",
  "radio-group": "Circle",
  "checkbox-group": "CheckSquare",
  "image-picker": "Image",
  button: "Save",
};

interface ComponentData {
  type: string;
  label: string;
  icon: string;
  variant?: string;
  buttonType?: string;
}

export const LeftPanel = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const [sectionComponents, setSectionComponents] = useState<ComponentData[]>(initialSectionComponents);
  const [textInputComponents, setTextInputComponents] = useState<ComponentData[]>(initialTextInputComponents);
  const [numberInputComponents, setNumberInputComponents] = useState<ComponentData[]>(initialNumberInputComponents);
  const [dropdownComponents, setDropdownComponents] = useState<ComponentData[]>(initialDropdownComponents);
  const [otherComponents, setOtherComponents] = useState<ComponentData[]>(initialOtherComponents);
  const [buttons, setButtons] = useState<ComponentData[]>(initialButtons);

  const { addComponent } = useFormContext();

  const handleAddComponent = (data: any) => {
    const newComponent: ComponentData = {
      type: data.type,
      label: data.label,
      icon: defaultIcons[data.type as keyof typeof defaultIcons] || "Type",
      ...(data.type === "button" && {
        variant: data.variant || "default",
        buttonType: data.buttonType || "default",
      }),
    };

    switch (data.type) {
      case "section":
        setSectionComponents((prev) => [...prev, newComponent]);
        break;
      case "text-input":
        setTextInputComponents((prev) => [...prev, newComponent]);
        break;
      case "number-input":
        setNumberInputComponents((prev) => [...prev, newComponent]);
        break;
      case "dropdown":
        setDropdownComponents((prev) => [...prev, newComponent]);
        break;
      case "radio-group":
      case "checkbox-group":
      case "image-picker":
        setOtherComponents((prev) => [...prev, newComponent]);
        break;
      case "button":
        setButtons((prev) => [...prev, newComponent]);
        break;
      default:
        break;
    }
  };

  const handleDeleteComponent = (type: string, label: string) => {
    switch (type) {
      case "section":
        setSectionComponents((prev) => prev.filter((comp) => comp.label !== label));
        break;
      case "text-input":
        setTextInputComponents((prev) => prev.filter((comp) => comp.label !== label));
        break;
      case "number-input":
        setNumberInputComponents((prev) => prev.filter((comp) => comp.label !== label));
        break;
      case "dropdown":
        setDropdownComponents((prev) => prev.filter((comp) => comp.label !== label));
        break;
      case "radio-group":
      case "checkbox-group":
      case "image-picker":
        setOtherComponents((prev) => prev.filter((comp) => comp.label !== label));
        break;
      case "button":
        setButtons((prev) => prev.filter((comp) => comp.label !== label));
        break;
      default:
        break;
    }
  };

  const openAddDialog = (type: string) => {
    setSelectedType(type);
    setDialogOpen(true);
  };

  return (
    <div className="w-1/4 p-4 border-r bg-secondary/40 h-[calc(100vh-73px)] overflow-y-auto">
      {/* Sections */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Form Sections</h3>
          <Button variant="ghost" size="sm" onClick={() => openAddDialog("section")}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sectionComponents.map((component) => (
            <DraggableComponent
              key={`${component.type}-${component.label}`}
              type={component.type}
              label={component.label}
              icon={component.icon}
              onDelete={() => handleDeleteComponent(component.type, component.label)}
            />
          ))}
        </div>
      </div>

      {/* Text Inputs */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Text Fields</h3>
          <Button variant="ghost" size="sm" onClick={() => openAddDialog("text-input")}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {textInputComponents.map((component) => (
            <DraggableComponent
              key={`${component.type}-${component.label}`}
              type={component.type}
              label={component.label}
              icon={component.icon}
              onDelete={() => handleDeleteComponent(component.type, component.label)}
            />
          ))}
        </div>
      </div>

      {/* Number Inputs */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Number Fields</h3>
          <Button variant="ghost" size="sm" onClick={() => openAddDialog("number-input")}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {numberInputComponents.map((component) => (
            <DraggableComponent
              key={`${component.type}-${component.label}`}
              type={component.type}
              label={component.label}
              icon={component.icon}
              onDelete={() => handleDeleteComponent(component.type, component.label)}
            />
          ))}
        </div>
      </div>

      {/* Dropdowns */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Dropdown Fields</h3>
          <Button variant="ghost" size="sm" onClick={() => openAddDialog("dropdown")}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {dropdownComponents.map((component) => (
            <DraggableComponent
              key={`${component.type}-${component.label}`}
              type={component.type}
              label={component.label}
              icon={component.icon}
              onDelete={() => handleDeleteComponent(component.type, component.label)}
            />
          ))}
        </div>
      </div>

      {/* Other Components */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Other Components</h3>
          <Button variant="ghost" size="sm" onClick={() => openAddDialog("radio-group")}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {otherComponents.map((component) => (
            <DraggableComponent
              key={`${component.type}-${component.label}`}
              type={component.type}
              label={component.label}
              icon={component.icon}
              onDelete={() => handleDeleteComponent(component.type, component.label)}
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Buttons</h3>
          <Button variant="ghost" size="sm" onClick={() => openAddDialog("button")}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {buttons.map((component) => (
            <DraggableComponent
              key={`${component.type}-${component.label}`}
              type={component.type}
              label={component.label}
              icon={component.icon}
              buttonType={component.buttonType}
              variant={component.variant}
              onDelete={() => handleDeleteComponent(component.type, component.label)}
            />
          ))}
        </div>
      </div>

      <AddComponentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddComponent}
        componentType={selectedType}
      />
    </div>
  );
};

interface DraggableComponentProps {
  type: string;
  label: string;
  icon: string;
  buttonType?: string;
  variant?: string;
  onDelete: () => void;
}

const DraggableComponent = ({ type, label, icon, buttonType, variant, onDelete }: DraggableComponentProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FORM_COMPONENT",
    item: {
      type,
      label,
      icon,
      buttonType,
      variant,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const IconComponent = iconMap[icon as keyof typeof iconMap];
  const iconColor = iconColors[type as keyof typeof iconColors] || "text-primary";

  return (
    <div
      ref={drag}
      className={cn(
        "relative p-3 rounded-lg bg-white border shadow-sm text-center flex flex-col items-center justify-center gap-2 cursor-grab hover:shadow-md transition-all duration-200 drag-item group",
        isDragging && "opacity-50"
      )}
    >
      <div
        className={`w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center ${iconColor}`}
      >
        {IconComponent && <IconComponent className="h-5 w-5" />}
      </div>
      <span className="text-sm font-medium">{label}</span>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent drag initiation
          onDelete();
        }}
        className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-opacity duration-200"
      >
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
};