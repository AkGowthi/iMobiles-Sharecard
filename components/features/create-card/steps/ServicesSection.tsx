
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
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

export function ServicesSection() {
    const { register, control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "services", // Expecting array of strings, but useFieldArray works best with objects. 
        // If schema is array of strings, we need a wrapper or map manually.
        // Actually for simplicity let's assume we map it, 
        // BUT useFieldArray needs objects with 'id'.
        // So we'll treat 'services' as { value: string }[] locally?
        // Or we can just use a simple state if we don't want complex field array overhead for strings.
        // Let's try standard mapping.
    });

    // WAIT: Schema is z.array(z.string()). useFieldArray REQUIRES objects.
    // Hack: We will manage this manually with state or valid react-hook-form pattern for primitives.
    // It's cleaner to change schema to objects { name: string }, but simpler to just handle it here.

    // Changing approach: Use a simple local list management synced to RHF? 
    // No, RHF is best.
    // Let's update schema to z.array(z.object({ name: z.string() })) ? 
    // No, that breaks compatibility with old data easily.

    // Let's iterate on the current values directly from watch()
    const { watch, setValue } = useFormContext();
    const services = watch("services") || [];

    const addService = () => {
        setValue("services", [...services, ""]);
    };

    const removeService = (index: number) => {
        const newServices = [...services];
        newServices.splice(index, 1);
        setValue("services", newServices);
    };

    const updateService = (index: number, value: string) => {
        const newServices = [...services];
        newServices[index] = value;
        setValue("services", newServices);
    };

    return (
        <div className="space-y-4">
            {services.map((service: string, index: number) => (
                <div key={index} className="flex gap-2">
                    <Input
                        value={service}
                        onChange={(e) => updateService(index, e.target.value)}
                        placeholder="Service Name"
                    />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="cursor-pointer">
                                <X className="w-4 h-4 text-red-500" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Service?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this service.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => removeService(index)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={addService} className="cursor-pointer">
                + Add service
            </Button>
        </div>
    );
}
