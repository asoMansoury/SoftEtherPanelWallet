import { convertToHTML } from "draft-convert";
import { convertFromRaw } from "draft-js";
import { useEffect } from "react";
import { useState } from "react";

export const ContentToHTMLConverter = (props) => {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        setHtmlContent();
        if (props.content != undefined) {
            const contentState = convertFromRaw(props.content);
            const convertedHTML = convertToHTML(contentState);
            setHtmlContent(convertedHTML);
        }

    }, []);

    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    );
};