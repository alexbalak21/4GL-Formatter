import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.getLanguageId', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const languageId = editor.document.languageId;
      vscode.window.showInformationMessage(`Language ID: ${languageId}`);
    } else {
      vscode.window.showInformationMessage('No active editor');
    }
  });

  context.subscriptions.push(disposable);
}