import { OpenGraphReference } from "@/gql/graphql";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Reference({ reference }: { reference: OpenGraphReference }) {
    if (!reference) return null

    let domain = new URL(reference.url).hostname

    return (
        <div className="flex p-3">
            <div className="border-b border-gray-600 space-y-4">
                <div className="text-lg">
                    {reference.title}
                </div>
                <div className="text-sm">
                    {reference?.description}
                </div>
                <div className="text-sm  text-gray-400">
                    {domain}
                </div>
                <div>
                    <Button asChild>
                        <Link className="flex items-center" target="new" href={reference?.url}>
                            View Source <ExternalLink className="w-5 h-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
