import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, convertToRaw, ContentState, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertFromHTML } from 'draft-convert';

const sampleData = {
    blocks: [
      {
        key: 'abcd',
        text: 'Sample Text',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  };

const DynamicEditor = dynamic(
    () => import('react-draft-wysiwyg').then(mod => mod.Editor),
    { ssr: false }
);

function RichEditorComponent() {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());


    useEffect(() => {
        // Fetch data from server and set editor content
        const contentState = convertFromHTML(sampleData);
        if (contentState) {
            setEditorState(EditorState.createWithContent(convertFromRaw(sampleData)));
        }
    }, []);

    useEffect(() => {
        setEditorState(EditorState.createEmpty());
    }, []);

    const handleEditorChange = (state) => {
        setEditorState(state);
    };

    const handleContentChange = () => {
        const contentState = editorState.getCurrentContent();
        console.log(contentState);
        const contentHTML = stateToHTML(contentState);
        console.log(contentHTML);
    };

    return (
        <div>
            {typeof window !== 'undefined' && (
                <div style={{minHeight:280}}>
                    <DynamicEditor
                        editorState={editorState}
                        onEditorStateChange={handleEditorChange}
                        onContentStateChange={handleContentChange}
                    />
                </div>
            )}
        </div>
    );
}

export default RichEditorComponent;