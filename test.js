function getMarkdown(path) {
    $.get(path, function (data) {
        var markdown = mdcompiler.parseHeader(data);
        console.log(markdown.headers);
        var html = mdcompiler.compileMarkdown(markdown.body);
        window.testhtml = html;
        $('#target').html(html);
    });
}

$(function () {
    getMarkdown('path/to/markdown.md');
})