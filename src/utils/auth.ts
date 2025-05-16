
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const AuthenticateUser = async () => {
  const fpPromise = FingerprintJS.load();
  const fp = await fpPromise;
  const result = await fp.get();
  return result.visitorId;
};



