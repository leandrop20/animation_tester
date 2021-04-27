import { Script4 } from "../Script4";
import { Sprite } from "./Sprite";
import { Point } from '../geom/Point';

class Particle {

	constructor() {
		this.position = new Point();
		this.velocity = new Point();
		this.accel = new Point();
		this.sprite = null;
	}

	setVelocity(angle, speed) {
		this.velocity.x = Math.cos(angle) * speed;
		this.velocity.y = Math.sin(angle) * speed;
	}

	setAccel(angle, speed) {
		this.accel.x = Math.cos(angle) * speed;
		this.accel.y = Math.sin(angle) * speed;
	}

}

export class PDParticleSystem extends Sprite {

	static get emitterID() { return PDParticleSystem._emitterID; }
	static set emitterID(_value) { return PDParticleSystem._emitterID = _value; }

	constructor(texture) {
		super(Script4.core, 0, 0);
		var settings = Script4.core.cache.getJSON(texture + 'Settings');
		this.texture = texture;
		if (PDParticleSystem.emitterID === undefined) { PDParticleSystem.emitterID = 0; }
		PDParticleSystem.emitterID++;
		this.name = 'emitter' + PDParticleSystem.emitterID;
		this.position = new Point(settings.positionX, settings.positionY);
		this.positionVar = new Point(settings.positionVarX, settings.positionVarY);
		this.emitterX = 0;
		this.emitterY = 0;
		this.angle = ((settings['angle'] / 180) * Math.PI) - Math.PI;
		this.angleVar = (settings['angleVar'] / 360) * Math.PI;
		this.speed = settings.speed;
		this.speedVar = settings.speedVar;
		this.life = settings.life;
		this.lifeVar = settings.lifeVar;
		this.duration = settings.duration;
		this.durationTimer = 0;
		this.rate = settings.rate;
		this.rateTimer = 0;
		this.count = settings.count;
		this.active = false;
		this.velRotate = settings.velRotate;
		this.velRotateVar = settings.velRotateVar;
		this.rotate = settings.rotate;
		this.rotateVar = settings.rotateVar;
		this.startAlpha = settings.startAlpha;
		this.endAlpha = settings.endAlpha;
		this.startScale = settings.startScale;
		this.startScaleVar = settings.startScaleVar;
		this.endScale = settings.endScale;
		this.endScaleVar = settings.endScaleVar;
		this.target = null;
		this.targetForce = 0;
		this.accelAngle = settings.accelAngle;//Math.PI / 2
		this.accelAngleVar = settings.accelAngleVar;
		this.accelSpeed = settings.accelSpeed;
		this.accelSpeedVar = settings.accelSpeedVar;
		this.velocityLimit = new Point();
		this.startColor = settings.startColor;
		this.endColor = settings.endColor;
		this.blendMode = settings.blendMode;
	}

	getVariance(value) {
		return (Math.random() * value) * (Math.random() > 0.5 ? -1 : 1);
	}

