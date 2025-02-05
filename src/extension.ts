import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(  
    vscode.languages.registerDocumentFormattingEditProvider('x3', {
      provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        const edits: vscode.TextEdit[] = [];
        let indentLevel = 0;
        const indent = "  "; // Two spaces for indentation

        for (let i = 0; i < document.lineCount; i++) {
          const line = document.lineAt(i);
          const trimmedLine = line.text.trim();

          if (trimmedLine.startsWith("Endif")) {
            indentLevel--;
          }

          const newText = indent.repeat(indentLevel) + trimmedLine;
          if (newText !== line.text) {
            edits.push(vscode.TextEdit.replace(line.range, newText));
          }

          if (trimmedLine.startsWith("If")) {
            indentLevel++;
          }
        }

        return edits;
      },
    })
  );
}
