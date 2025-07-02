'use client';

import React, { useEffect, useState } from 'react';
import Theme from './plugins/Theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import FloatingToolbar from './plugins/FloatingToolbarPlugin';
import { HeadingNode } from '@lexical/rich-text';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import {
    FloatingComposer,
    FloatingThreads,
    liveblocksConfig,
    LiveblocksPlugin,
} from '@liveblocks/react-lexical';
import { useSyncStatus, useThreads } from '@liveblocks/react/suspense';
import Loader from '../Loader';
import Comments from '../Comments';
import DeleteModal from '../DeleteModal';

function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
}

export function Editor({
    roomId,
    currentUserType,
}: {
    roomId: string;
    currentUserType: UserType;
}) {
    const status = useSyncStatus({ smooth: true });
    const { threads } = useThreads();

    const [initialSync, setInitialSync] = useState(true);

    useEffect(() => {
        if (status === 'synchronized') {
            setInitialSync(false);
        }
    }, [status]);

    const initialConfig = liveblocksConfig({
        namespace: 'Editor',
        nodes: [HeadingNode],
        onError: (error: Error) => {
            console.error(error);
            throw error;
        },
        theme: Theme,
        editable: currentUserType === 'editor',
    });

    if (initialSync) {
        return <Loader />;
    }

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container size-full">
                <div className="toolbar-wrapper flex min-w-full justify-between">
                    <ToolbarPlugin />

                    {currentUserType === 'editor' && (
                        <DeleteModal roomId={roomId} />
                    )}
                </div>

                <div className="editor-wrapper flex flex-col items-center justify-start">
                    <div className="editor-inner min-h-[1100px] relative mb-5 h-fit w-full max-w-[800px] shadow-md lg:mb-10">
                        <RichTextPlugin
                            contentEditable={<ContentEditable className="editor-input h-full" />}
                            placeholder={<Placeholder />}
                            ErrorBoundary={LexicalErrorBoundary}
                        />

                        {currentUserType === 'editor' && <FloatingToolbar />}

                        <HistoryPlugin />

                        <AutoFocusPlugin />
                    </div>

                    <LiveblocksPlugin>
                        <FloatingComposer className="w-[350px]" />

                        <FloatingThreads threads={threads} />

                        <Comments />
                    </LiveblocksPlugin>
                </div>
            </div>
        </LexicalComposer>
    );
}
