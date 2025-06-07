import { drawDot, type Pos } from "../canvas";

export abstract class Component {
	static nom: string

	pos: Pos;
	id: number;
	name: string;
	U: number;

	constructor(U: number, pos: Pos, id: number, name: string) {
		this.U = U
		this.pos = pos;
		this.id = id;
		this.name = name;
	}

	abstract getDefaultImage(): string
	abstract draw: (ctx: CanvasRenderingContext2D, size: number) => void;
	abstract properties?: () => JSX.Element[];

	getConnections(): Connection[] {
		return Circuit.instance.connections.filter(
			(con) => con.a.component === this || con.b.component === this)
	}
}

export abstract class PowerSource extends Component {
	on: boolean;

	public constructor(U: number, pos: Pos, id: number, name: string) {
		super(U, pos, id, name)
		this.on = true
	}

	getVoltage = () => Number(this.on && this.U);
}

export abstract class Récepteur extends Component {
	public R: number;
	public P: number;

	public constructor(
		R: number,
		pos: Pos, id: number, name: string
	) {
		super(0, pos, id, name)
		this.R = R
		this.P = 0
	}
}

export type Side = -1 | 1;

export class ComponentSide {
	component: Component;
	side: Side;

	constructor(component: Component, side: Side) {
		this.component = component;
		this.side = side;
	}

	getPos = (componentSize: number): Pos => ({
		x: this.component.pos.x + (componentSize / 2) * this.side,
		y: this.component.pos.y,
	});
}

export class Connection {
	a: ComponentSide;
	b: ComponentSide;

	constructor(a: ComponentSide, b: ComponentSide) {
		this.a = a;
		this.b = b;
	}

	draw(ctx: CanvasRenderingContext2D, componentSize: number) {
		ctx.beginPath();

		const a = this.a.getPos(componentSize);
		const b = this.b.getPos(componentSize);

		ctx.moveTo(a.x, a.y);

		a.x += (componentSize / 2) * this.a.side;
		b.x += (componentSize / 2) * this.b.side;

		ctx.lineTo(a.x, a.y);

		const pos: Pos = { x: 0, y: 0 };
		if (a.x > b.x) {
			pos.x = this.a.side > 0 ? a.x : b.x;
			pos.y = this.a.side > 0 ? b.y : a.y;
		} else {
			pos.x = this.a.side > 0 ? b.x : a.x;
			pos.y = this.a.side > 0 ? a.y : b.y;
		}

		ctx.lineTo(pos.x, pos.y);

		ctx.lineTo(b.x, b.y);
		ctx.lineTo(b.x - (componentSize / 2) * this.b.side, b.y);
		ctx.stroke();
	}

	getSide(mainSideComponent: Component) {
		if (this.a.component === mainSideComponent) {
			return this.a
		}
		if (this.b.component === mainSideComponent) {
			return this.b
		}
		throw new Error("Component is not part of this connection")
	}

	getOtherSide(mainSideComponent: Component) {
		if (this.a.component === mainSideComponent) {
			return this.b
		}
		if (this.b.component === mainSideComponent) {
			return this.a
		}
		throw new Error("Component is not part of this connection")
	}

	getComponents = () => [this.a.component, this.b.component];
}

export function getElecImagePath(name: string) {
	return `/assets/elec/${name}.png`
}

export class CircuitBranch {
	I = 0;
	U = 0;
	R = 0;
	parentComponent: Component;
	powerSourceOrigin: PowerSource;
	childBranches: CircuitBranch[];

	constructor(parentComponent: Component, fromConnection: Connection | null, powerSourceOrigin: PowerSource) {
		this.powerSourceOrigin = powerSourceOrigin
		this.parentComponent = parentComponent
		this.childBranches = []
		const connexions = parentComponent.getConnections().filter(conn => {
			const currentSide = conn.getSide(parentComponent);
			const isALeftSidePowerSourceConn = fromConnection === null && currentSide.side === -1
			const isOppositeSideConnection = fromConnection?.getSide(parentComponent) ?? -1 === currentSide.side * -1;
			return isOppositeSideConnection && !isALeftSidePowerSourceConn;
		})

		for (const conn of connexions) {
			const connOtherSide = conn.getOtherSide(parentComponent)
			if (connOtherSide.component !== powerSourceOrigin) {
				const branch = new CircuitBranch(connOtherSide.component, conn, powerSourceOrigin)
				this.childBranches.push(branch)
			}
		}
		const childBranchesResEquiv = this.childBranches.length ? (1 / this.childBranches.reduce((acc, branch) => acc + 1 / branch.R, 0)) : 0;
		this.R = (parentComponent instanceof Récepteur ? parentComponent.R : 0) + childBranchesResEquiv
	}

	calculateIntensity() {
		this.I = this.U / this.R
		if (!(this.parentComponent instanceof PowerSource))
			this.parentComponent.U = (this.I * (this.parentComponent instanceof Récepteur ? this.parentComponent.R : 0))

		if (this.parentComponent instanceof Récepteur) this.parentComponent.P = this.I * this.U

		for (const branch of this.childBranches) {
			branch.U = this.U - (this.parentComponent instanceof PowerSource ? 0 : this.parentComponent.U)
			branch.calculateIntensity()
		}

	}
}

export class Circuit {
	public static instance = new Circuit()
	connections: Connection[] = []
	components: Component[] = []
	branches: CircuitBranch[] = []

	draw(ctx: CanvasRenderingContext2D, componentSize: number) {
		this.buildBranches()
		for (const component of this.components) {
			component.draw(ctx, componentSize);
		}

		for (const c of this.connections) {
			const sidePosA = c.a.getPos(componentSize);
			const sidePosB = c.b.getPos(componentSize);
			drawDot(ctx, sidePosA);
			drawDot(ctx, sidePosB);
			c.draw(ctx, componentSize);
		}
	}

	buildBranches() {
		this.branches = []
		const powerSources = this.components.filter(comp => comp instanceof PowerSource)
		for (const powerSource of powerSources) {
			const branch = new CircuitBranch(powerSource, null, powerSource)
			branch.U = powerSource.U
			this.branches.push(branch)
		}

		for (const branch of this.branches) {
			branch.calculateIntensity()
		}

		console.log(this);
	}
}