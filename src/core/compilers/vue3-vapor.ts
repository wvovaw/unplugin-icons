import type { Compiler } from './types'
import { importModule } from 'local-pkg'
import { handleSVGId } from '../svgId'

export const Vue3VaporCompiler = (async (svg: string, collection: string, icon: string) => {
  const { compile } = await importModule('@vue/compiler-vapor')
  const { injectScripts, svg: handled } = handleSVGId(svg)

  let { code } = compile(handled, {
    filename: `${collection}-${icon}.vue`,
  })

  code = `import { markRaw } from 'vue'\n${code}`
  code = code.replace(/^export /gm, '')
  code += `\n\nexport default markRaw({ name: '${collection}-${icon}', render${
    injectScripts ? `, setup() {${injectScripts};return { idMap }}` : ''
  } })`
  code += '\n/* vite-plugin-components disabled */'

  return code
}) as Compiler
