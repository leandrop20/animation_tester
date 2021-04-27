export class EventType {

	constructor(name) {
		this.name = name;
	}

}

EventType.ADD = new EventType('add');
EventType.REMOVE = new EventType('remove');