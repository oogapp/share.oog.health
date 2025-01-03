
const Send = ({ className }: { className?: string }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width="42"
        height="32"
        fill="none"
        viewBox="0 0 42 32"
    >
        <g filter="url(#filter0_b_17376_3449)">
            <rect width="42" height="32" fill="#7FC311" rx="16"></rect>
            <g
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                clipPath="url(#clip0_17376_3449)"
            >
                <path d="m28.377 17.126-11.782 6.452c-1.068.584-2.32-.37-2.038-1.554l1.46-6.11-1.439-6.105c-.278-1.183.977-2.141 2.043-1.56l11.76 6.412c.975.531.972 1.93-.004 2.465M23.31 15.882l-7.26.05"></path>
            </g>
        </g>
        <defs>
            <clipPath id="clip0_17376_3449">
                <path fill="#fff" d="M10 5h22v22H10z"></path>
            </clipPath>
            <filter
                id="filter0_b_17376_3449"
                width="109.368"
                height="99.368"
                x="-33.684"
                y="-33.684"
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
            >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feGaussianBlur
                    in="BackgroundImageFix"
                    stdDeviation="16.842"
                ></feGaussianBlur>
                <feComposite
                    in2="SourceAlpha"
                    operator="in"
                    result="effect1_backgroundBlur_17376_3449"
                ></feComposite>
                <feBlend
                    in="SourceGraphic"
                    in2="effect1_backgroundBlur_17376_3449"
                    result="shape"
                ></feBlend>
            </filter>
        </defs>
    </svg>
);

export default Send;
