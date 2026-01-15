module.exports = {
  apps: [
    {
      name: "tplus-strapi",
      cwd: "/var/www/tplus-strapi",
      script: "npm",
      args: "run develop",
      watch: false,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
