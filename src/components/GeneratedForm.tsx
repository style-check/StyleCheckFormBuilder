import React from "react";
import { useFormContext } from "@/context/FormContext";
import { FormComponentData } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import { Save, ArrowRightCircle, Tag, Printer, BookOpen, QrCode, Edit } from "lucide-react";
import { FaInfoCircle, FaQrcode, FaTimes } from "react-icons/fa";

export const GeneratedForm = () => {
  const { generatedForm, updateFormData, formData, submitForm, editGeneratedForm } =
    useFormContext();

  const validateForm = () => {
    if (!generatedForm) return false;

    let isValid = true;
    const validateComponent = (component: FormComponentData) => {
      if (component.required) {
        const value = formData[component.name];

        if (component.type === "section" && component.children) {
          component.children.forEach((child) => {
            if (!validateComponent(child)) {
              isValid = false;
            }
          });
        } else if (
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          toast.error(`${component.label} is required`);
          isValid = false;
        }

        if (component.type === "number-input" && value !== undefined && value !== "") {
          const num = Number(value);
          if (component.validations?.min !== undefined && num < component.validations.min) {
            toast.error(`${component.label} must be at least ${component.validations.min}`);
            isValid = false;
          }
          if (component.validations?.max !== undefined && num > component.validations.max) {
            toast.error(`${component.label} must be at most ${component.validations.max}`);
            isValid = false;
          }
        }

        if (component.type === "text-input" && typeof value === "string") {
          if (component.validations?.minLength && value.length < component.validations.minLength) {
            toast.error(`${component.label} must be at least ${component.validations.minLength} characters`);
            isValid = false;
          }
          if (component.validations?.maxLength && value.length > component.validations.maxLength) {
            toast.error(`${component.label} must be at most ${component.validations.maxLength} characters`);
            isValid = false;
          }
        }
      }
      return isValid;
    };

    generatedForm.forEach((component) => {
      validateComponent(component);
    });

    return isValid;
  };

  const handleContentCountChange = (name: string, count: number) => {
    updateFormData(`${name}_count`, count);
    const currentContents = formData[name] || [];
    const currentNumbers = formData[`${name}_numbers`] || [];
    const newContents = Array(count).fill("");
    const newNumbers = Array(count).fill("");
    // Preserve existing values where possible
    for (let i = 0; i < Math.min(count, currentContents.length); i++) {
      newContents[i] = currentContents[i] || "";
      newNumbers[i] = currentNumbers[i] || "";
    }
    updateFormData(name, newContents);
    updateFormData(`${name}_numbers`, newNumbers);
  };

  const handleContentChange = (name: string, index: number, value: string) => {
    const newContents = [...(formData[name] || [])];
    newContents[index] = value;
    updateFormData(name, newContents);
  };

  const handleNumberChange = (name: string, index: number, value: string) => {
    const newNumbers = [...(formData[`${name}_numbers`] || [])];
    newNumbers[index] = value === "" ? "" : parseInt(value);
    updateFormData(`${name}_numbers`, newNumbers);
  };

  const handleDeleteContent = (name: string, index: number) => {
    const newContents = [...(formData[name] || [])];
    const newNumbers = [...(formData[`${name}_numbers`] || [])];
    newContents.splice(index, 1);
    newNumbers.splice(index, 1);
    updateFormData(name, newContents);
    updateFormData(`${name}_numbers`, newNumbers);
    updateFormData(`${name}_count`, newContents.length);
  };

  if (!generatedForm) {
    return null;
  }

  const renderFormComponent = (component: FormComponentData) => {
    switch (component.type) {
      case "text-input":
        return (
          <div className="form-group" key={component.id}>
            <Label className="form-label">
              {component.label}
              {component.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              className={cn(
                "form-control",
                formData[component.name] === "" && component.required && "border-red-500"
              )}
              type="text"
              name={component.name}
              placeholder={component.placeholder}
              value={formData[component.name] || ""}
              onChange={(e) => {
                if (/^[A-Za-z\s]*$/.test(e.target.value) || e.target.value === "") {
                  updateFormData(component.name, e.target.value);
                }
              }}
              required={component.required}
              minLength={component.validations?.minLength}
              maxLength={component.validations?.maxLength}
              onInvalid={(e: React.InvalidEvent<HTMLInputElement>) => {
                if (e.target.validity.valueMissing) {
                  e.target.setCustomValidity(`${component.label} is required`);
                } else if (e.target.validity.tooShort) {
                  e.target.setCustomValidity(
                    `${component.label} must be at least ${component.validations?.minLength} characters`
                  );
                }
              }}
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                e.currentTarget.setCustomValidity("");
              }}
            />
            {formData[component.name] === "" && component.required && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
        );
      case "number-input":
        if (component.label === "Contents") {
          return (
            <div className="form-group space-y-4" key={component.id}>
              <div className="flex items-center gap-2">
                <Label className="form-label flex-grow">
                  {component.label}
                  {component.required && <span className="text-red-500">*</span>}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    value={formData[`${component.name}_count`] || ""}
                    onChange={(e) =>
                      handleContentCountChange(component.name, parseInt(e.target.value) || 0)
                    }
                    className="w-24"
                    placeholder="Count"
                  />
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <FaInfoCircle className="text-gray-600" />
                  </div>
                </div>
              </div>

              {formData[component.name]?.length > 0 && (
                <div className="space-y-3">
                  {formData[component.name].map((content: string, index: number) => (
                    <div key={index} className="relative flex items-center gap-2">
                      <Input
                        type="text"
                        value={content}
                        onChange={(e) => handleContentChange(component.name, index, e.target.value)}
                        placeholder={`Enter content ${index + 1}`}
                        className="flex-grow"
                      />
                      <div className="flex items-center gap-2">
                        <FaQrcode className="text-gray-500" />
                        <Input
                          type="number"
                          value={formData[`${component.name}_numbers`]?.[index] || ""}
                          onChange={(e) => handleNumberChange(component.name, index, e.target.value)}
                          placeholder="Number"
                          className="w-24"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteContent(component.name, index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }
        return (
          <div className="form-group" key={component.id}>
            <Label className="form-label">
              {component.label}
              {component.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              className={cn(
                "form-control",
                formData[component.name] === "" && component.required && "border-red-500"
              )}
              type="number"
              name={component.name}
              placeholder={component.placeholder}
              value={formData[component.name] || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) || value === "") {
                  updateFormData(component.name, value === "" ? "" : parseInt(value));
                }
              }}
              required={component.required}
              min={component.validations?.min}
              max={component.validations?.max}
              onInvalid={(e: React.InvalidEvent<HTMLInputElement>) => {
                if (e.target.validity.valueMissing) {
                  e.target.setCustomValidity(`${component.label} is required`);
                } else if (e.target.validity.rangeUnderflow) {
                  e.target.setCustomValidity(
                    `${component.label} must be at least ${component.validations?.min}`
                  );
                } else if (e.target.validity.rangeOverflow) {
                  e.target.setCustomValidity(
                    `${component.label} must be at most ${component.validations?.max}`
                  );
                }
              }}
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                e.currentTarget.setCustomValidity("");
              }}
            />
            {formData[component.name] === "" && component.required && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
        );

      case "dropdown":
        return (
          <div className="form-group" key={component.id}>
            <Label className="form-label mb-2 block font-semibold text-gray-800">
              {component.label}
              {component.required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              required={component.required}
              onValueChange={(value) => updateFormData(component.name, value)}
              value={formData[component.name] || ""}
            >
              <SelectTrigger
                className={cn(
                  "w-full h-14 border-2 border-gray-200 rounded-xl bg-white",
                  "hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                  "transition-all duration-200 shadow-sm",
                  !formData[component.name] && "text-gray-600 font-semibold"
                )}
              >
                <SelectValue placeholder="Select an Option">
                  {formData[component.name] ? (
                    <div className="flex items-center gap-3">
                      {component.options?.find((opt) => opt.value === formData[component.name])
                        ?.imageUrl ? (
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              component.options?.find(
                                (opt) => opt.value === formData[component.name]
                              )?.imageUrl
                            }
                            alt=""
                            className="w-10 h-10 rounded-md object-cover border border-gray-100 shadow-sm"
                          />
                        </div>
                      ) : null}
                      <span className="text-gray-800 font-semibold text-lg truncate">
                        {component.options?.find((opt) => opt.value === formData[component.name])
                          ?.label || "Selected Option"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-600 font-semibold text-lg">Select an Option</span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-72 overflow-y-auto p-2">
                {component.options?.map((option) => (
                  <SelectItem
                    key={option.id}
                    value={option.value}
                    className={cn(
                      "flex items-center gap-3 p-3 mb-2 rounded-lg",
                      "bg-white border border-gray-100 shadow-sm",
                      "hover:bg-gray-50 cursor-pointer transition-colors duration-200",
                      formData[component.name] === option.value &&
                      "bg-blue-100 border-blue-400 shadow-md font-bold text-blue-700"
                    )}
                  >
                    {option.imageUrl && (
                      <div className="relative flex-shrink-0">
                        <img
                          src={option.imageUrl}
                          alt={option.label}
                          className="w-12 h-12 rounded-md object-cover border border-gray-100 shadow-sm"
                        />
                      </div>
                    )}
                    <span className="text-gray-800 font-semibold text-base">{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "image-picker":
        return (
          <div className="form-group" key={component.id}>
            <Label className="form-label">
              {component.label}
              {component.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor={`file-upload-${component.id}`}
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                  >
                    <span>Upload an image</span>
                    <input
                      id={`file-upload-${component.id}`}
                      name={component.name}
                      type="file"
                      className="sr-only"
                      required={component.required}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          updateFormData(component.name, e.target.files[0]);
                        }
                      }}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                {formData[component.name] && (
                  <p className="text-xs text-green-500">
                    File selected: {formData[component.name].name}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case "section":
        return (
          <div
            className="form-section p-6 border rounded-lg bg-gray-50/50 shadow-sm"
            key={component.id}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {component.label}
              {component.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            <div className="space-y-4">
              {component.children?.map((child) => renderFormComponent(child))}
            </div>
          </div>
        );
      case "button":
        const buttonIcons: { [key: string]: React.ComponentType<any> } = {
          Save: Save,
          ArrowRightCircle: ArrowRightCircle,
          Tag: Tag,
          Printer: Printer,
          BookOpen: BookOpen,
          QrCode: QrCode,
        };
        const IconComponent = buttonIcons[component.icon] || null;

        const getButtonStyle = () => {
          switch (component.buttonType) {
            case "save-product":
              return "bg-green-600 hover:bg-green-700 shadow-green-200";
            case "save-next":
              return "bg-blue-600 hover:bg-blue-700 shadow-blue-200";
            case "generate-sku":
              return "bg-purple-600 hover:bg-purple-700 shadow-purple-200";
            case "print-mrp":
              return "bg-orange-600 hover:bg-orange-700 shadow-orange-200";
            case "print-catalogue":
              return "bg-red-600 hover:bg-red-700 shadow-red-200";
            case "qr-code":
              return "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200";
            default:
              return "bg-gray-600 hover:bg-gray-700 shadow-gray-200";
          }
        };

        return (
          <div className="form-group" key={component.id}>
            <Button
              className={`
                w-full text-white font-semibold py-3 px-4 rounded-lg
                transition-all duration-200 transform hover:scale-[1.02]
                shadow-lg ${getButtonStyle()}
              `}
              onClick={() => {
                switch (component.label) {
                  case "Save Product":
                    toast.success("Product saved successfully!");
                    break;
                  case "Save and Next":
                    toast.success("Saved and moving to next!");
                    break;
                  case "Generate SKU":
                    toast.success("SKU generated!");
                    break;
                  case "Print MRP Label":
                    toast.success("Printing MRP label...");
                    break;
                  case "Print Catalogue Label":
                    toast.success("Printing catalogue label...");
                    break;
                  case "QR Code":
                    toast.success("QR Code generated!");
                    break;
                  default:
                    break;
                }
              }}
            >
              <span className="flex items-center gap-2 justify-center">
                {component.icon &&
                  buttonIcons[component.icon] &&
                  React.createElement(buttonIcons[component.icon], { className: "w-5 h-5" })}
                {component.label}
              </span>
            </Button>
          </div>
        );
      case "alphanumeric-input":
        return (
          <div className="form-group" key={component.id}>
            <Label className="form-label">
              {component.label}
              {component.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="flex gap-2">
              <Input
                className={cn(
                  "form-control",
                  formData[component.name] === "" && component.required && "border-red-500"
                )}
                type="text"
                name={component.name}
                placeholder={component.placeholder}
                value={formData[component.name] || ""}
                onChange={(e) => {
                  if (/^[a-zA-Z0-9-]*$/.test(e.target.value) || e.target.value === "") {
                    updateFormData(component.name, e.target.value);
                  }
                }}
                required={component.required}
                maxLength={component.validations?.maxLength}
              />
              {component.hasGenerateButton && (
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    const generatedValue = `${component.label}-${Math.random()
                      .toString(36)
                      .substr(2, 9)}`.toUpperCase();
                    updateFormData(component.name, generatedValue);
                    toast.success(`${component.label} generated successfully!`);
                  }}
                >
                  Generate {component.label}
                </Button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="generated-form animate-scale-in w-full max-w-5xl mx-auto">
      <div className="p-8 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Generated Form</h2>
            <p className="text-gray-600">Please fill out all the required fields below</p>
          </div>
          <Button
            onClick={editGeneratedForm}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Form
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-b-xl">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (validateForm()) {
              try {
                await submitForm();
                toast.success("Form submitted successfully!");
              } catch (error) {
                toast.error("Failed to submit form");
              }
            }
          }}
          className="p-8 space-y-8"
        >
          {generatedForm.map((component) => {
            if (
              generatedForm.some((parent) =>
                parent.type === "section" &&
                parent.children?.some((child) => child.id === component.id)
              )
            ) {
              return null;
            }
            return renderFormComponent(component);
          })}

          <div className="pt-6 border-t">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Publish Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};