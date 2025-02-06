import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

interface FormatterConfig {
  startStatement: string;
  middleStatements: string[];
  endStatement: string;
}

function getConfig(): FormatterConfig {
  const configPath = path.join(__dirname, "..", "formatter-config.json");
  const configContent = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(configContent) as FormatterConfig;
}

export function activate(context: vscode.ExtensionContext) {
  const config = getConfig();

  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("x3", {
      provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        const edits: vscode.TextEdit[] = [];
        let indentLevel = 0;
        const indent = "  "; // Two spaces for indentation

        for (let i = 0; i < document.lineCount; i++) {
          const line = document.lineAt(i);
          const trimmedLine = line.text.trim();

          if (trimmedLine.startsWith(config.endStatement)) {
            indentLevel--;
          }

          if (config.middleStatements.some((stmt) => trimmedLine.startsWith(stmt))) {
            indentLevel--;
            const newText = indent.repeat(indentLevel) + trimmedLine;
            if (newText !== line.text) {
              edits.push(vscode.TextEdit.replace(line.range, newText));
            }
            indentLevel++;
          } else {
            const newText = indent.repeat(indentLevel) + trimmedLine;
            if (newText !== line.text) {
              edits.push(vscode.TextEdit.replace(line.range, newText));
            }
          }

          if (trimmedLine.startsWith(config.startStatement)) {
            indentLevel++;
          }
        }

        return edits;
      },
    })
  );
}
