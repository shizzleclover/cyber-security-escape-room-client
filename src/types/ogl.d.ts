declare module 'ogl' {
  export class Renderer {
    constructor(opts?: Record<string, any>);
    gl: WebGLRenderingContext & { canvas: HTMLCanvasElement };
    dpr: number;
    setSize(w: number, h: number): void;
    render(opts: { scene: any }): void;
    destroy?(): void;
  }
  export class Program {
    constructor(gl: any, opts: Record<string, any>);
    remove?(): void;
  }
  export class Mesh {
    constructor(gl: any, opts: Record<string, any>);
    remove?(): void;
  }
  export class Triangle {
    constructor(gl: any);
    remove?(): void;
  }
}
