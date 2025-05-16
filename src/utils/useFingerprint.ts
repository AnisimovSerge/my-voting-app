import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    FingerprintJS.load().then(fp => {
      fp.get().then(result => setFingerprint(result.visitorId));
    });
  }, []);

  return fingerprint;
}


