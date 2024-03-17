module.exports = {
  apps: [
    {
      script: 'npm run start',
      name: 'webserver',
      watch: ['./'],
      node_args: '-r esm'
    }
  ]
};
