'use client'
import useViewportSize from "@/lib/use-viewport-size";
// create a video context to switch the video background based on if the user is currentlying searching
import { createContext, useContext, useEffect, useState } from "react";

export const KeyboardOpenContext = createContext({
    isOpen: false,
    setOpen: (isOpen: boolean) => { },
});

export const KeyboardOpenContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setOpen] = useState(false);
    const viewportSize = useViewportSize()

    console.log("viewportSize", viewportSize)

    useEffect(() => {
        if (!viewportSize) return
        let h = viewportSize[1]
        console.log(`setting body height to ${h}`)
        document.body.style.height = `${h}px`
    }, [viewportSize])

    /*useEffect(() => {
        if (isOpen) {
            let h = window?.visualViewport?.height
            if (h) {
                console.log(`setting body height to ${h}`)
                document.body.style.height = `${h}px`
                document.body.style.overflowX = 'hidden'
            }

        } else {
            console.log(`resetting body height`)
            // reset the body height and overflow-x
            document.body.style.height = ''
            document.body.style.overflowX = ''
        }
    }, [isOpen]);*/

    return (
        <KeyboardOpenContext.Provider value={{ isOpen, setOpen }}>
            {children}
        </KeyboardOpenContext.Provider>
    );
};

export const useKeyboardOpenContext = () => useContext(KeyboardOpenContext);
