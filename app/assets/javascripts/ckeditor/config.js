CKEDITOR.editorConfig = function(config) {
    config.toolbar = "4ye";
    config.toolbar_4ye = [
        {name: "styles",   items: ["Bold","Italic","Underline","Strike","Subscript","Superscript","-","RemoveFormat","Link","Unlink","Image"]},
        {name: "blocks",   items: ["NumberedList","BulletedList","-","Outdent","Indent","-","Blockquote","-","JustifyLeft","JustifyCenter","JustifyRight","JustifyBlock"]},
        {name: "document", items: ["Source","-","ShowBlocks"]}
    ];
    config.filebrowserImageUploadUrl = "http://img.4ye.me/images";
    config.extraPlugins = "simpleuploads";
};
