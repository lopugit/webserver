module.exports = {
  apps: [
    {
      script: 'npm run start',
      name: 'webserver',
      watch: ['./', '/etc/hosts'],
      node_args: '-r esm'
    }
  ]
};
