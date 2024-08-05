import { User } from "@/gql/graphql"
import classNames from "classnames"

interface UserAvatarProps {
    size?: 'sm' | 'md' | 'lg',
    user: User | null | undefined
}

export default function UserAvatar({ user, size }: UserAvatarProps) {

    if (!size) {
        size = "md"
    }

    return (
        <>
            {!user?.profileImage && <div className={classNames("rounded-full border-2 border-gray-900 bg-gray-900", {
                'h-4 w-4': size === 'sm',
                'h-8 w-8': size === 'md',
                'h-16 w-16': size === 'lg',
            })} />}
            {user?.profileImage != null && <img src={`${user.profileImage?.url}w=200`} alt="" className={classNames("rounded-full border-2 border-gray-900 bg-gray-900", {
                'h-4 w-4': size === 'sm',
                'h-8 w-8': size === 'md',
                'h-12 w-12': size === 'lg',
            })} />}

        </>
    )
}
