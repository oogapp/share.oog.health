import { OpenEvidenceReference } from "@/gql/graphql";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";



export default function Citation({ citation }: { citation: OpenEvidenceReference }) {
    if (!citation) return null

    function handleClick(e: any) {
        let wk = (window as any).webkit
        if (wk?.messageHandlers?.openArticle) {
            e.preventDefault()
            let url = citation?.referenceDetail?.url
            let payload = {
                type: "openArticle",
                payload: { "url": url }
            }
            wk.messageHandlers.openArticle.postMessage(payload)
        } else {
            console.log("No message handler")
        }
    }

    return (
        <div className="py-8 px-4 w-full ">
            <div className="border-b border-gray-600 space-y-4 w-full">
                <div className="text-lg">
                    {citation?.referenceDetail?.title}
                </div>
                <div className="text-sm  text-gray-400">
                    {citation?.referenceDetail?.publicationInfoString}
                </div>
                {citation?.referenceDetail?.url && <div className="">
                    <Button asChild>
                        <Link onClick={handleClick} className="flex items-center" target="new" href={citation?.referenceDetail?.url}>
                            View Source <ExternalLink className="w-5 h-5" />
                        </Link>
                    </Button>
                </div>}
            </div>
        </div>
    )
}
