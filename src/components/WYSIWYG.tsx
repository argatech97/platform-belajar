/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { createEditor, Descendant, Editor, Element as SlateElement, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { ReactEditor } from "slate-react";

// === Tipe Kustom ===
interface CustomElement extends SlateElement {
  type: "paragraph" | "image";
  url?: string;
  children: Descendant[];
}

// === Nilai Awal ===
const initialValue: CustomElement[] = [
  {
    type: "paragraph",
    children: [{ text: "Mulai mengetik di sini..." }],
  },
];

// === Plugin Kustom: `/image` ===
// === Plugin Kustom: `/image` dengan TypeScript yang benar ===
// === Plugin Kustom: `/image` (Versi TypeScript yang Benar, Aman, dan Kompatibel) ===
const withImages = (editor: Editor) => {
  const { insertText, isInline } = editor;

  // Fungsi helper: memastikan element adalah CustomElement
  const isCustomElement = (element: any): element is CustomElement => {
    // Pastikan ini adalah elemen Slate dan punya type
    return (
      SlateElement.isElement(element) &&
      "type" in element && // ✅ Cek keberadaan properti 'type'
      typeof element.type === "string"
    );
  };

  // Ubah isInline agar elemen 'image' dianggap inline
  editor.isInline = (element) => {
    if (isCustomElement(element)) {
      return element.type === "image";
    }
    return isInline(element);
  };

  // Override insertText untuk menangani '/image url'
  editor.insertText = (text) => {
    if (text.startsWith("/image ")) {
      const url = text.slice(6).trim();
      if (url) {
        const image: CustomElement = {
          type: "image",
          url,
          children: [{ text: "" }],
        };
        editor.insertNodes(image);
        return;
      }
    }
    insertText(text);
  };

  return editor;
};

// === Komponen Gambar ===
const ImageComponent = ({
  attributes,
  children,
  element,
}: {
  attributes: any;
  children: React.ReactNode;
  element: CustomElement;
}) => {
  const { url } = element;
  return (
    <div {...attributes}>
      <img
        src={url}
        alt="Gambar"
        style={{
          maxWidth: "100%",
          height: "auto",
          display: "block",
          margin: "10px 0",
          borderRadius: "6px",
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://via.placeholder.com/200x200?text=Gagal+Muat";
        }}
      />
      {children}
    </div>
  );
};

// === Komponen Utama ===
const DocumentEditor = () => {
  const [value, setValue] = useState<CustomElement[]>(() => {
    const saved = localStorage.getItem("document-content");
    return saved ? JSON.parse(saved) : initialValue;
  });

  // Simpan ke localStorage setiap perubahan
  useEffect(() => {
    localStorage.setItem("document-content", JSON.stringify(value));
  }, [value]);

  // Inisialisasi editor + plugin
  const editor = withImages(withReact(createEditor()));

  // Render elemen
  const renderElement = (props: any) => {
    switch (props.element.type) {
      case "image":
        return <ImageComponent {...props} />;
      default:
        return <span {...props.attributes}>{props.children}</span>;
    }
  };

  // Render teks
  const renderLeaf = (props: any) => {
    return <span {...props.attributes}>{props.children}</span>;
  };

  return (
    <Slate
      editor={editor as ReactEditor} // ✅ Cast ke ReactEditor
      initialValue={value as Descendant[]} // ✅ Cast ke Descendant[]
      onChange={(newValue: Descendant[]) => {
        setValue(newValue as CustomElement[]); // ✅ Pastikan kompatibel
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          margin: "10px 0",
          borderRadius: "6px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Mulai mengetik di sini..."
          style={{
            outline: "none",
            minHeight: "200px",
            padding: "10px",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        />
      </div>
    </Slate>
  );
};

export default DocumentEditor;
