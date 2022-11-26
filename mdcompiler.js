import showdown from "showdown";
import Prism from 'prismjs';
import './prism-archetype';
import showdownKatex from 'showdown-katex';

Prism.manual = true;

function makeTitle(type, title) {
    var TYPE_INFO = {
        'note': { 'icon': 'info-circle', 'title': 'Note' },
        'tip': { 'icon': 'lightbulb', 'title': 'Tip' },
        'info': { 'icon': 'exclamation-circle', 'title': 'Info' },
        'caution': { 'icon': 'exclamation-triangle', 'title': 'Caution' },
        'danger': { 'icon': 'fire', 'title': 'Danger' },
        'warning': { 'icon': 'fire', 'title': 'Danger' },
    }
    var info = TYPE_INFO[type];
    var result = '<div class="admonition-title">';
    if (info) {
        title = title || info.title;
        result += '<i class="fas fa-' + info.icon + '"></i> ' + title;
    } else {
        result += '<i class="fas fa-question"></i> ' + title;
    }
    result += '</div>';
    return result;
}

function filterInfoBlocks() {
    return [{
        type: 'lang',
        filter: function (text, converter) {
            var lines = text.split("\n");
            var inside = false;
            var resultLines = [];
            var insideLines = [];
            var type = null;
            var title = '';
            lines.forEach(function (line) {
                if (line.startsWith(':::')) {
                    if (inside) {
                        resultLines.push('<div class="admonition admonition-' + type + '">' + makeTitle(type, title) + converter.makeHtml(insideLines.join("\n")) + '</div>');
                        insideLines = [];
                    } else {
                        var info = line.substr(3);
                        var spaceIdx = info.indexOf(' ');
                        if (spaceIdx > -1) {
                            type = info.substr(0, spaceIdx);
                            title = info.substr(spaceIdx + 1).trim();
                        } else {
                            type = info.trim();
                            title = null;
                        }
                    }
                    inside = !inside;
                } else {
                    if (inside) {
                        insideLines.push(line);
                    } else {
                        resultLines.push(line);
                    }
                }
            });
            return resultLines.join("\n");
        }
    }]
}

function filterImports() {
    return [{
        type: 'lang',
        filter: function (text) {
            var lines = text.split("\n");
            var resultLines = [];
            lines.forEach(function (line) {
                if (!line.startsWith('import ')) {
                    resultLines.push(line);
                }
            });
            return resultLines.join("\n");
        }
    }]
}

function filterUnderscoreKatex() {
    return [{
        type: 'output',
        filter: function (html) {
            // Undo underscore <em> by showdown, which breaks KaTeX
            var matches = html.match(/\$\$?([^]*?)\$\$?/gm);
            if (matches) {
                matches.forEach(function (match) {
                    var result = match.replace(/<\/?em>/g, '_');
                    html = html.replace(match, result);
                });
            }
            var matches = html.match(/\\text\{[^}]*_[^}]*\}/g);
            if (matches) {
                matches.forEach(function (match) {
                    var result = match.replace(/_/g, '\\_');
                    html = html.replace(match, result);
                });
            }
            return html;
        }
    }]
}

var showdownKatexWithConfig = showdownKatex({
    displayMode: true,
    throwOnError: true, //allows katex to fail silently
    errorColor: '#ff0000',
    delimiters: [
        { left: "$", right: "$", display: false },
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false },
        { left: '~', right: '~', display: false, asciimath: true },
        { left: '&&', right: '&&', display: true, asciimath: true },
    ],
});

function highlightWithPrism() {
    return [{
        type: 'output',
        filter: function (html) {
            // PrismJS highlight
            var matches = html.match(/<pre><code class=".*">([^]*?)<\/code><\/pre>/gm);
            if (matches) {
                matches.forEach(function (match) {
                    var lang = match.match(/language-([\w-]+)/);
                    var code = match.replace(/<pre><code class=".*">/, '').replace(/<\/code><\/pre>/, '').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
                    if (lang) {
                        lang = lang[1];
                        code = code.replace(/language-([\w-]+)/, '');
                        if (Prism.languages[lang]) {
                            code = Prism.highlight(code, Prism.languages[lang], lang);
                        }
                        html = html.replace(match, "<pre class=\"language-" + lang + "\"><code class=\"language-" + lang + "\">" + code + "</code></pre>");
                    }
                });
            }
            html = html.replace(/<code>/g, '<code class="language-none">');
            html = html.replace(/<pre>/g, '<pre class="language-none">');
            return html;
        }
    }]
}

function filterHeaderLinks() {
    return [{
        type: 'output',
        filter: function (html) {
            for (var i = 1; i <= 6; i++) {
                html = html.replace(new RegExp('<h' + i + ' id="([^"]*?)">([^]*?)<\/h' + i + '>', 'gm'), '<h' + i + ' id="$1">$2 <a class="hash-link" href="#$1"></a></h' + i + '>');
            }
            return html;
        }
    }]
}

function filterFixes() {
    return [{
        type: 'output',
        filter: function (html) {
            html = html.replace(/<a href="http/g, '<a target="_blank" href="http');
            html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1"></a>');
            return html;
        }
    }]
}

export function compileMarkdown(data) {
    var converter = new showdown.Converter({
        ghCompatibleHeaderId: true,
        tables: true,
        strikethrough: true,
        simplifiedAutoLink: true,
        extensions: [
            filterImports,
            filterInfoBlocks,
            filterUnderscoreKatex,
            showdownKatexWithConfig,
            highlightWithPrism,
            filterHeaderLinks,
            filterFixes
        ]
    });

    var html = converter.makeHtml(data);

    return html;
}

export function parseHeader(data) {
    // parse header between "---" lines
    var lines = data.split(/\r?\n/);
    var headers = {};
    var i;
    for (i = 0; i < lines.length; i++) {
        var line = lines[i];
        if ((i == 0 && line != '---') || (i > 0 && line == '---')) {
            break;
        }
        var split = line.split(":");
        if (split.length == 2) {
            headers[split[0].trim()] = split[1].trim();
        } else if (i > 0) {
            console.log('invalid header line: ' + line);
        }
    }
    return {
        headers: headers,
        body: lines.slice(i > 0 ? i + 1 : 0).join("\n")
    }
}