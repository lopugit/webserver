import redbird from 'redbird';

import { sites } from './sites/index.js';

const proxy = redbird({ port: 80 });

console.log('Using sites', sites);

console.log('Starting webserver');
console.log('...');

sites.forEach((site) => {
  // log
  console.log(`Registering ${site.name} with url ${site.domain} at http://localhost:${site.port}`);
  console.log('...');
  proxy.register(site.domain, `http://localhost:${site.port}`);
  console.log('...');
});
