import { useFormContext, Controller } from "react-hook-form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Locate } from "lucide-react";

export function PersonalDetailsStep() {
    const { register, control, setValue, formState: { errors } } = useFormContext();

    return (
        <div className="grid gap-4 py-4">
            {/* Profile Picture Upload - Removed, moved to parent form */}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="f_name">First Name <span className="text-red-500">*</span></Label>
                    <Input id="f_name" {...register("f_name")} placeholder="First Name" />
                    {errors.f_name && <p className="text-red-500 text-sm">{errors.f_name.message as string}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="l_name">Last Name <span className="text-red-500">*</span></Label>
                    <Input id="l_name" {...register("l_name")} placeholder="Last Name" />
                    {errors.l_name && <p className="text-red-500 text-sm">{errors.l_name.message as string}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="display_name">Display Name (Unique ID) <span className="text-red-500">*</span></Label>
                <Input id="display_name" {...register("display_name")} placeholder="firstname.lastname" />
                {errors.display_name && <p className="text-red-500 text-sm">{errors.display_name.message as string}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="designation">Designation <span className="text-red-500">*</span></Label>
                <Input id="designation" {...register("designation")} placeholder="Software Engineer" />
                {errors.designation && <p className="text-red-500 text-sm">{errors.designation.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone_no">Phone Number</Label>
                    <Input id="phone_no" {...register("phone_no")} placeholder="+91 9999999999" />
                    {errors.phone_no && <p className="text-red-500 text-sm">{errors.phone_no.message as string}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" {...register("email")} placeholder="yourname@example.com" />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="company_name">Company Name <span className="text-red-500">*</span></Label>
                <Input id="company_name" {...register("company_name")} placeholder="Acme Inc." />
                {errors.company_name && <p className="text-red-500 text-sm">{errors.company_name.message as string}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="company_description">About the Company</Label>
                <Textarea id="company_description" {...register("company_description")} placeholder="Describe your company..." rows={3} />
                {errors.company_description && <p className="text-red-500 text-sm">{errors.company_description.message as string}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="company_website">Company Website</Label>
                <Input id="company_website" {...register("company_website")} placeholder="https://yourcompany.com" />
                {errors.company_website && <p className="text-red-500 text-sm">{errors.company_website.message as string}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="map_url">Location Map URL</Label>
                <div className="flex gap-2">
                    <Input id="map_url" {...register("map_url")} placeholder="https://maps.google.com/..." className="flex-1" />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(
                                    (position) => {
                                        const { latitude, longitude } = position.coords;
                                        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                                        setValue('map_url', mapUrl, { shouldValidate: true, shouldDirty: true });
                                    },
                                    (error) => {
                                        alert('Unable to get your location. Please enable location services.');
                                    }
                                );
                            } else {
                                alert('Geolocation is not supported by your browser.');
                            }
                        }}
                        title="Use current location"
                        className="cursor-pointer"
                    >
                        <Locate className="w-4 h-4" />
                    </Button>
                </div>
                <p className="text-xs text-gray-500">Paste Google Maps link or click the pin to use current location</p>
                {errors.map_url && <p className="text-red-500 text-sm">{errors.map_url.message as string}</p>}
            </div>
        </div>
    );
}
