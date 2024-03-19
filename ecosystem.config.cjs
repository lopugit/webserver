module.exports = {
  apps: [
    {
      script: 'npm run start',
      name: 'webserver',
      watch: ['./index.js', '/etc/hosts'],
      node_args: '-r esm'
    }
  ]
};
