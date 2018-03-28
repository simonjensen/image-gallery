var ImageGallery = function(options)
{
	this.options = options || {
		'container': '.fs-gallery-container',
		'previewClass': '.fs-gallery-preview',
		'thumbContainer': '.fs-gallery-thumb-container',
		'thumbClass': '.fs-gallery-thumb',
		'overlayClass': 'fs-gallery-overlay',
		'modalClass': 'fs-gallery-modal'
	};

	this.previewIndex = 0;
	this.numberOfPreview = this.countPreview();
	this.setupIndexes();
	this.setupBindings();
};

ImageGallery.prototype.countPreview = function()
{
	return $(this.options.thumbClass).length;
};

ImageGallery.prototype.setupIndexes = function()
{
	var index;
	for (index = 0; index < $(this.options.thumbClass).length; index++) {
		$($(this.options.thumbClass)[index]).find('img').attr('data-index', index);
	}
};

ImageGallery.prototype.setupBindings = function()
{
	var _self = this;

	// Thumbnail click
	_self.registerThumbnailClick();

	// Preview click
	_self.registerPreviewClick();
};

ImageGallery.prototype.registerThumbnailClick = function()
{
	var _self = this;
	$(_self.options.thumbClass).on('click', function()
	{
		_self.previewIndex = $(this).find('img').data('index');
		$(_self.options.previewClass).find('img').attr('src', $(this).find('img').data('preview-image'));
	});
};

ImageGallery.prototype.registerPreviewClick = function()
{
	var _self = this;
	$(_self.options.previewClass).on('click', function()
	{
		_self.createOverlay();
		
		var _image = '<img src="' + $(this).find('img').attr('src') + '">';
		$('.' + _self.options.modalClass).html(_image);
	});
};

ImageGallery.prototype.createOverlay = function()
{
	if ($('.' + this.options.overlayClass).length == 0) {
		var _modal = document.createElement('div');
		_modal.className = this.options.modalClass;

		var _overlay = document.createElement('div');
		_overlay.className = this.options.overlayClass;
		_overlay.appendChild(_modal);
		document.body.appendChild(_overlay);

		this.createNavigation();
		this.registerScrollFix();
	}
};

ImageGallery.prototype.createNavigation = function()
{
		var _close = document.createElement('div');
		_close.className = 'fs-navigation fs-close';
		document.body.appendChild(_close);

		if ($(this.options.thumbContainer + ' li').length > 1) {
			var _left = document.createElement('div');
			_left.className = 'fs-navigation fs-left';
			document.body.appendChild(_left);

			var _right = document.createElement('div');
			_right.className = 'fs-navigation fs-right';
			document.body.appendChild(_right);
		}

		this.registerNavigation();
};

ImageGallery.prototype.registerScrollFix = function()
{
	var _self = this;
	$('.' + this.options.modalClass).on('DOMMouseScroll mousewheel', function(ev) {
		var $this = $(this),
			scrollTop = this.scrollTop,
			scrollHeight = this.scrollHeight,
			height = $this.height(),
			delta = ev.originalEvent.wheelDelta,
			up = delta > 0;

		var prevent = function() {
			ev.stopPropagation();
			ev.preventDefault();
			ev.returnValue = false;
			return false;
		}

		if (!up && -delta > scrollHeight - height - scrollTop) {
			$this.scrollTop(scrollHeight);
			return prevent();
		} else if (up && delta > scrollTop) {
			$this.scrollTop(0);
			return prevent();
		}
	});
};

ImageGallery.prototype.registerNavigation = function()
{
	var _self = this;
	
	// Close overlay
	$(document).keyup(function(e)
	{
		if (e.keyCode == 27) {
			_self.destroyOverlay();
		}
	});
	$('.fs-navigation.fs-close').on('click', function() {
		_self.destroyOverlay();
	});

	// Preview next
	$('.fs-right').on('click', function() {
		_self.previewNext();
	});
	$(document).keyup(function(e)
	{
		if (e.keyCode == 39) {
			_self.previewNext();
		}
	});

	// Preview previous
	$('.fs-left').on('click', function() {
		_self.previewPrevious();
	});
	$(document).keyup(function(e)
	{
		if (e.keyCode == 37) {
			_self.previewPrevious();
		}
	});
};

ImageGallery.prototype.previewNext = function()
{
	var _self = this;
	var index = _self.previewIndex;
	if (_self.previewIndex + 1 < _self.numberOfPreview) {
		index = _self.previewIndex + 1; // One forward
	} else {
		index = 0; // Select first
	}
	$(_self.options.thumbClass)[index].click();

	$(_self.options.previewClass).click();
};

ImageGallery.prototype.previewPrevious = function()
{
	var _self = this;
	var index = _self.previewIndex;
	if (_self.previewIndex - 1 >= 0) {
		index = _self.previewIndex - 1; // One back
	} else {
		index = _self.numberOfPreview - 1; // Select last
	}
	$(_self.options.thumbClass)[index].click();

	$(_self.options.previewClass).click();
};

ImageGallery.prototype.destroyOverlay = function()
{
	this.destroyNavigation();
	$('.' + this.options.overlayClass).fadeOut(250, function() {
		this.remove();
	});

};

ImageGallery.prototype.destroyNavigation = function()
{
	$('.fs-navigation').remove();
	$('.fs-left').off('click');
	$('.fs-right').off('click');
	$(document).unbind('keyup');
};