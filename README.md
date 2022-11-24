# markdown-compiler

Markdown to HTML compiler

## Usage

* `var markdown = mdcompiler.parseHeader(markdownData);` to get information pairs from the header
* `mdcompiler.compileMarkdown(markdown.body);` to get HTML from the body of the markdown file, headers excluded
