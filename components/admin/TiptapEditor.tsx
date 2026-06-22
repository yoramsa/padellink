"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { uploadImage } from "@/lib/upload";

function ToolButton({
  active,
  onClick,
  children
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-2.5 py-1 text-sm font-semibold ${active ? "bg-azur text-creme" : "bg-creme text-marine"}`}
    >
      {children}
    </button>
  );
}

export default function TiptapEditor({
  value,
  onChange
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false }),
      Image
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose-content min-h-[280px] focus:outline-none"
      }
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML())
  });

  if (!editor) {
    return (
      <div className="rounded-xl border border-or/30 bg-white p-4 text-sm text-marine/50">
        Chargement de l'éditeur...
      </div>
    );
  }

  const addLink = () => {
    const url = window.prompt("URL du lien");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const url = await uploadImage("articles", file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        window.alert("Échec de l'envoi de l'image.");
      }
    };
    input.click();
  };

  return (
    <div className="rounded-xl border border-or/30 bg-white">
      <div className="flex flex-wrap gap-1.5 border-b border-or/20 p-2">
        <ToolButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          G
        </ToolButton>
        <ToolButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </ToolButton>
        <ToolButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </ToolButton>
        <ToolButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </ToolButton>
        <ToolButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • Liste
        </ToolButton>
        <ToolButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. Liste
        </ToolButton>
        <ToolButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Citation
        </ToolButton>
        <ToolButton active={editor.isActive("link")} onClick={addLink}>
          Lien
        </ToolButton>
        <ToolButton onClick={addImage}>Image</ToolButton>
      </div>
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
