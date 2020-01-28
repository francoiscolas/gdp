'use strict';

class RendererFactory {
  
  constructor() {
    this.renderers = [];
  }

  create(source, args) {
    let Renderer = this.renderers.find(Renderer =>
      Renderer.isRenderable(source))
    return (Renderer) ? new Renderer(args) : null;
  }

  registerRenderer(Class) {
    this.renderers.push(Class);
  }

  unregisterRenderer(Class) {
    this.renderers.splice(this.renderers.indexOf(Class), 1);
  }

}

module.exports = RendererFactory;
