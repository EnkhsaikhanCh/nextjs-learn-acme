"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Strikethrough,
  Undo,
  Redo,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text, Bold, Italic, Strike, History],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert min-h-[150px] p-3 border rounded-md bg-white dark:bg-gray-950 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", false);
    }
  }, [value, editor]);

  const [formats, setFormats] = useState<string[]>([]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const updateFormatting = () => {
      const activeFormats: string[] = [];
      if (editor.isActive("bold")) {
        activeFormats.push("bold");
      }
      if (editor.isActive("italic")) {
        activeFormats.push("italic");
      }
      if (editor.isActive("strike")) {
        activeFormats.push("strike");
      }
      setFormats(activeFormats);
    };

    editor.on("update", updateFormatting);
    editor.on("selectionUpdate", updateFormatting);

    updateFormatting();

    return () => {
      editor.off("update", updateFormatting);
      editor.off("selectionUpdate", updateFormatting);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  // Undo/Redo handlers.
  const handleUndo = () => editor.chain().focus().undo().run();
  const handleRedo = () => editor.chain().focus().redo().run();

  const handleFormatChange = (newFormats: string[]) => {
    if (!editor) {
      return;
    }

    // Bold
    if (newFormats.includes("bold") && !formats.includes("bold")) {
      editor.chain().focus().setBold().run();
    } else if (!newFormats.includes("bold") && formats.includes("bold")) {
      editor.chain().focus().unsetBold().run();
    }

    // Italic
    if (newFormats.includes("italic") && !formats.includes("italic")) {
      editor.chain().focus().setItalic().run();
    } else if (!newFormats.includes("italic") && formats.includes("italic")) {
      editor.chain().focus().unsetItalic().run();
    }

    // Strike
    if (newFormats.includes("strike") && !formats.includes("strike")) {
      editor.chain().focus().setStrike().run();
    } else if (!newFormats.includes("strike") && formats.includes("strike")) {
      editor.chain().focus().unsetStrike().run();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ToggleGroup
          type="multiple"
          value={formats}
          onValueChange={handleFormatChange}
          className="rounded-md border p-1"
        >
          <ToggleGroupItem value="bold">
            <BoldIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic">
            <ItalicIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="strike">
            <Strikethrough className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Undo/Redo actions */}
        <div className="ml-auto flex gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleUndo}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleRedo}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Rich text editor content */}
      <EditorContent editor={editor} />
    </div>
  );
};
