"use client"

import { Editor } from "@/components/editor/Editor";
import Header from "@/components/Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react"
import Loader from "./Loader";
import ActiveCollaborators from "./ActiveCollaborators";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { updateDocument } from "@/lib/actions/room.actions";

const CollaborativeRoom = ({ roomId, roomMetadata, users, currentUserType }: CollaborativeRoomProps) => {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [documentTitle, setDocumentTitle] = useState(roomMetadata?.title || "Untitled Document");

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setLoading(true);

            const titleToUse = documentTitle.trim();

            try {
                if (titleToUse !== roomMetadata.title) {
                    const updatedDocument = await updateDocument(roomId, titleToUse)

                    if (updatedDocument) {
                        setEditing(false);
                    }
                }
            } catch (error) {
                console.error("Error updating title:", error);
            }
            
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setEditing(false);
                updateDocument(roomId, documentTitle.trim())
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [roomId, documentTitle])

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader />}>
                <div className="collaborative-room">
                    <Header>
                        <div ref={containerRef} className="flex w-fit items-center justify-center gap-2">
                            {editing && !loading ? (
                                <Input
                                    type="text"
                                    value={documentTitle}
                                    ref={inputRef}
                                    placeholder="Enter title"
                                    onChange={(e) => setDocumentTitle(e.target.value)}
                                    onKeyDown={updateTitleHandler}
                                    disabled={!editing}
                                    className="document-title-input"
                                />
                            ) : (
                                <>
                                    <p className="document-title">
                                        {documentTitle}
                                    </p>
                                </>
                            )}
                        </div>

                        {currentUserType === "editor" && !editing && (
                            <Image
                                src={"/icons/edit.svg"}
                                alt="Edit"
                                width={24}
                                height={24}
                                onClick={() => setEditing(true)}
                                className="pointer"
                            />
                        )}

                        {currentUserType !== "editor" && !editing && (
                            <p className="view-only-tag">
                                View Only
                            </p>
                        )}

                        {loading && (
                            <p className="text-sm text-gray-400">
                                Saving...
                            </p>
                        )}

                        <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
                            <ActiveCollaborators />

                            <SignedOut>
                                <SignInButton />
                            </SignedOut>

                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </Header>

                    <Editor roomId={roomId} currentUserType={currentUserType} />
                </div>
            </ClientSideSuspense>
      </RoomProvider>
    )
}

export default CollaborativeRoom;