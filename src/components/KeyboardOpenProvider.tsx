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
    useEffect(() => {
        if (!viewportSize) return
        let h = viewportSize[1]
        document.body.style.height = `${h}px`
    }, [viewportSize])

    return (
        <KeyboardOpenContext.Provider value={{ isOpen, setOpen }}>
            {children}
        </KeyboardOpenContext.Provider>
    );
};

export const useKeyboardOpenContext = () => useContext(KeyboardOpenContext);
