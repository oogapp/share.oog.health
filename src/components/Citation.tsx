import { OpenEvidenceReference } from "@/gql/graphql";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Citation({ citation }: { citation: OpenEvidenceReference }) {
    if (!citation) return null
    return (
        <div className="flex p-3">
            <div className="border-b border-gray-600 space-y-2">
                <div className="text-lg">
                    {citation?.referenceDetail?.title}
                </div>
                <div className="text-sm">
                    {citation?.referenceDetail?.authorsString}
                </div>
                <div className="text-sm  text-gray-400">
                    {citation?.referenceDetail?.publicationInfoString}
                </div>
                <div>
                    <Button size='sm' asChild>
                        <Link className="flex items-center" target="new" href={citation.referenceDetail.url}>
                            View Source <ExternalLink className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}