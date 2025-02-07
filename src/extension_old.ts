import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

/**
 * Interface representing the formatter configuration.
 */
interface FormatterConfig {
  startStatement: string;
  middleStatements: string[];
  endStatement: string;
}

/**
 * Reads and parses the formatter configuration from a JSON file.
 * @returns {FormatterConfig} The parsed formatter configuration.
 */
function getConfig(): FormatterConfig {
  const configPath = path.join(__dirname, "..", "formatter-config.json");
  const configContent = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(configContent) as FormatterConfig;
}

/**
 * Activates the extension.
 * @param {vscode.ExtensionContext} context - The context in which the extension is activated.
 */
export function activate(context: vscode.ExtensionContext) {
  const config = getConfig();

  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("x3", {
      /**
       * Provides formatting edits for a document.
       * @param {vscode.TextDocument} document - The document to format.
       * @returns {vscode.TextEdit[]} An array of text edits to apply to the document.
       */
      provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        const edits: vscode.TextEdit[] = [];
        let indentLevel = 0;
        const indent = "  "; // Two spaces for indentation

        for (let i = 0; i < document.lineCount; i++) {
          const line = document.lineAt(i);
          const trimmedLine = line.text.trim();

          // IF THE LINE STARTS WITH END STATEMENT INDENT BACK
          if (trimmedLine.startsWith(config.endStatement)) {
            indentLevel--;
          }
          // IF THE LINE STARTS WITH A MIDDLE STATEMENT INDENT BACK
          if (config.middleStatements.some((stmt) => trimmedLine.startsWith(stmt))) {
            indentLevel--;
            const newText = indent.repeat(indentLevel) + trimmedLine;

            // IF THE NEW TEXT IS DIFFERENT FROM THE ORIGINAL LINE, ADD AN EDIT
            if (newText !== line.text) {
              edits.push(vscode.TextEdit.replace(line.range, newText));
            }
            indentLevel++;
          } else {
            const newText = indent.repeat(indentLevel) + trimmedLine;

            // IF THE NEW TEXT IS DIFFERENT FROM THE ORIGINAL LINE, ADD AN EDIT
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
