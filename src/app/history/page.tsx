import SearchHistory from "@/components/SearchHistory";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Previous Searches",
};


export default function SearchHistoryPage() {

    return (
        <div>
            <div className="my-">
                <SearchHistory />
            </div>
        </div>
    )
}
