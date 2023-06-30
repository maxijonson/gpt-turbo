import { RichTextEditor } from "@mantine/tiptap";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { lowlight } from "lowlight";
import jsLanguageSyntax from "highlight.js/lib/languages/javascript";
import React from "react";
import { Divider, createStyles } from "@mantine/core";
import { Transaction } from "@tiptap/pm/state";

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
                minHeight: 200,
            },
        },
    },
}));

interface CodeEditorProps {
    value?: string;
    onChange: (value?: string) => void;
    name?: string;
    parameters?: string[];
}

const CodeEditor = ({ value, onChange, name, parameters }: CodeEditorProps) => {
    const editor = useEditor({
        extensions: [StarterKit, lowlightExtension],
        content: value,
    });
    const { classes } = useStyles();

    const functionSignature = React.useMemo(() => {
        let signature = name ? `function ${name}(` : "function(";
        if (parameters) {
            signature += parameters.join(", ");
        }
        signature += ") {";
        return signature;
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
    const handleUpdate = React.useCallback(
        ({
            editor,
            transaction,
        }: {
            editor: Editor;
            transaction: Transaction;
        }) => {
            if (!editor?.isFocused) return;
            if (transaction.docChanged) {
                const text = editor.getText();
                onChange(text.length > 0 ? text : undefined);
            }
        },
        [onChange]
    );

    React.useEffect(() => {
        if (!editor) return;
        editor.on("update", handleUpdate as any);

        return () => {
            editor.off("update", handleUpdate as any);
        };
    }, [editor, handleUpdate]);

    const contentType = editor?.getJSON().content?.[0].type ?? "unknown";
    React.useEffect(() => {
        if (!editor) return;
        if (contentType !== lowlightExtension.name) {
            editor.commands.setCodeBlock();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor, contentType, editor?.getText()]);

    // Restores the editor's content to the value prop when the editor is not focused. Usually on first render because the editor's content is empty on first render, no matter the value.
    React.useEffect(() => {
        if (!editor) return;
        if (editor.isFocused) return;
        editor.commands.setContent(value ?? "", false, {
            preserveWhitespace: "full",
        });
        editor.commands.setCodeBlock();
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
