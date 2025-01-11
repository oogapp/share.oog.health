'use client'
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
// create a video context to switch the video background based on if the user is currentlying searching
import { createContext, useContext, useEffect, useState } from "react";

export const KeyboardOpenContext = createContext({
    isOpen: false,
    setOpen: (isOpen: boolean) => { },
});

export const KeyboardOpenContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            console.log("disableBodyScroll");
            disableBodyScroll(document.body, { reserveScrollBarGap: true });
        } else {
            enableBodyScroll(document.body);
        }
    }, [isOpen]);

    return (
        <KeyboardOpenContext.Provider value={{ isOpen, setOpen }}>
            {children}
        </KeyboardOpenContext.Provider>
    );
};

export const useKeyboardOpenContext = () => useContext(KeyboardOpenContext);
