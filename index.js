import redbird from 'redbird';
import fs from 'fs';

const hostsContentRaw = fs.readFileSync('/etc/hosts', 'utf8');

// find ports in hosts file defined by line looking like # ports=XXXX,XXXX
const ports = hostsContentRaw.match(/# ports=(\d+,\d+)/)?.[1]?.split(',') || [80, 443];

console.log('nik ports', ports);

const proxies = ports.map((port, idx) => {
  return redbird({
    port: port
    // SSL attempt
    // letsencrypt: {
    //   path: './certs',
    //   port: 9282 + idx // LetsEncrypt minimal web server port for handling challenges. Routed 80->9999, no need to open 9999 in firewall. Default 3000 if not defined.
    // },
    // ssl: {
    //   // http2: true,
    //   port: 443 // SSL port used to serve registered https routes with LetsEncrypt certificate.
    // }
  });
});

// setup sites

// remove any text before first # webserver start
const hostsContent = hostsContentRaw.split('# webserver start').slice(1).join('# webserver start');

// extract hostsContent split by # webserver start lines but keep the name of the site
const hostsSites = hostsContent.split('# webserver start').map((site) => {
  // get name of site
  const rawLines = site.split('\n');

  const definition = rawLines[0].trim();

  const name = definition.split(' ')[0];

  // extract port from definition string in formart port:XXXX
  // use regexp
  const port = definition.match(/port:(\d+)/)[1];

  const lines = rawLines.slice(1);

  const domains = lines.map((line) => {
    // split ip and domain
    const sanitisedLine = line.replace('\t', ' ').trim();
    const [ip, domain] = sanitisedLine.split(' ');
    return domain || line.trim();
  });

  return { name, port, domains };
});

const sites = hostsSites
  .map((site) => {
    const hostDetails = hostsSites.find((host) => host.name === site.name);

    return hostDetails.domains.map((domain) => {
      return {
        ...site,
        port: site.port,
        domain
      };
    });
  })
  .flat()
  .filter((site) => site.domain);

console.log('Using sites', sites);

console.log('Starting webserver');
console.log('...');

let chromeSafeDomains = '';

sites.forEach((site) => {
  const domain = site.domain;

  // log
  console.log(`Registering ${site.name} with url ${domain} at http://localhost:${site.port}`);

  // append domain to chrome safe domains with protocol http://
  chromeSafeDomains += `http://${domain},`;

  console.log('...');
  // register for each proxy
  proxies.forEach((proxy) => {
    console.log('Registering port', proxy?.opts?.port);
    console.log('...');
    proxy.register(domain, `http://localhost:${site.port}`, {
      // ssl attempt
      // ssl: {
      //   letsencrypt: {
      //     email: 'lopudesigns@gmail.com',
      //     production: false
      //   }
      // }
    });
    console.log('...');
  });
});

// write chrome safe domains to file
fs.writeFileSync('./chrome-safe-domains.txt', chromeSafeDomains);
