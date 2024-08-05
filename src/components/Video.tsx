'use client'
import classNames from "classnames"
import Hls from "hls.js"
import { useEffect, useRef, useState } from "react"

export default function Video({ url }: { url: string }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        if (url && videoRef.current) {
            if (Hls.isSupported()) {
                const hls = new Hls()
                hls.loadSource(url!)
                hls.attachMedia(videoRef.current)
                hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                    videoRef.current?.play()
                    setPlaying(true)
                })
            } else {
                videoRef.current.src = url
                setPlaying(true)
            }
        }
    }, [url])

    return (
        <video
            controls={false}
            ref={videoRef}
            muted={true}
            className={classNames("h-full absolute top-0 left-0 w-full object-cover", {
                "hidden": !playing
            })}
            playsInline={true}
            preload="auto"
            src={url}
            autoPlay={true}>
        </video>
    )
}
