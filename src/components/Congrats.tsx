'use client'
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContentWithoutOverlay
} from "@/components/ui/drawer";
import * as animationData from '@/lib/ce-earned-pillow.json';
import Link from 'next/link';
import { useState } from 'react';
import Lottie from 'react-lottie';
import 'stream-chat-react/dist/css/v2/index.css';

export default function Congrats() {
    const [showAnimation, setShowAnimation] = useState(true);
    return (
        <div className=''>
            {showAnimation && <div className="absolute inset-0 backdrop-blur-xl z-[50] p-10">
                <Lottie options={{
                    loop: true,
                    autoplay: showAnimation,
                    animationData: animationData,
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }} />
            </div>}


            <Drawer open={showAnimation}>
                <DrawerContentWithoutOverlay>
                    <div className="p-5 flex flex-col space-y-8">
                        <h1 className="text-2xl font-bold text-center">Congratulations!</h1>
                        <div className="space-y-4 text-center flex flex-col">
                            <Button asChild>
                                <Link href="/ce">Download Certificate</Link>
                            </Button>
                            <Button>
                                <Link href="/">Earn more ce</Link>
                            </Button>
                        </div>
                    </div>
                </DrawerContentWithoutOverlay>
            </Drawer>
        </div>
    )
}
