'use server';

import { nanoid } from 'nanoid';
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { getAccessType, parseStringify } from '../utils';

export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
    const roomId = nanoid();

    try {
        const metadata = {
            creatorId: userId,
            email,
            title: 'Untitled Document',
        }

        const usersAccesses: RoomAccesses = {
            [email]: ["room:write"],
        }

        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: []
        });

        revalidatePath('/');

        return parseStringify(room);
    } catch (error) {
        console.error('Error creating document:', error);
        throw new Error('Failed to create document');
    }
}

export const getDocument = async ({ roomId, userId }: { roomId: string, userId: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        const hasAccess = Object.keys(room.usersAccesses).includes(userId);

        if (!hasAccess) {
            throw new Error('You do not have access to this document');
        }

        return parseStringify(room);
    } catch (error) {
        console.error('Error fetching document:', error);
        throw new Error('Failed to fetch document');
    }
}

export const getDocuments = async (email: string) => {
    try {
        const rooms = await liveblocks.getRooms({ userId: email});

        return parseStringify(rooms);
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw new Error('Failed to fetch documents');
    }
}

export const updateDocument = async (roomId: string, title: string) => {
    try {
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title,
            }
        })

        revalidatePath(`/documents/${roomId}`);

        return parseStringify(updatedRoom);
    } catch (error) {
        console.error('Error updating document:', error);
        throw new Error('Failed to update document');
    }
}

export const updateDocumentAccess = async ({roomId, email, userType, updatedBy }: ShareDocumentParams) => {
    try {
        const usersAccesses: RoomAccesses = {
            [email]: getAccessType(userType) as AccessType
        }

        const room = await liveblocks.updateRoom(roomId, {
            usersAccesses,
        });

        if (room) {
            // TOOD: Send a notification to the user
        }

        revalidatePath(`/documents/${roomId}`);

        return parseStringify(room);
    } catch (error) {
        console.error('Error updating document access:', error);
        throw new Error('Failed to update document access');
    }
}

export const removeCollaborator = async ({ roomId, email }: { roomId: string, email: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        if (room.metadata.email === email) {
            throw new Error('You cannot remove the owner of the document');
        }

        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [email]: null,
            },
        });

        revalidatePath(`/documents/${roomId}`);

        return parseStringify(updatedRoom);
    } catch (error) {
        console.error('Error removing collaborator:', error);
        throw new Error('Failed to remove collaborator');
    }
}