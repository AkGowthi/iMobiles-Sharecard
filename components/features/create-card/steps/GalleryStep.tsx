import { useFormContext, Controller } from "react-hook-form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Label } from "@/components/ui/label";

export function GalleryStep() {
    const { control } = useFormContext();

    return (
        <div>
            <div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        {/* <Label className="text-lg font-medium">Gallery Images</Label> */}
                        <p className="text-sm text-muted-foreground">
                            You can add up to 6 images.
                        </p>
                    </div>

                    <Controller
                        control={control}
                        name="gallery"
                        defaultValue={[]}
                        render={({ field: { onChange, value } }) => (
                            <ImageUpload
                                value={value || []}
                                onChange={onChange}
                                maxImages={6}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
