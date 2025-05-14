"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar";
import TextAlgin from "@tiptap/extension-text-align";

interface RichTextEditorTestProps {
  value: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

export default function RichTextEditorTest({
  value,
  onChange,
  editable = true,
}: RichTextEditorTestProps) {
  const isEditable = editable ?? true;

  const editor = useEditor({
    editable: isEditable,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlgin.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: isEditable
          ? "min-h-[156px] border rounded-md dark:bg-black py-2 px-3"
          : "",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  return (
    <>
      {isEditable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </>
  );
}
