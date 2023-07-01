import { RichTextEditor } from "@mantine/tiptap";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { lowlight } from "lowlight";
import jsLanguageSyntax from "highlight.js/lib/languages/javascript";
import React from "react";
import { Divider, createStyles } from "@mantine/core";
import { JsonSchemaObject } from "gpt-turbo";
import getFunctionSignature from "../utils/getFunctionSignature";

lowlight.registerLanguage("js", jsLanguageSyntax);

const lowlightExtension = CodeBlockLowlight.configure({
    exitOnArrowDown: false,
    defaultLanguage: "js",
    exitOnTripleEnter: false,
    lowlight,
});
// HACK: Fixes warning "duplicate extension name 'codeBlock'"
lowlightExtension.name = "gpt-turbo-code-block-lowlight";

const useStyles = createStyles(() => ({
    editor: {
        "& .ProseMirror": {
            padding: "0 !important",

            "& pre": {
                margin: 0,
                borderRadius: 0,
            },
        },
    },
}));

interface CodeEditorProps {
    value?: string;
    onChange?: (value?: string) => void;
    name?: string;
    parameters?: JsonSchemaObject;
}

const CodeEditor = ({
    value = "",
    onChange,
    name,
    parameters,
}: CodeEditorProps) => {
    const hasInit = React.useRef(false);
    const editor = useEditor(
        {
            extensions: [StarterKit, lowlightExtension],
            editable: !!onChange,
            onUpdate: ({ editor, transaction }) => {
                if (!editor?.isFocused || !onChange) return;
                if (transaction.docChanged) {
                    const text = editor.getText();
                    onChange(text.length > 0 ? text : undefined);
                }
                if (
                    editor.getJSON().content?.[0].type !==
                    lowlightExtension.name
                ) {
                    editor.commands.setCodeBlock();
                }
            },
            onCreate: ({ editor }) => {
                if (!value) {
                    editor.commands.setCodeBlock();
                    return;
                }
                editor.commands.setContent({
                    type: lowlightExtension.name,
                    content: [
                        {
                            type: "text",
                            text: value,
                        },
                    ],
                });
            },
        },
        [hasInit.current]
    );
    const { classes } = useStyles();

    const functionSignature = React.useMemo(() => {
        const signature = getFunctionSignature(name, parameters);
        if (!name) return `function${signature} {`;
        return `function ${signature} {`;
    }, [name, parameters]);

    const handleKeydown = React.useCallback<
        React.KeyboardEventHandler<HTMLDivElement>
    >(
        (e) => {
            if (!editor) return;
            if (e.key === "Tab") {
                e.preventDefault();
                editor.chain().focus().insertContent("    ").run();
            }
        },
        [editor]
    );

    React.useEffect(() => {
        if (!editor) return;
        if (hasInit.current) return;
        hasInit.current = true;
    }, [editor, value]);

    return (
        <RichTextEditor editor={editor} className={classes.editor}>
            <RichTextEditor.Toolbar>{functionSignature}</RichTextEditor.Toolbar>
            <RichTextEditor.Content onKeyDown={handleKeydown} />
            <Divider />
            <RichTextEditor.Toolbar>{"}"}</RichTextEditor.Toolbar>
        </RichTextEditor>
    );
};

export default CodeEditor;
