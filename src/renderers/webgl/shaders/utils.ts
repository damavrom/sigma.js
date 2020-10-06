/**
 * Sigma.js Shader Utils
 * ======================
 *
 * Code used to load sigma's shaders.
 */

/**
 * Function used to load a shader.
 */
function loadShader(type: string, gl: WebGLRenderingContext, source: string): WebGLShader {
  const glType = type === "VERTEX" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;

  // Creating the shader
  const shader = gl.createShader(glType);
  if (shader === null) {
    throw new Error(`sigma/renderers/webgl/shaders/utils.loadShader: error while creating the shader`);
  }

  // Loading source
  gl.shaderSource(shader, source);

  // Compiling the shader
  gl.compileShader(shader);

  // Retrieving compilation status
  const successfullyCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  // Throwing if something went awry
  if (!successfullyCompiled) {
    const infoLog = gl.getShaderInfoLog(shader);

    gl.deleteShader(shader);
    throw new Error(
      `sigma/renderers/webgl/shaders/utils.loadShader: error while compiling the shader:\n${infoLog}\n${source}`,
    );
  }

  return shader;
}

const loadVertexShader = loadShader.bind(null, "VERTEX"),
  loadFragmentShader = loadShader.bind(null, "FRAGMENT");

export { loadVertexShader, loadFragmentShader };

/**
 * Function used to load a program.
 */
export function loadProgram(gl: WebGLRenderingContext, shaders: Array<WebGLShader>): WebGLProgram {
  const program = gl.createProgram();
  if (program === null) {
    throw new Error("sigma/renderers/webgl/shaders/utils.loadProgram: error while creating the program.");
  }

  let i, l;

  // Attaching the shaders
  for (i = 0, l = shaders.length; i < l; i++) gl.attachShader(program, shaders[i]);

  gl.linkProgram(program);

  // Checking status
  const successfullyLinked = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!successfullyLinked) {
    gl.deleteProgram(program);
    throw new Error("sigma/renderers/webgl/shaders/utils.loadProgram: error while linking the program.");
  }

  return program;
}