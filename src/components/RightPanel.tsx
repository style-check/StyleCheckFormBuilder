import React from "react";
import { useFormContext } from "@/context/FormContext";
import { Trash2, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Option } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const RightPanel = () => {
  const { selectedComponent, updateComponent, removeComponent } =
    useFormContext();

  if (!selectedComponent) {
    return (
      <div className="w-1/4 p-4 border-l bg-secondary/40 h-[calc(100vh-73px)] overflow-y-auto">
        <div className="text-center p-8 h-full flex flex-col items-center justify-center text-muted-foreground">
          <p className="text-sm">
            Select a component from the canvas to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateComponent(selectedComponent.id, {
      name: e.target.value,
    });
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateComponent(selectedComponent.id, {
      label: e.target.value,
    });
  };

  const handleRequiredChange = (checked: boolean) => {
    updateComponent(selectedComponent.id, {
      required: checked,
    });
  };

  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateComponent(selectedComponent.id, {
      placeholder: e.target.value,
    });
  };

  const handleAddOption = () => {
    const newOption: Option = {
      id: uuidv4(),
      label: `Option ${(selectedComponent.options?.length || 0) + 1}`,
      value: `option_${(selectedComponent.options?.length || 0) + 1}`,
    };

    updateComponent(selectedComponent.id, {
      options: [...(selectedComponent.options || []), newOption],
    });
  };

  const handleOptionLabelChange = (
    optionId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedOptions = selectedComponent.options?.map((option) =>
      option.id === optionId
        ? { ...option, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, "_") }
        : option
    );

    updateComponent(selectedComponent.id, {
      options: updatedOptions,
    });
  };

  const handleRemoveOption = (optionId: string) => {
    const updatedOptions = selectedComponent.options?.filter(
      (option) => option.id !== optionId
    );

    updateComponent(selectedComponent.id, {
      options: updatedOptions,
    });
  };

  const handleOptionImageUpload = async (optionId: string, file: File) => {
    // In a real app, you would upload to a server and get back a URL
    // For now, we'll create a local URL
    const imageUrl = URL.createObjectURL(file);
    
    const updatedOptions = selectedComponent.options?.map((option) =>
      option.id === optionId
        ? { ...option, imageUrl }
        : option
    );

    updateComponent(selectedComponent.id, {
      options: updatedOptions,
    });
  };

  const handleDelete = () => {
    removeComponent(selectedComponent.id);
  };

  return (
    <div className="w-1/4 p-4 border-l bg-secondary/40 h-[calc(100vh-73px)] overflow-y-auto">
      <div className="properties-panel">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Properties</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={selectedComponent.name}
              onChange={handleNameChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={selectedComponent.label}
              onChange={handleLabelChange}
            />
          </div>

          {selectedComponent.type !== 'button' && (
            <>
              <div className="flex items-center justify-between">
                <Label htmlFor="required">Required</Label>
                <Switch
                  id="required"
                  checked={selectedComponent.required}
                  onCheckedChange={handleRequiredChange}
                />
              </div>

              {["text-input", "number-input"].includes(selectedComponent.type) && (
                <div className="space-y-2">
                  <Label htmlFor="placeholder">Placeholder</Label>
                  <Input
                    id="placeholder"
                    value={selectedComponent.placeholder || ""}
                    onChange={handlePlaceholderChange}
                  />
                </div>
              )}

              {["dropdown", "radio-group", "checkbox-group"].includes(
                selectedComponent.type
              ) && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Options</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddOption}
                      className="h-8 gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {selectedComponent.options?.map((option) => (
                      <div key={option.id} className="space-y-2 p-4 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Input
                            value={option.label}
                            onChange={(e) => handleOptionLabelChange(option.id, e)}
                            className="flex-grow"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveOption(option.id)}
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="mt-2">
                          <Label>Option Image</Label>
                          <div className="mt-1 flex items-center gap-4">
                            {option.imageUrl ? (
                              <div className="relative w-16 h-16">
                                <img
                                  src={option.imageUrl}
                                  alt={option.label}
                                  className="w-full h-full object-cover rounded-md"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                  onClick={() => {
                                    const updatedOptions = selectedComponent.options?.map((o) =>
                                      o.id === option.id ? { ...o, imageUrl: undefined } : o
                                    );
                                    updateComponent(selectedComponent.id, { options: updatedOptions });
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleOptionImageUpload(option.id, file);
                                  }
                                }}
                                className="flex-grow"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedComponent.type === "number-input" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="min">Minimum Value</Label>
                    <Input
                      id="min"
                      type="number"
                      value={selectedComponent.validations?.min || 0}
                      onChange={(e) =>
                        updateComponent(selectedComponent.id, {
                          validations: {
                            ...selectedComponent.validations,
                            min: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max">Maximum Value</Label>
                    <Input
                      id="max"
                      type="number"
                      value={selectedComponent.validations?.max || 100}
                      onChange={(e) =>
                        updateComponent(selectedComponent.id, {
                          validations: {
                            ...selectedComponent.validations,
                            max: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </>
              )}

              {selectedComponent.type === "text-input" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={selectedComponent.validations?.minLength || 0}
                      onChange={(e) =>
                        updateComponent(selectedComponent.id, {
                          validations: {
                            ...selectedComponent.validations,
                            minLength: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLength">Maximum Length</Label>
                    <Input
                      id="maxLength"
                      type="number"
                      value={selectedComponent.validations?.maxLength || 100}
                      onChange={(e) =>
                        updateComponent(selectedComponent.id, {
                          validations: {
                            ...selectedComponent.validations,
                            maxLength: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
