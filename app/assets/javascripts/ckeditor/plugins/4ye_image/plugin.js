CKEDITOR.plugins.add("4ye_image", {
    init: function(editor) {
        var $file_input = jQuery("<input type=\"file\">").hide().appendTo("body");

        var upload = function(file) {
            var img  = editor.document.createElement('img')
              , data = new FormData;

            if (!file.name) file.name = "image" + (new Date).valueOf() + ".png";
            data.append("file", file, file.name);
            img.setAttribute("alt", "正在上传图片....");
            editor.insertElement(img);
            
            var deferred = jQuery.ajax({
                type : "POST",
                url  :  "http://10.211.55.2:4000/images",
                data : data,
                contentType: false,
                processData: false
            });
            
            deferred.done(function(res) {
                img.setAttribute("alt", file.name);
                setTimeout(function() {
                    img.setAttribute("src", res.orig);
                }, 8000);
            });
        }

        $file_input.on("change", function() {
            var file = this.files[0];
            upload(file);
        });
        
        editor.on("paste", function(event) {
            var raw = event.data.raw;

            if (raw) {
                var items = (raw.clipboardData || raw.originalEvent.clipboardData).items;

                console.log(items);

                for (var i in items) {
                    var item = items[i];

                    if (item.type && item.type.match(/^image\/\w+$/)) {
	                      var file = item.getAsFile();
	                      if (file) upload(file);
                    }
                }
            }

            console.log(raw);
        });
        
        editor.addCommand("4ye_upload_image", {
            exec: function(editor) {
                $file_input.trigger("click");
            }
        });

        editor.ui.addButton("4yeImage", {
            label   : "Upload Image",
            command : "4ye_upload_image",
        });
    }
});
