import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.languages.registerDocumentFormattingEditProvider("x3", {
    provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
      const firstLine = document.lineAt(0);
      if (firstLine.text !== "Hello World") {
        return [vscode.TextEdit.insert(firstLine.range.start, "Hello World\n")];
      }
      return [];
    },
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
