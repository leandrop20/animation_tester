import { Script4 } from '../Script4';

export class Sound extends Phaser.Sound {

	constructor(soundName) {
		super(Script4.core, soundName);
		Script4.core.sound._sounds.push(this);
	}

	static play(soundName, vol = 1.0, loop = false) {
		var channel = new Sound(soundName);
		channel.volume = vol;
		channel.loop = loop;
		channel.play();
		return channel;
	}

	addEventListener(type, listener) {
		if (!type) throw('event type not found!');
		if (type == 'soundComplete') {
			this.onStop.add(listener, this);
		}
	}

	removeEventListener(type, listener) {
		if (!type) throw('event type not found!');
		if (type == 'soundComplete') {
			this.onStop.remove(listener, this);
		}
	}
	
}