import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Package } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Hook to access products field array
export function useProductsFieldArray() {
    const { control } = useFormContext();
    return useFieldArray({
        control,
        name: "products"
    });
}

export function ProductsAddButton({ fields, onAdd }: { fields: any[], onAdd: () => void }) {
    const isMaxReached = fields.length >= 10;

    return (
        <div className="flex items-center gap-3">
            <Button
                type="button"
                onClick={onAdd}
                className="gap-2 cursor-pointer"
                size="sm"
                variant="default"
                disabled={isMaxReached}
            >
                <PlusCircle className="w-4 h-4" />
                Add Product
            </Button>
            <span className="text-sm text-muted-foreground">
                {fields.length}/10 products
            </span>
        </div>
    );
}

export function ProductsStepContent({ fields, remove, append }: { fields: any[], remove: (index: number) => void, append: (data: any) => void }) {
    const { register, control, watch, formState: { errors } } = useFormContext();

    const watchedProducts = watch("products");

    return (
        <div className="max-w-md mx-auto">
            <div className="grid gap-6">
                {fields.map((field, index) => {
                    const currentType = watchedProducts?.[index]?.prod_type || (field as any).prod_type || "Physical";

                    return (
                        <Card key={field.id} className="relative overflow-hidden transition-all hover:shadow-md">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <CardTitle className="text-base font-semibold">
                                    Product #{index + 1}
                                </CardTitle>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 h-8 cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Remove
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete <b>{field.prod_name || `Product #${index + 1}`}</b>.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => remove(index)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardHeader>

                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Product Type Selection */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium uppercase text-muted-foreground">Product Category</Label>
                                        <Controller
                                            control={control}
                                            name={`products.${index}.prod_type`}
                                            defaultValue="Physical"
                                            render={({ field: { onChange, value } }) => (
                                                <Select value={value} onValueChange={onChange}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Physical">Physical Product</SelectItem>
                                                        <SelectItem value="IT">IT Product / Service</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>

                                    {/* Product Name */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium uppercase text-muted-foreground">Product Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            {...register(`products.${index}.prod_name`)}
                                            placeholder="e.g. Digital Business Card"
                                            className="font-medium"
                                        />
                                        {(errors.products as any)?.[index]?.prod_name && (
                                            <p className="text-red-500 text-xs mt-1">{(errors.products as any)[index].prod_name.message as string}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Product/Service URL - Conditional label based on type */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                                        {currentType === "Physical" ? "Product Purchase URL" : "Product/Service URL"}
                                    </Label>
                                    <Input
                                        {...register(`products.${index}.prod_url`)}
                                        placeholder={currentType === "Physical" ? "https://example.com/buy-product" : "https://nutz.in"}
                                        type="url"
                                    />
                                    {(errors.products as any)?.[index]?.prod_url && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {(errors.products as any)[index].prod_url.message as string}
                                        </p>
                                    )}
                                </div>

                                {/* Price Field - Hidden if IT Product */}
                                {currentType !== "IT" && (
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium uppercase text-muted-foreground">Price</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">₹</span>
                                            <Input
                                                type="number"
                                                {...register(`products.${index}.prod_price`, { valueAsNumber: true })}
                                                className="pl-8"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label className="text-xs font-medium uppercase text-muted-foreground">Description <span className="text-red-500">*</span></Label>
                                    <Textarea
                                        {...register(`products.${index}.prod_description`)}
                                        placeholder="Briefly describe your product or service..."
                                        className="resize-none min-h-[80px]"
                                    />
                                    {(errors.products as any)?.[index]?.prod_description && (
                                        <p className="text-red-500 text-xs mt-1">{(errors.products as any)[index].prod_description.message as string}</p>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium uppercase text-muted-foreground">Product Images (Max 4)</Label>
                                    <Controller
                                        control={control}
                                        name={`products.${index}.prod_images`}
                                        defaultValue={[]}
                                        render={({ field: { onChange, value } }) => {
                                            // Ensure value is always an array
                                            const normalizedValue = (() => {
                                                if (Array.isArray(value)) return value;
                                                if (value === null || value === undefined) return [];
                                                if (typeof value === 'string') {
                                                    try {
                                                        const parsed = JSON.parse(value);
                                                        return Array.isArray(parsed) ? parsed : [];
                                                    } catch {
                                                        return [];
                                                    }
                                                }
                                                return [];
                                            })();
                                            
                                            return (
                                                <ImageUpload
                                                    value={normalizedValue}
                                                    onChange={onChange}
                                                    maxImages={4}
                                                />
                                            );
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {
                fields.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/10">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                            <Package className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-medium text-foreground">No products added</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                            Start adding your products to showcase them on your card.
                        </p>
                        <Button
                            type="button"
                            variant="link"
                            onClick={() => append({ prod_name: "", prod_price: 0, prod_type: "Physical", prod_description: "", prod_url: "" })}
                            className="mt-2 text-primary cursor-pointer"
                        >
                            Add your first product
                        </Button>
                    </div>
                )
            }
        </div >
    );
}
