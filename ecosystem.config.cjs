module.exports = {
  apps: [
    {
      name: "consultedge-backend",
      script: "api/server.js",
      cwd: ".",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
