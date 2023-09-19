import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, convertToRaw, ContentState, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Button, Alert } from '@mui/material/'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import axios from 'axios';
import { apiUrls } from 'src/configs/apiurls';
import { ContentToHTMLConverter } from './ContentToHTMLConverter';

const DynamicEditor = dynamic(
    () => import('react-draft-wysiwyg').then(mod => mod.Editor),
    { ssr: false }
);

function RichEditorComponent(props) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [email, setEmail] = useState();
    const [content, setContent] = useState();

    useEffect(() => {
        if (props.email != undefined) {
            setEmail(props.email);
        }
    }, [props])
    useEffect(() => {
        const contentFromStorage = localStorage.getItem('editorContent');

        if (contentFromStorage) {
            const parsedContent = JSON.parse(contentFromStorage);
            const contentState = convertFromRaw(parsedContent);
            const convertedHTML = convertToHTML(contentState);
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, []);

    const handleEditorChange = (state) => {
        setEditorState(state);
    };

    const handleContentChange = () => {
        setContent();
        const contentState = editorState.getCurrentContent();

        const contentInRawFormat = convertToRaw(contentState);
        setContent(contentInRawFormat);
        localStorage.setItem('editorContent', JSON.stringify(contentInRawFormat))
    };

    const btnSendEmail = (e) => {
        const contentFromStorage = localStorage.getItem('editorContent');
        if (contentFromStorage != undefined) {
            const parsedContent = JSON.parse(contentFromStorage);
            setContent(parsedContent)
            if (parsedContent != undefined) {
                const contentState = convertFromRaw(parsedContent);
                var obj = {
                    email: email,
                    content: document.getElementById('convertedHtml').innerHTML
                }
                axios.post(apiUrls.agentUrl.SendEmailToTestAccountsUrl,{body:obj});
                props.RefreshPageHandler();
            }

        }

    }

    return (
        <div>
            {typeof window !== 'undefined' && <>
                <Grid item xs={12} style={{ marginTop: 40 }}>
                    <Card>
                        <Grid container spacing={6}>
                            <Grid item xs={12} sm={6}>
                                <Button size='small' onClick={btnSendEmail} type='submit' sx={{ mr: 2 }} variant='contained'>
                                    ارسال ایمیل
                                </Button>

                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <div style={{ minHeight: 280, marginTop: 60 }}>
                    <DynamicEditor
                        editorState={editorState}
                        onEditorStateChange={handleEditorChange}
                        onContentStateChange={handleContentChange}
                    />
                </div>
                <Alert severity="info">{`محتوایی که کاربر ${email} در ایمیل خود مشاهده خواهد کرد`}</Alert>
                <div id="convertedHtml">
                    {
                        content != undefined ?
                            <ContentToHTMLConverter content={content} />
                            :<></>
                    }
                </div>
            </>
            }
        </div>
    );
}

export default RichEditorComponent;