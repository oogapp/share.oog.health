'use client'

import { useMemo } from "react"
import { useVideoContext } from "./VideoBackgroundContext"

export const ChatBackgroundVideo = () => {

    const { isSearching, setIsSearching } = useVideoContext()

    const video = useMemo(() => {
        if (isSearching) {
            return "/video/searching.mp4"
        }
        else {
            return "/video/default.mp4"
        }
    }, [isSearching])

    return (
        <div>
            <video src={video} autoPlay loop muted playsInline className='absolute z-1 inset-0 object-cover' controlsList="nodownload"></video>
        </div>
    )

}
