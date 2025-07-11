'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useUnreadInboxNotificationsCount } from "@liveblocks/react";
import { InboxNotification, InboxNotificationList, LiveblocksUiConfig } from "@liveblocks/react-ui";
import { useInboxNotifications } from "@liveblocks/react/suspense";
import Image from "next/image";
import { ReactNode } from "react";


const Notification = () => {
    const { inboxNotifications } = useInboxNotifications();
    const { count } = useUnreadInboxNotificationsCount();

    const unreadNotifications = inboxNotifications.filter((notification) => !notification.readAt);

    return (
        <Popover>
            <PopoverTrigger className="relative flex size-10 items-center justify-center rounder-lg">
                <Image
                    src={'/icons/bell.svg'}
                    alt={'inbox'}
                    width={24}
                    height={24}
                />

                {count! > 0 && (
                    <div className="absolute right-2 top-2 z-20 size-2 rounded-full bg-blue-500" />
                )}
            </PopoverTrigger>

            <PopoverContent align="end" className="shad-popover">
                <LiveblocksUiConfig
                    overrides={{
                        INBOX_NOTIFICATION_TEXT_MENTION: (user: ReactNode) => (
                            <>{user} mentioned you.</>
                        )
                    }}
                >
                    <InboxNotificationList>
                        {unreadNotifications.length <= 0 && (
                            <p className="py-2 text-center text-dark-500">
                                No new notifications
                            </p>
                        )}
                        {unreadNotifications.length > 0 && unreadNotifications.map((notification) => (
                            <InboxNotification
                                key={notification.id}
                                inboxNotification={notification}
                                className="bg-dark-200 text-white"
                                href={`/documents/${notification.roomId}`}
                                showActions={false}
                                kinds={{
                                    thread: (props) => (
                                        <InboxNotification.Thread
                                            {...props}
                                            showActions={false}
                                            showRoomName={false}
                                        />
                                    ),
                                    textMention: (props) => (
                                        <InboxNotification.TextMention
                                            {...props}
                                            showRoomName={false}
                                        />
                                    ),
                                    $documentAccess: (props) => (
                                        <InboxNotification.Custom
                                            {...props}
                                            title={props.inboxNotification.activities[0].data.title}
                                            aside={
                                                <InboxNotification.Icon className="bg-transparent">
                                                    <Image
                                                        src={props.inboxNotification.activities[0].data.avatar as string || ''}
                                                        alt="avatar"
                                                        width={36}
                                                        height={36}
                                                        className="rounded-full"
                                                    />

                                                </InboxNotification.Icon>
                                            }
                                        >
                                            {props.children}
                                        </InboxNotification.Custom>
                                    )
                                }}
                            />
                        ))}
                    </InboxNotificationList>
                </LiveblocksUiConfig>
            </PopoverContent>
        </Popover>
    );
};

export default Notification;