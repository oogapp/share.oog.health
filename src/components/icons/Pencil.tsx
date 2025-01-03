
const Pencil = ({ className }: { className?: string }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
    >
        <path
            stroke="#fff"
            strokeLinecap="round"
            strokeWidth="1.5"
            d="M19 16.024V17.5a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-7a5 5 0 0 1 5-5h1.652"
        ></path>
        <path
            fill="#fff"
            stroke="#fff"
            strokeWidth="0.2"
            d="M7.464 17.113a.6.6 0 0 1-.154-.582zm0 0c.152.153.375.211.582.154l4.22-1.169c.099-.027.19-.08.263-.153l8.886-8.887a2.344 2.344 0 0 0 0-3.311l-.585-.585a2.34 2.34 0 0 0-3.311 0l-8.886 8.887a.6.6 0 0 0-.154.263L7.311 16.53zm13.105-10.9-.457.457-2.205-2.205.458-.457a1.145 1.145 0 0 1 1.62 0l.584.584a1.147 1.147 0 0 1 0 1.62ZM9.93 12.442l7.131-7.132 2.205 2.204-7.132 7.132zm-1.185 3.389.626-2.257 1.631 1.632z"
        ></path>
    </svg>
);

export default Pencil;
