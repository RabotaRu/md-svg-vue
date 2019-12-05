const path = require('path');
const fs = require('fs');
const jsonFormat = require('json-format');
const { promisify } = require('util');
const kebabCase = require('lodash').kebabCase;
const { JSDOM } = require('jsdom');

const { document } = new JSDOM('').window;

const readFileAsync = promisify(fs.readFile);
const readDirAsync = promisify(fs.readdir);
const writeFileAsync = promisify(fs.writeFile);

const ICONS_NS = [
  'action', 'alert', 'av', 'communication', 'content', 'device', 'editor', 'file',
  'hardware', 'image', 'maps', 'navigation', 'notification', 'places', 'social', 'toggle'
];
const DIST_PATH = path.resolve(__dirname, 'dist');
const SVG_PATH = path.resolve(__dirname, 'node_modules/@rabota/icons');
const TPL_PATH = path.resolve(__dirname, 'build.vue');
const PKG_FILE = path.resolve(__dirname, 'package.json');

function toPascalCase (str) {
  return str
    .toLowerCase()
    .split(/[-_]/g)
    .map(token => token.charAt(0).toUpperCase() + token.slice(1))
    .join('')
}

const clearPackage = packageData => {
  return Object.keys(packageData).reduce((p, key) => {
    if (!/devDependencies|dependencies/.test(key)) {
      return { ...p, [key]: packageData[key] }
    }
    return p;
  }, {});
};

const copyPackage = async (sourcePath, targetPath) => {
  const packageData = await readFileAsync(sourcePath, { encoding: 'utf8' });
  const cleanPackageData = clearPackage(JSON.parse(packageData));

  writeFileAsync(targetPath, jsonFormat(cleanPackageData, {
    type: 'space',
    size: 2
  }));
};

const populateTemplate = (template, component) => {
  let elementsString = componentElements(component.elements);

  if (component.paths.length && component.elements.length) {
    elementsString = `, ${elementsString}`;
  }

  return {
    ns: component.ns,
    name: component.name,
    content: template
      .replace(/\{\{icon\}\}/g, kebabCase(component.name))
      .replace(/\{\{paths\}\}/g, componentPaths(component.paths))
      .replace(/\{\{elements\}\}/g, elementsString)
  }
};

const componentPaths = (paths) => {
  const template = `h('path', {
          attrs: {
            d: '{{path}}'
          },
          style: {
            fill: this.color
          }
        })`;
  return paths.map(path => {
    return template.replace(/\{\{path\}\}/g, path);
  }).join(', ');
};

const componentElements = (elements) => {
  if (!elements.length) {
    return ''
  }

  const elementsString = elements.map(element => {
    return `h('${element.name}', {
          attrs: {
            ${element.attributes.map(attribute => {
              return `${attribute.name}: '${attribute.value}'`
            }).join(`,
            `)}
          },
          style: {
            fill: this.color
          }
        })`
  }).join(', ');

  return `${elementsString}`;
};

const buildIconComponents = async (templatePath, components) => {
  const template = await readFileAsync(templatePath);

  return components.map(component =>
    populateTemplate(template.toString('utf-8'), component)
  )
};

const componentName = (name, ext = '.vue') => {
  return `Md${name}${ext}`;
};

const writeIconComponents = async (ns, buildPath, components) => {
  buildPath = path.join(buildPath, ns);
  checkCreateDir(buildPath);
  components.forEach(component => {
    console.log(path.join(buildPath, componentName(component.name)));
    writeFileAsync(path.join(buildPath, componentName(component.name)), component.content)
  })
};

const checkCreateDir = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

const writeIndex = async (ns, buildPath, components, global = false) => {
  if (!global) {
    buildPath = path.join(buildPath, ns);
  }
  checkCreateDir(buildPath);
  let fileContent = components.reduce((acc, component) => {
    return acc + `export ${componentName(component.name, '')} from './${global ? `${component.ns}/` : ''}${componentName(component.name)}';\n`;
  }, '');
  writeFileAsync(path.join(buildPath, `index.js`), fileContent);
};

const createDomElement = (html) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  return tempElement.firstChild;
}

const buildIconBodyList = (ns, svgPath, svgList) => {
  let list = svgList.filter(svg => /(24px)/gi.test(svg))
    .map(async svg => {
      const svgFile = await readFileAsync(path.join(svgPath, svg));

      const body = {
        ns,
        name: toPascalCase(svg).slice(0, -8).slice(2),
        paths: await (async () => {
          const regexStr = '\\sd="([ a-zA-Z0-9.-]+)"';
          const dRegex = new RegExp( regexStr, 'i' );
          const dGlobalRegex = new RegExp( regexStr, 'gi' );

          const matches = svgFile.toString().match( dGlobalRegex );

          const paths = [];

          if (matches) {
            matches.reduce((p, d) => {
              const matched = d && d.match( dRegex );
              return matched ? (
                p.push( matched[1] ),
                  p
              ) : p;
            }, paths)
          }

          return paths;
        })(),
        elements: []
      }

      const svgElement = createDomElement(svgFile.toString());
      [...svgElement.children].forEach(child => {
        const tagName = child.tagName.toLowerCase();
        if (tagName !== 'path') {
          const svgPart = {
            name: tagName,
            attributes: []
          };

          [...child.attributes].forEach(({ name, value }) => {
            svgPart.attributes.push({
              name,
              value
            })
          })

          body.elements.push(svgPart);
        }
      });

      return body;
    });

  return Promise.all(list);
};

async function build () {
  let allComponents = [];
  for (let ns of ICONS_NS) {
    const nsPath = path.join(SVG_PATH, `${ns}/svg/production`);
    const svgList = await readDirAsync(nsPath);
    const svgBodyList = await buildIconBodyList(ns, nsPath, svgList);
    const iconComponents = await buildIconComponents(TPL_PATH, svgBodyList);
    await writeIconComponents(ns, DIST_PATH, iconComponents);
    await writeIndex(ns, DIST_PATH, iconComponents);

    allComponents.push(...iconComponents);
  }
  await writeIndex('', DIST_PATH, allComponents, true);
  // for docs
  await writeFileAsync(
    path.join(__dirname, 'docs', `components.json`),
    JSON.stringify(allComponents.map(el => ({ ns: el.ns, name: 'Md' + el.name })), null, '  ')
  );
  await copyPackage(PKG_FILE, path.resolve(DIST_PATH, 'package.json'))
}

build().catch(console.error.bind(console));
