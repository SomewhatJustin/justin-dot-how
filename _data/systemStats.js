const si = require('systeminformation');

module.exports = async function() {
  try {
    const [temp, mem, cpu, os, time] = await Promise.all([
      si.cpuTemperature(),
      si.mem(),
      si.cpu(),
      si.osInfo(),
      si.time()
    ]);

    return {
      temperature: {
        main: temp.main,
        max: temp.max
      },
      memory: {
        total: (mem.total / (1024 * 1024 * 1024)).toFixed(2), // Convert to GB
        used: (mem.used / (1024 * 1024 * 1024)).toFixed(2),
        free: (mem.free / (1024 * 1024 * 1024)).toFixed(2)
      },
      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        speed: cpu.speed,
        cores: cpu.cores
      },
      os: {
        platform: os.platform,
        distro: os.distro,
        release: os.release,
        kernel: os.kernel
      },
      uptime: {
        system: Math.floor(time.uptime / 3600) // Convert to hours
      }
    };
  } catch (error) {
    console.error('Error fetching system stats:', error);
    return {
      error: 'Unable to fetch system statistics'
    };
  }
};