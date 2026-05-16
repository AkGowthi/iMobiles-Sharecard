import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

interface EmptySectionPlaceholderProps {
    title: string;
    description: string;
    actionLink: string;
}

export function EmptySectionPlaceholder({ title, description, actionLink }: EmptySectionPlaceholderProps) {
    return (
        <div className="mb-4">
            {/* <h3 className="text-lg font-bold my-2 flex items-center gap-2 text-gray-400">
                {title}
            </h3> */}
            <Link href={actionLink}>
                <Card className="border-dashed border-2 border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group">
                    <CardContent className="flex flex-col items-center justify-center py-2 text-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <PlusCircle className="w-5 h-5 text-gray-500" />
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Add {title}</p>
                        {/* <p className="text-xs text-gray-500 mt-1 max-w-[200px]">{description}</p> */}
                    </CardContent>
                </Card>
            </Link>
        </div>
    );
}
