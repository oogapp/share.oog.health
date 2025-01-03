'use client'
import { parseReferences } from "./MessageV2";

export default function MedicalSearchText({ text }: { text: string }) {
    let t = parseReferences(text)
    t = t.replace(/\n\n/g, '<br><br>');
    return (
        <div dangerouslySetInnerHTML={{ __html: t }}></div>
    )
}
