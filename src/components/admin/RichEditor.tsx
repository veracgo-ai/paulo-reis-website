import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export function RichEditor({ value, onChange, placeholder = "Escreva o conteúdo..." }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, HTMLAttributes: { class: "text-[#C5A065] underline" } },
      }),
      Image.configure({ HTMLAttributes: { class: "rounded-md my-4 max-w-full h-auto" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none prose-headings:font-display prose-headings:text-[#0A192F] prose-a:text-[#C5A065]",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from("site-images").upload(path, file);
        if (error) throw error;
        const { data } = supabase.storage.from("site-images").getPublicUrl(path);
        editor.chain().focus().setImage({ src: data.publicUrl }).run();
      } catch (e: any) {
        toast.error(e.message || "Erro ao carregar imagem");
      }
    };
    input.click();
  };

  const addLink = () => {
    const previous = editor.getAttributes("link").href;
    const url = window.prompt("URL", previous || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const Btn = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded p-1.5 transition-colors ${
        active ? "bg-[#C5A065] text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-md border border-slate-300 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Negrito">
          <Bold className="h-4 w-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Itálico">
          <Italic className="h-4 w-4" />
        </Btn>
        <div className="mx-1 h-5 w-px bg-slate-300" />
        <Btn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Título H2"
        >
          <Heading2 className="h-4 w-4" />
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Título H3"
        >
          <Heading3 className="h-4 w-4" />
        </Btn>
        <div className="mx-1 h-5 w-px bg-slate-300" />
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Lista">
          <List className="h-4 w-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Lista numerada">
          <ListOrdered className="h-4 w-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Citação">
          <Quote className="h-4 w-4" />
        </Btn>
        <div className="mx-1 h-5 w-px bg-slate-300" />
        <Btn onClick={addLink} active={editor.isActive("link")} title="Link">
          <LinkIcon className="h-4 w-4" />
        </Btn>
        <Btn onClick={addImage} title="Inserir imagem">
          <ImageIcon className="h-4 w-4" />
        </Btn>
        <div className="mx-1 h-5 w-px bg-slate-300" />
        <Btn onClick={() => editor.chain().focus().undo().run()} title="Desfazer">
          <Undo className="h-4 w-4" />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} title="Refazer">
          <Redo className="h-4 w-4" />
        </Btn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
