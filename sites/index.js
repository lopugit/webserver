import fs from 'fs';

const hostsContentRaw = fs.readFileSync('/etc/hosts', 'utf8');

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

const toExport = hostsSites
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

export const sites = toExport;
