class Modal {

}

var modal = new function() {
    this.description = $("#modal #modal__text");
    this.fileName = $("#modal__fileToUpload");
    this.img = '';
    this.getText = function () {
        return this.text.val();
    };
    this.getImg = function () {
    	var fileName = this.fileName.val();
		fileName = fileName.substr((fileName.lastIndexOf('\\') + 1));
		this.img = 'images/' + fileName;
    	return this.img;
    }
    this.resetBtn = function () {
    	alert('lala');
    	$('input#modal__text').val(null);

    	//this.description.val(null);
    	this.fileName.val(null);

    }

}