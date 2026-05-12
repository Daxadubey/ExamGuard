"use client";

import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  setCode: (val: string) => void;
  language: string;
};

export default function MonacoEditor({ code, setCode, language }: Props) {
  return (
    <div className="h-full border rounded">
      <Editor
        height="100%"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={(value) => setCode(value || "")}
      />
    </div>
  );
}