	addParticle() {
		var particle = new Particle();
		particle.position.x = this.emitterX + this.getVariance(this.positionVar.x);
		particle.position.y = this.emitterY + this.getVariance(this.positionVar.y);

		var angleVar = this.getVariance(this.angleVar);
		var angle = this.angle + angleVar;
		var speed = this.speed + this.getVariance(this.speedVar);

		particle.setVelocity(angle, speed);

		if (this.angleVar !== this.accelAngleVar) { angleVar = this.getVariance(this.accelAngleVar); }

		angle = this.accelAngle + angleVar;
		speed = this.accelSpeed + this.getVariance(this.accelSpeedVar);

		particle.setAccel(angle, speed);

		particle.life = this.life + this.getVariance(this.lifeVar);

		particle.sprite = new Phaser.Sprite(Script4.core, particle.position.x, particle.position.y, this.texture);
		particle.sprite.anchor.set(0.5);
		particle.sprite.particle = particle;
		particle.sprite.blendMode = Phaser.blendModes[this.blendMode];
		particle.sprite.tint = Phaser.Color.getColor(this.startColor[0], this.startColor[1], this.startColor[2]);

		particle.rotate = this.rotate + this.getVariance(this.rotateVar);
		particle.velRotate = this.velRotate + this.getVariance(this.velRotateVar);

		particle.deltaColor = [0,0,0];
		for (var i = 0; i < this.startColor.length; i++) {
			if (this.startColor[i] !== this.endColor[i]) {
				particle.deltaColor[i] = this.endColor[i]-this.startColor[i];
				particle.deltaColor[i] /= particle.life;
			} else {
				particle.deltaColor[i] = 0;
			}
		}

		particle.sprite.tint = Phaser.Color.getColor(...this.startColor);

		if (this.startAlpha !== this.endAlpha) {
			particle.deltaAlpha = this.endAlpha - this.startAlpha;
			particle.deltaAlpha /= particle.life;
		} else {
			particle.deltaAlpha = 0;
		}

		particle.sprite.alpha = this.startAlpha;

		var startScale = this.startScale + this.getVariance(this.startScaleVar);
		if (this.startScale !== this.endScale) {
			particle.deltaScale = (this.endScale + this.getVariance(this.endScaleVar)) - startScale;
			particle.deltaScale /= particle.life;
		} else {
			particle.deltaScale = 0;
		}

		particle.sprite.scale.x = particle.sprite.scale.y = startScale;

		this.addChild(particle.sprite);
	}

	updateParticle(particle, delta) {
		if (particle.life > 0) {
            particle.life -= delta;
            if(particle.life <= 0) { return this.removeParticle(particle); }
        }

        if (this.targetForce > 0) {
            particle.accel.set(this.target.x - particle.position.x, this.target.y - particle.position.y);
            particle.accel.normalize().multiply(this.targetForce);
        }

        particle.velocity.multiplyAdd(particle.accel, delta);
        if (this.velocityLimit.x > 0 || this.velocityLimit.y > 0)  { particle.velocity.limit(this.velocityLimit); }
        if (particle.velRotate) { particle.velocity.rotate(particle.velRotate * delta); }
        particle.position.multiplyAdd(particle.velocity, 1 * delta);

        if (particle.deltaColor) {
        	var currentColor = Phaser.Color.valueToColor(particle.sprite.tint);
        	var colorValue0 = Math.max(0, currentColor.r + particle.deltaColor[0] * delta);
        	var colorValue1 = Math.max(0, currentColor.g + particle.deltaColor[1] * delta);
        	var colorValue2 = Math.max(0, currentColor.b + particle.deltaColor[2] * delta);
        	particle.sprite.tint = Phaser.Color.getColor(colorValue0, colorValue1, colorValue2);
        }

        if (particle.deltaAlpha) { particle.sprite.alpha = Math.max(0, particle.sprite.alpha + particle.deltaAlpha * delta); }
        if (particle.deltaScale) { particle.sprite.scale.x = particle.sprite.scale.y += particle.deltaScale * delta; }
        particle.sprite.rotation += particle.rotate * delta;
        particle.sprite.position.x = particle.position.x;
        particle.sprite.position.y = particle.position.y;
	}

	removeParticle(particle) {
		this.removeChild(particle.sprite);
		particle = null;
	}

	emit(count = 1) {
		for (var i = 0; i < count; i++) {
			this.addParticle();
		}
	}

	update() {
	    var delta = Script4.core.time.elapsed / 1000;

		this.durationTimer += delta;
		if (this.duration > 0) { this.active = this.durationTimer < this.duration; }

		if (this.rate && this.active) {
			this.rateTimer += delta;
			if (this.rateTimer >= this.rate) {
				this.rateTimer = 0;
				this.emit(this.count);
			}
		}

		for (var i = this.children.length - 1; i >= 0; i--) {
			this.updateParticle(this.children[i].particle, delta);
		}
	}

	start(duration = 1.0) {
		this.active = true;
		this.duration = duration;
		this.durationTimer = 0;
		this.emit();
	}

	stop(clearParticles = false) {
		this.active = false;
		if (clearParticles) { this.removeChildren(); }
	}

	removeFromParent() { if (this.parent) { this.parent.removeChild(this); } }

}