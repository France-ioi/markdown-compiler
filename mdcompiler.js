import showdown from "showdown";
import Prism from 'prismjs';
import './prism-archetype';
import showdownKatex from 'showdown-katex';
import katex from 'katex';


Prism.manual = true;

function makeAdmonitionTitle(type, title) {
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

function makeCalloutTitle(type, title) {
    if (!type) {
        type = 'note';
    }
    if (!title) {
        title = type.charAt(0).toUpperCase() + type.slice(1);
    }
    var TYPE_ICON = {
        'note': '<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" class="callout-icon callout-icon-note"><defs><radialGradient cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" id=":r0:-gradient" gradientTransform="matrix(0 21 -21 0 20 11)"><stop stop-color="#408DFF"></stop><stop stop-color="#7CB3FF" offset=".527"></stop><stop stop-color="#BEDFFF" offset="1"></stop></radialGradient><radialGradient cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" id=":r0:-gradient-dark" gradientTransform="matrix(0 24.5001 -19.2498 0 16 5.5)"><stop stop-color="#408DFF"></stop><stop stop-color="#7CB3FF" offset=".527"></stop><stop stop-color="#BEDFFF" offset="1"></stop></radialGradient></defs><g class="dark:hidden"><circle cx="20" cy="20" r="12" fill="url(#:r0:-gradient)"></circle><path fill-rule="evenodd" clip-rule="evenodd" d="M20 24.995c0-1.855 1.094-3.501 2.427-4.792C24.61 18.087 26 15.07 26 12.231 26 7.133 21.523 3 16 3S6 7.133 6 12.23c0 2.84 1.389 5.857 3.573 7.973C10.906 21.494 12 23.14 12 24.995V27a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.005Z" fill="white" fill-opacity="0.5"></path><path d="M25 12.23c0 2.536-1.254 5.303-3.269 7.255l1.391 1.436c2.354-2.28 3.878-5.547 3.878-8.69h-2ZM16 4c5.047 0 9 3.759 9 8.23h2C27 6.508 21.998 2 16 2v2Zm-9 8.23C7 7.76 10.953 4 16 4V2C10.002 2 5 6.507 5 12.23h2Zm3.269 7.255C8.254 17.533 7 14.766 7 12.23H5c0 3.143 1.523 6.41 3.877 8.69l1.392-1.436ZM13 27v-2.005h-2V27h2Zm1 1a1 1 0 0 1-1-1h-2a3 3 0 0 0 3 3v-2Zm4 0h-4v2h4v-2Zm1-1a1 1 0 0 1-1 1v2a3 3 0 0 0 3-3h-2Zm0-2.005V27h2v-2.005h-2ZM8.877 20.921C10.132 22.136 11 23.538 11 24.995h2c0-2.253-1.32-4.143-2.731-5.51L8.877 20.92Zm12.854-1.436C20.32 20.852 19 22.742 19 24.995h2c0-1.457.869-2.859 2.122-4.074l-1.391-1.436Z" fill="#0f172a"></path><path d="M20 26a1 1 0 1 0 0-2v2Zm-8-2a1 1 0 1 0 0 2v-2Zm2 0h-2v2h2v-2Zm1 1V13.5h-2V25h2Zm-5-11.5v1h2v-1h-2Zm3.5 4.5h5v-2h-5v2Zm8.5-3.5v-1h-2v1h2ZM20 24h-2v2h2v-2Zm-2 0h-4v2h4v-2Zm-1-10.5V25h2V13.5h-2Zm2.5-2.5a2.5 2.5 0 0 0-2.5 2.5h2a.5.5 0 0 1 .5-.5v-2Zm2.5 2.5a2.5 2.5 0 0 0-2.5-2.5v2a.5.5 0 0 1 .5.5h2ZM18.5 18a3.5 3.5 0 0 0 3.5-3.5h-2a1.5 1.5 0 0 1-1.5 1.5v2ZM10 14.5a3.5 3.5 0 0 0 3.5 3.5v-2a1.5 1.5 0 0 1-1.5-1.5h-2Zm2.5-3.5a2.5 2.5 0 0 0-2.5 2.5h2a.5.5 0 0 1 .5-.5v-2Zm2.5 2.5a2.5 2.5 0 0 0-2.5-2.5v2a.5.5 0 0 1 .5.5h2Z" style="fill: #0f172a;"></path></g></svg>',
        'warning': '<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" class="callout-icon callout-icon-warning"><defs><radialGradient cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" id=":r2:-gradient" gradientTransform="rotate(65.924 1.519 20.92) scale(25.7391)"><stop stop-color="#FDE68A" offset=".08"></stop><stop stop-color="#F59E0B" offset=".837"></stop></radialGradient><radialGradient cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" id=":r2:-gradient-dark" gradientTransform="matrix(0 24.5 -24.5 0 16 5.5)"><stop stop-color="#FDE68A" offset=".08"></stop><stop stop-color="#F59E0B" offset=".837"></stop></radialGradient></defs><g class="dark:hidden"><circle cx="20" cy="20" r="12" fill="url(#:r2:-gradient)"></circle><path d="M3 16c0 7.18 5.82 13 13 13s13-5.82 13-13S23.18 3 16 3 3 8.82 3 16Z" fill-opacity="0.5" fill="#fef3c7" stroke="#78350f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="m15.408 16.509-1.04-5.543a1.66 1.66 0 1 1 3.263 0l-1.039 5.543a.602.602 0 0 1-1.184 0Z" fill="#78350f" stroke="#78350f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16 23a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill-opacity="0.5" stroke="currentColor" fill="#fef3c7" stroke="#78350f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>'
    }
    var result = TYPE_ICON[type];
    result += '<div class="callout-title">' + title + '</div>';
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
                        resultLines.push('<div class="admonition admonition-' + type + '">' + makeAdmonitionTitle(type, title) + converter.makeHtml(insideLines.join("\n")) + '</div>');
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
        type: 'output',
        filter: function (text) {
            var lines = text.split("\n");
            var resultLines = [];
            lines.forEach(function (line) {
                if (!line.startsWith('<p>import ')) {
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
    displayMode: false,
    throwOnError: true,
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

function filterNotificationBars() {
    return [{
        type: 'lang',
        filter: function (text, converter) {
            var matches = [...text.matchAll(/<NotificationBar>[^]*?<p>([^]+?)<\/p>[^]*?<\/NotificationBar>/gm)];
            matches.forEach(function (match) {
                var content = converter.makeHtml(match[1]);
                text = text.replace(match[0], '<div class="notification-bar">' + content + '</div>');
            });
            return text;
        }
    }]
}

function filterWrapTables() {
    return [{
        type: 'output',
        filter: function (html) {
            return html.replace(/<table>/g, '<div class="table-wrapper"><table>').replace(/<\/table>/g, '</table></div>');
        }
    }];
}

function handleCallout(attrs, inner, converter) {
    var type = attrs['type'];
    var title = attrs['title'];
    return '<div class="callout callout-' + type + '">' + makeCalloutTitle(type, title) + converter.makeHtml(inner) + '</div>';
}


function handleFigure(attrs) {
    // inner is ignored
    var src = attrs['src'];
    var alt = attrs['alt'];
    var caption = attrs['caption'];
    var result = '<figure>';
    result += '<img src="' + src + '"';
    if (alt) {
        result += ' alt="' + alt + '"';
    }
    result += '>';
    if (caption) {
        result += '<figcaption>' + caption + '</figcaption>';
    }
    result += '</figure>';
    return result;
}

function handleComment() {
    // tag to add comments in a markdown file, which aren't rendered
    return '';
}

function handleMath(attrs, inner) {
    return katex.renderToString(inner, {
        throwOnError: false,
        displayMode: attrs['inline'] != 'true'
    });
}

function handleTable(attrs, inner, converter) {
    // Example of table
    // {% table %}
    // * **Charity Fund Contract** {% colspan=2 %}
    // ---
    // * **Storage**
    // * **Entrypoint Effects**
    // ---
    // * {% list type="checkmark" %}
    //   * `admin`: `address`
    //   {% /list %}
    // * {% list type="checkmark" %}
    //   * `deposit()`
    //       * Accepts transfers of tez
    //   * `donate(donation: tez, charity: address)`
    //       * Check that `source` == `admin`
    // 	  * Create transaction to transfer `donation` to `charity`
    // 
    //   {% /list %}
    // {% /table %}
    var lines = inner.split("\n");
    var result = '<table>';
    var curRow = '';
    var curCell = '';
    function finishCell() {
        if (curCell) {
            var attrs = {};
            var match = curCell.match(/\{% colspan=(\d+) %\}/);
            if (match) {
                attrs['colspan'] = match[1];
                curCell = curCell.replace(match[0], '');
            }
            // same with rowspan
            var match = curCell.match(/\{% rowspan=(\d+) %\}/);
            if (match) {
                attrs['rowspan'] = match[1];
                curCell = curCell.replace(match[0], '');
            }
            curCell = curCell.replace(/\{% list .*?%\}/g, '').replace(/\{% \/list %\}/g, '');
            curRow += '<td';
            for (var key in attrs) {
                curRow += ' ' + key + '="' + attrs[key] + '"';
            }
            curRow += '>' + converter.makeHtml(curCell) + '</td>';
            curCell = '';
        }
    }
    function finishRow() {
        finishCell();
        if(curRow) {
            result += '<tr>' + curRow + '</tr>';
            curRow = '';
        }
    }
    lines.forEach(function(line) {
        if(line.startsWith('---')) {
            finishRow();
        } else if(line.startsWith('*')) {
            finishCell();
            curCell += line.substr(1) + '\n';
        } else {
            curCell += line + '\n';
        }
    });
    finishRow();
    result += '</table>';
    return result;
}

function handleSpecialTag(tag, attrs, inner, converter) {
    var HANDLERS = {
        'callout': handleCallout,
        'comment': handleComment,
        'figure': handleFigure,
        'math': handleMath,
        'table': handleTable
    }
    var handler = HANDLERS[tag];
    if (handler) {
        return handler(attrs, inner, converter);
    } else {
        console.error('Unknown special tag ignored: ' + tag);
        return converter.makeHtml(inner);
    }
}

function filterSpecialTags() {
    // Find all special tags such as {% callout %}...{% /callout %} and parse their attributes
    return [{
        type: 'lang',
        filter: function (text, converter) {
            var matches = [...text.matchAll(/{% ([^ ]*?) ([^]*?)%}([^]*?){% \/\1 ?%}/gm)];
            matches.forEach(function (match) {
                var tag = match[1].trim();
                var inner = match[3].trim();
                var attrs = {};
                var attrMatches = [...match[2].matchAll(/(\S+)=(?:(?:"([^"]*)")|(\S+))/gm)];
                attrMatches.forEach(function (attrMatch) {
                    attrs[attrMatch[1]] = attrMatch[2] || attrMatch[3] || '';
                });
                var result = handleSpecialTag(tag, attrs, inner, converter);
                text = text.replace(match[0], result);
            });
            return text;
        }
    }]
}

function filterFixes() {
    return [{
        type: 'output',
        filter: function (html) {
            // Open external links in new tabs
            html = html.replace(/<a href="http/g, '<a target="_blank" href="http');

            // Fix image links
            var imgMatches = html.matchAll(/!\[(.*?)\]\((.*?)\)/gm);
            if (imgMatches) {
                imgMatches = [...imgMatches];
                imgMatches.forEach(function (match) {
                    var alt = match[1];
                    var src = match[2];
                    var title = '';

                    if (src.startsWith('./')) {
                        src = src.substring(2);
                    }

                    var spaceIndex = src.indexOf(' ');
                    if (spaceIndex > 0) {
                        title = src.substring(spaceIndex + 1);
                        src = src.substring(0, spaceIndex);
                        if (title.startsWith('"') && title.endsWith('"')) {
                            title = title.substring(1, title.length - 1);
                        }
                    }

                    var img = '<img src="' + src + '"';
                    if (alt) {
                        img += ' alt="' + alt + '"';
                    }
                    if (title) {
                        img += ' title="' + title + '"';
                    }
                    img += '>';
                    html = html.replace(match[0], img);
                });
            }

            // Fix dollar literals
            html = html.replace(/\\(\$)/g, '$1');

            // Fix highlight escaping
            html = html.replace(/&lt;span([^]*?)&gt;/g, '<span$1>');
            html = html.replaceAll('&lt;/span&gt;', '</span>');

            return html;
        }
    }]
}

function injectVariables(data, vars) {
    // Inject variables if specified
    if (!vars) { return data; }
    return data.replace(/<:?([A-Z_@]+):>/g, (_, innerGroup) => {
        const splitted = innerGroup.split('@');
        var variable = vars[splitted[0]] || '';
        switch (splitted[1]) {
            case "UPP":
                variable = variable.toUpperCase();
                break;
            case "LOW":
                variable = variable.toLowerCase();
                break;
            case "CAP":
                variable = variable.charAt(0).toUpperCase() + variable.slice(1)
                break
            default:
                break;
        }
        return variable || splitted[0];
    });
}

export function compileMarkdown(data, vars) {
    var converter = new showdown.Converter({
        ghCompatibleHeaderId: true,
        tables: true,
        strikethrough: true,
        simplifiedAutoLink: true,
        disableForced4SpacesIndentedSublists: true,
        extensions: [
            filterImports,
            filterInfoBlocks,
            filterSpecialTags,
            filterUnderscoreKatex,
            showdownKatexWithConfig,
            highlightWithPrism,
            filterHeaderLinks,
            filterNotificationBars,
            filterWrapTables,
            filterFixes
        ]
    });

    data = injectVariables(data, vars);
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