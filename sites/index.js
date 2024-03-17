import fs from 'fs';

const sitesToExport = [
  {
    name: 'thingtime',
    port: 9999
  }
];

const hostsContentRaw = fs.readFileSync('/etc/hosts', 'utf8');

// remove any text before first # webserver start
const hostsContent = hostsContentRaw.split('# webserver start').slice(1).join('# webserver start');

// extract hostsContent split by # webserver start lines but keep the name of the site
const hostsSites = hostsContent.split('# webserver start').map((site) => {
  // get name of site
  const lines = site.split('\n').map((line) => {
    // split ip and domain
    const [ip, domain] = line.split('\t');
    return domain || line.trim();
  });
  const name = lines[0];
  const domains = lines.slice(1);
  return { name, domains };
});

export const sites = sitesToExport
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
