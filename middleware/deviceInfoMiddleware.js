const axios = require("axios");
const DeviceDetector = require("device-detector-js");
const detector = new DeviceDetector();

const deviceInfoMiddleware = async (req, res, next) => {
  try {
    const userAgent = req.headers["user-agent"];
    const device = detector.parse(userAgent);

    const os = device.os?.name || "Unknown";
    const browser = device.client?.name || "Unknown";
    const model = device.device?.model || "Desktop";
    const deviceDetails = `${device.os?.name || "OS"} ${
      device.client?.name || "Browser"
    } ${model}`;

    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress ||
      null;

    let location = "Unknown";
    if (ip && ip !== "::1") {
      try {
        const geoRes = await axios.get(`http://ip-api.com/json/${ip}`);
        const { city, regionName, country } = geoRes.data;
        location = `${city}, ${regionName}, ${country}`;
      } catch (err) {
        console.error("Location fetch failed:", err.message);
      }
    }

    req.deviceInfo = {
      os,
      browser,
      model,
      deviceDetails,
      ip,
      location,
    };

    next();
  } catch (error) {
    console.error("Device middleware error:", error.message);
    req.deviceInfo = {
      os: "Unknown",
      browser: "Unknown",
      model: "Unknown",
      deviceDetails: "Unknown",
      ip: null,
      location: "Unknown",
    };
    next();
  }
};

module.exports = deviceInfoMiddleware;
