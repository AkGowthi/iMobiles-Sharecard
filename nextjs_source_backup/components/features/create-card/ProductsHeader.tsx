import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PlusCircle, Package } from "lucide-react";
import { ProductsAddButton } from "./steps/ProductsStep";
import { ProductsStepContent } from "./steps/ProductsStep";

export function ProductsHeader() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "products"
    });

    const handleAddProduct = () => {
        append({ prod_name: "", prod_price: 0, prod_type: "Physical", prod_description: "", prod_url: "" });
    };

    return (
        <div className="space-y-4">
            <ProductsStepContent fields={fields} remove={remove} append={append} />

            {/* Only show Add button here if we have products (empty state handled in content) */}
            {fields.length > 0 && (
                <div className="flex items-center justify-center pt-2">
                    <ProductsAddButton
                        fields={fields}
                        onAdd={handleAddProduct}
                    />
                </div>
            )}
        </div>
    );
}
