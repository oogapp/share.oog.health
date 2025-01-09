'use client'

import { useMemo } from "react"
import { useVideoContext } from "./VideoBackgroundContext"

export const ChatBackgroundVideo = () => {

    const { isSearching } = useVideoContext()

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
            <video autoPlay loop muted className='absolute inset-0 object-cover'>
                <source src={video} type="video/mp4" />
            </video>
        </div>
    )

}
