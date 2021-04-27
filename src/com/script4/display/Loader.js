import { Script4 } from '../Script4';

export class Loader extends Phaser.Loader {

	constructor(target) {
		super(Script4.core);
		this.target = target;
		this.content;
		this.onProgress;
		this.onComplete;
		this.onIOError;
	}

	load(_url, _name = "default") {
		if (_name == "default") {
			_name = _url.split("/");
			_name = _name[_name.length - 1];
			_name = _name.substring(0, _name.indexOf("."));
		}
		if (_url.indexOf(".png") != -1 || _url.indexOf(".jpg") != -1) {
			this.image(_name, _url);
		}
		this.start();
	}

	_onProgress(progress, cacheKey, success, totalLoaded, totalFiles) {
		this.onProgress({
			progress: progress,
			cacheKey: cacheKey,
			success: success,
			totalLoaded: totalLoaded,
			totalFiles: totalFiles,
			target: this.target
		});
		this.content = cacheKey;
	}

	_onComplete(e) {
		this.onComplete({
			content: this.content,
			target: this.target
		});
	}

	_onIOError(e) {
		this.onIOError({
			name: e,
			target: this.target
		});
	}

	addEventListener(type, listener) {
		if (!type) throw('event type not found!');
		if (type == 'progress') {
			this.onProgress = listener;
			this.onFileComplete.add(this._onProgress, this);
		} else if (type == 'complete') {
			this.onComplete = listener;
			this.onLoadComplete.add(this._onComplete, this);
		} else if (type == 'ioError') {
			this.onIOError = listener;
			this.onFileError.add(this._onIOError, this);
		}
	}

	removeEventListener(type, listener) {
		if (!type) throw('event type not found!');
		if (type == 'progress') {
			this.onFileComplete.remove(this._onProgress, this);
		} else if (type == 'complete') {
			this.onLoadComplete.remove(this._onComplete, this);
		} else if (type == 'ioError') {
			this.onFileError.remove(this._onIOError, this);
		}
	}

}