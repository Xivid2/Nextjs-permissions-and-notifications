'use client';

import { useSelf } from "@liveblocks/react/suspense";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";
import { updateDocumentAccess } from "@/lib/actions/room.actions";

const ShareModal = ({ roomId, collaborators, creatorId, currentUserType }: ShareDocumentDialogProps) => {
    const user = useSelf();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [userType, setUserType] = useState<UserType>("viewer");

    const shareDocumentHandler = async () => {
        setLoading(true);

        await updateDocumentAccess({
            roomId,
            email,
            userType,
            updatedBy: user.info,
        });

        setLoading(false);
    }

    return (
       <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <div
                    role="button"
                    style={{ pointerEvents: currentUserType !== 'editor' ? 'none' : 'auto' }}
                    className="gradient-blue flex h-9 gap-1 px-4 items-center"
                >
                    <Image
                        src={'/icons/share.svg'}
                        alt={"Share"}
                        width={20}
                        height={20}
                        className="min-w-4 md:size-5"
                    />

                    <p className="mr-1 hidden sm:block">
                        Share
                    </p>
                </div>
            </DialogTrigger>

            <DialogContent className="shad-dialog">
                <DialogHeader>
                    <DialogTitle>Manage who can view this project</DialogTitle>

                    <DialogDescription>
                        Select which users can view and edit this document
                    </DialogDescription>
                </DialogHeader>

                <Label htmlFor="email" className="mt-6 text-blue-100">
                    Email address
                </Label>

                <div className="flex items-center gap-3">
                    <div className="flex flex-1 rounded-md bg-dark-400">
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="share-input"
                        />

                        <UserTypeSelector
                            userType={userType}
                            setUserType={setUserType}
                        />
                    </div>

                    <Button
                        type={"submit"}
                        className="gradient-blue flex h-full gap-1 px-5"
                        disabled={!email || !userType || loading}
                        onClick={shareDocumentHandler}
                    >
                        {loading ? "Sharing..." : "Share"}
                    </Button>
                </div>

                <div className="my-2 space-y-2">
                    <ul className="flex flex-col">
                        {collaborators.map((collaborator) => (
                            <Collaborator
                                key={collaborator.id}
                                roomId={roomId}
                                creatorId={creatorId}
                                email={collaborator.email}
                                collaborator={collaborator}
                                user={user.info}
                            />
                        ))}
                    </ul>

                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ShareModal;