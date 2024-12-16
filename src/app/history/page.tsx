import SearchHistory from "@/components/SearchHistory";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
    title: "Previous",
};


export default function SearchHistoryPage() {

    return (
        <div>
            <div className="p-3 flex items-center">
                <Link href="/chat">
                    <ChevronLeft className="h-6 w-6" />
                </Link>
            </div>
            <div className="my-">
                <SearchHistory />
            </div>
        </div>
    )
}
