import { BaseObject } from './BaseObject';

export class MeshData extends BaseObject {

	constructor() {
		super();

		this.slotPose = new dragonBones.Matrix();
        this.uvs = []; // vertices * 2
        this.vertices = []; // vertices * 2
        this.vertexIndices = []; // triangles * 3
        this.boneIndices = []; // vertices bones
        this.weights = []; // vertices bones
        this.boneVertices = []; // vertices bones * 2
        this.bones = []; // bones
        this.inverseBindPose = []; // bones
	}

	static toString() {
        return "[class MeshData]";
    }

    _onClear() {
        this.skinned = false;
        this.slotPose.identity();
        this.uvs.length = 0;
        this.vertices.length = 0;
        this.vertexIndices.length = 0;
        this.boneIndices.length = 0;
        this.weights.length = 0;
        this.boneVertices.length = 0;
        this.bones.length = 0;
        this.inverseBindPose.length = 0;
    }

}