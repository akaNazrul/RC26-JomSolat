import { useState, useEffect, useRef } from 'react';
import { Locate, RotateCw, MapPin } from 'lucide-react';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

interface QiblaCompassProps {}

// Utility: Fetch Qibla direction from Aladhan API  
async function fetchQiblaFromAPI(lat: number, lng: number): Promise<number | null> {
  try {
    const response = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lng}`);
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    if (data.code === 200 && data.data?.direction) {
      console.log('Qibla from API:', data.data.direction);
      return data.data.direction;
    }
    return null;
  } catch (error) {
    console.error('Aladhan API error:', error);
    return null;
  }
}

// Utility: Request motion/orientation permission (iOS 13+, Android)
async function requestMotionPermission(): Promise<boolean> {
  console.log('Attempting to request motion/orientation permission...');

  if (typeof DeviceOrientationEvent === 'undefined') {
    console.error('DeviceOrientationEvent not defined on this browser');
    return false;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  try {
    // Check if requestPermission exists
    const hasRequestPermission = typeof (DeviceOrientationEvent as any).requestPermission === 'function';
    console.log(`Platform: ${isIOS ? 'iOS' : isAndroid ? 'Android' : 'Other'}`);
    console.log(`Has requestPermission: ${hasRequestPermission}`);

    if (hasRequestPermission) {
      // iOS 13+ or Android (Chrome 91+): explicit permission request
      console.log('Calling DeviceOrientationEvent.requestPermission()...');
      const permissionState = await (DeviceOrientationEvent as any).requestPermission();
      console.log(`Permission response: ${permissionState}`);

      if (permissionState === 'granted') {
        console.log('Motion permission granted');
        return true;
      } else if (permissionState === 'denied') {
        console.warn('Motion permission denied by user');
        return false;
      } else {
        console.log('Motion permission status:', permissionState);
        return false;
      }
    } else {
      console.log('No explicit permission API. Permission may be implicit or managed by system settings.');
      return true; // Assume granted on older browsers or implicit permission systems
    }
  } catch (error: any) {
    console.error('Motion permission error:', error);
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    return false;
  }
}

export default function QiblaCompass(_props: QiblaCompassProps) {
  const [locationError, setLocationError] = useState('');
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [deviceOrientation, setDeviceOrientation] = useState(0);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualLat, setManualLat] = useState('5.3414');
  const [manualLng, setManualLng] = useState('100.3048');
  const [smoothedOrientation, setSmoothedOrientation] = useState(0);
  const smoothedRef = useRef(0);
  const [displayedQibla, setDisplayedQibla] = useState(0);
  const [motionPermissionDenied, setMotionPermissionDenied] = useState(false);
  const [requestingMotion, setRequestingMotion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Detect if running on mobile/Android
  const isMobileDevice = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isAndroid = () => /Android/.test(navigator.userAgent);
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Request motion permission after location is obtained
  const requestMotionAfterLocation = async () => {
    console.log('[requestMotionAfterLocation] Starting motion permission request...');
      setRequestingMotion(true);

      const motionGranted = await requestMotionPermission();

      setRequestingMotion(false);
      if (motionGranted) {
        console.log('[requestMotionAfterLocation] Motion permission granted - arrow will move dynamically');
        setMotionPermissionDenied(false);
      } else {
        console.warn('[requestMotionAfterLocation] Motion permission denied or unavailable');
        setMotionPermissionDenied(true);
      }
  };

  // Manual trigger for motion permission (user can click button if auto-request doesn't work)
  const handleRequestMotionManually = async () => {
    console.log('[handleRequestMotionManually] User manually requesting motion permission');
    await requestMotionAfterLocation();
  };

  // Calculate Qibla bearing from user lat/lng to Kaaba
  const calculateQiblaDirection = (lat: number, lng: number) => {
    const phi = (KAABA_LAT * Math.PI) / 180;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    const lambda = ((lng - KAABA_LNG) * Math.PI) / 180;
    const y = Math.sin(lambda);
    const x = cosPhi * Math.tan(lat * Math.PI / 180) - sinPhi * Math.cos(lambda);
    
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  // Request geolocation with Aladhan API fallback
  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported on this device');
      return;
    }

    setIsLoading(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
          console.log('Location obtained:', { latitude, longitude });
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Try math-based calculation first (faster, no API call)
        const direction = calculateQiblaDirection(latitude, longitude);
        const normalizedDirection = (direction + 360) % 360;
        console.log('Qibla from math:', normalizedDirection);
        
        setQiblaDirection(normalizedDirection);
        setLocationError('');
        setIsLoading(false);
        
        // Request motion permission IMMEDIATELY after location obtained (preserve gesture context)
        // Do not use setTimeout - it breaks the user gesture context needed for permission prompt
        console.log('Location obtained - requesting motion permission now (preserving gesture context)');
        await requestMotionAfterLocation();
      },
      async (error) => {
        console.log('Geolocation error code:', error.code, 'message:', error.message);
        setIsLoading(false);
        
        // Fallback to Aladhan API with default Gelugor location
        console.log('Falling back to Aladhan API with default location...');
        try {
          const defaultLat = 5.3414; // Gelugor, Penang
          const defaultLng = 100.3048;
          
          const apiQibla = await fetchQiblaFromAPI(defaultLat, defaultLng);
          if (apiQibla !== null) {
            setUserLocation({ lat: defaultLat, lng: defaultLng });
            setQiblaDirection(apiQibla);
            
            if (error.code === error.PERMISSION_DENIED) {
              const platformMsg = isAndroid() 
                ? 'Using default location - Go to Android Settings -> Apps -> Permissions -> Location to enable'
                : 'Using default location - Check browser location permission in settings';
              setLocationError(platformMsg);
            } else {
              setLocationError('Using default Gelugor location - Try again for precise direction');
            }
            setIsLoading(false);
            return;
          }
        } catch (apiError) {
          console.error('API fallback failed:', apiError);
        }

        // If API also fails, show error
        setIsLoading(false);
        let errorMessage = '';
        
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = isAndroid()
            ? 'Location denied. Go to Settings -> Apps -> Permissions -> Location to enable'
            : 'Location access denied. Enable location permission in browser settings';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = isAndroid()
            ? 'GPS unavailable. Check device location settings or try indoors near a window'
            : 'Location unavailable. Enable GPS and try again';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timed out. Check GPS signal and try again';
        } else {
          errorMessage = 'Could not get location. Please try again.';
        }
        
        setLocationError(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 3 * 60 * 1000 }
    );
  };

  // Manual location input for dev testing on localhost
  const handleManualLocation = async () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      setLocationError('Invalid latitude or longitude');
      return;
    }

    setIsLoading(true);
    setLocationError('');

    try {
      // Try math-based calculation first
      const direction = calculateQiblaDirection(lat, lng);
      const normalizedDirection = (direction + 360) % 360;
      console.log('Qibla (manual input):', normalizedDirection);

      setUserLocation({ lat, lng });
      setQiblaDirection(normalizedDirection);
      setIsLoading(false);
      setShowManualInput(false);
      
      // Request motion permission IMMEDIATELY after location set (preserve gesture context)
      console.log('Manual location set - requesting motion permission now');
      await requestMotionAfterLocation();
    } catch (err) {
      console.error('Manual location error:', err);
      setLocationError('Error calculating Qibla direction');
      setIsLoading(false);
    }
  };

  // Device orientation for compass rotation
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const alpha = event.alpha ? (360 - event.alpha) % 360 : 0; // Heading relative to magnetic north
      setDeviceOrientation(alpha);
    };

    // Register listener for device orientation
    // Permission will be explicitly requested when user clicks "Get Location"
    window.addEventListener('deviceorientation', handleOrientation);
    setIsCalibrated(true);

    // Log platform info for debugging
    console.log(`Qibla Compass initialized on ${isAndroid() ? 'Android' : isIOS() ? 'iOS' : 'Desktop'}`);
    console.log('Will request: 1) Location permission, 2) Motion permission');

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Preload Kaaba image for canvas rim marker
  useEffect(() => {
    const img = new Image();
    img.src = '/assets/kaaba.svg';
    img.decode().catch(() => {});
    // store on canvasRef for reuse in draw loop
    (canvasRef as any)._kaabaImage = img;
  }, []);

  // Draw compass rose, user heading arrow, and Kaaba rim marker
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 10;
    const drawRadius = radius - 18; // where rim markers sit

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw outer ring
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw tick marks around rim
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#0f172a';
    for (let i = 0; i < 360; i += 5) {
      const ang = (i - 90) * (Math.PI / 180); // convert so 0 deg is top
      const inner = drawRadius - (i % 30 === 0 ? 12 : 6);
      const outer = drawRadius + 6;
      const x1 = Math.cos(ang) * inner;
      const y1 = Math.sin(ang) * inner;
      const x2 = Math.cos(ang) * outer;
      const y2 = Math.sin(ang) * outer;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Cardinal labels N/E/S/W
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labelOffset = drawRadius - 36;
    ctx.fillText('N', 0, -labelOffset);
    ctx.fillText('E', labelOffset, 0);
    ctx.fillText('S', 0, labelOffset);
    ctx.fillText('W', -labelOffset, 0);

    // Draw Kaaba marker on rim at qiblaDirection (fixed world position)
    try {
      const angleRad = ((qiblaDirection - 90) * Math.PI) / 180; // convert to canvas rad
      const kaabaX = Math.cos(angleRad) * drawRadius;
      const kaabaY = Math.sin(angleRad) * drawRadius;

      // Draw a small circle as fallback marker
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(kaabaX, kaabaY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Try to draw Kaaba SVG image if loaded
      const img = (canvasRef as any)._kaabaImage as HTMLImageElement | undefined;
      if (img && img.complete) {
        const w = 24;
        const h = 24;
        ctx.drawImage(img, kaabaX - w / 2, kaabaY - h / 2, w, h);
      }
    } catch (e) {
      // ignore drawing errors
    }

    // Draw user heading arrow: rotate by smoothedOrientation so arrow points to where device faces
    ctx.save();
    ctx.rotate((smoothedOrientation * Math.PI) / 180);
    // Arrow pointing up after rotation
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(-10, 14);
    ctx.lineTo(10, 14);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }, [qiblaDirection, smoothedOrientation]);

  // const rotation = deviceOrientation - qiblaDirection; // unused

  // Guidance text for alignment: compute shortest difference (−180..180)
  const ALIGN_THRESHOLD = 8; // degrees tolerance for "found"
  const diff = ((displayedQibla - smoothedOrientation + 540) % 360) - 180; // positive -> qibla is to your right
  let guidanceText = '';
  let guidanceColor = 'text-gray-500';
  if (userLocation && isCalibrated) {
    const absDiff = Math.abs(Math.round(diff));
    if (absDiff <= ALIGN_THRESHOLD) {
      guidanceText = 'Qiblat is found';
      guidanceColor = 'text-green-600';
    } else if (diff > 0) {
      guidanceText = `Turn right ${Math.abs(Math.round(diff))}°`;
      guidanceColor = 'text-orange-600';
    } else {
      guidanceText = `Turn left ${Math.abs(Math.round(diff))}°`;
      guidanceColor = 'text-orange-600';
    }
  }

  // Smooth device orientation to reduce jitter (exponential smoothing)
  useEffect(() => {
    let raf = 0;
    const alpha = 0.12; // smoothing factor (0-1)

    const step = () => {
      smoothedRef.current = smoothedRef.current + alpha * (deviceOrientation - smoothedRef.current);
      const v = smoothedRef.current;
      setSmoothedOrientation(v);
      raf = requestAnimationFrame(step);
    };

    if (isCalibrated) {
      smoothedRef.current = deviceOrientation;
      setSmoothedOrientation(deviceOrientation);
      raf = requestAnimationFrame(step);
    }

    return () => cancelAnimationFrame(raf);
  }, [deviceOrientation, isCalibrated]);

  // Animate displayed Qibla value to smoothly transition when qiblaDirection changes
  useEffect(() => {
    let raf = 0;
    const alpha = 0.18;

    const step = () => {
      const current = displayedQibla % 360;
      const target = qiblaDirection % 360;
      let delta = ((target - current + 540) % 360) - 180;
      const next = current + delta * alpha;
      setDisplayedQibla((next + 360) % 360);
      if (Math.abs(delta) > 0.3) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [qiblaDirection]);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-green-500/10 border border-green-200/50 backdrop-blur-sm">
      <div className="text-center mb-6">
        <h2 className="font-display text-xl text-gray-800 mb-1">Qibla Direction</h2>
        <p className="text-sm text-gray-600">
          {userLocation 
            ? (isMobileDevice() ? 'Rotate device to move arrow toward Qibla' : 'Point device camera lens toward green arrow')
            : (isMobileDevice() ? 'Tap "Get Location" for dynamic compass' : 'Tap "Get Location" to find your Qibla direction')}
        </p>
      </div>

      {/* Compass Canvas — always visible */}
      <div className="relative mx-auto w-64 h-64 mb-4">
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="w-full h-full rounded-3xl shadow-2xl border-4 border-white/50"
        />
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <div className="text-center mb-3 bg-white/70 px-3 py-1 rounded-md shadow-sm">
            <div className="text-lg font-bold text-green-600">{Math.round(userLocation ? qiblaDirection : 0)}°</div>
            <div className="text-xs text-gray-700 uppercase tracking-wide font-semibold">{userLocation ? 'Qibla Direction' : 'Magnetic North'}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {!userLocation && (
          <button
            onClick={handleGetLocation}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-green-500/90 text-white font-medium shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border border-green-300/50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Locate size={20} />
            {isLoading ? 'Getting location...' : 'Get Location'}
          </button>
        )}
        {locationError && userLocation === null && (
          <button
            onClick={handleGetLocation}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500/90 text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RotateCw size={20} />
            {isLoading ? 'Retrying...' : 'Retry'}
          </button>
        )}
        {!userLocation && !locationError && (
          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500/90 text-white font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <MapPin size={20} />
            {showManualInput ? 'Hide Input' : 'Test Location'}
          </button>
        )}
        {userLocation && isCalibrated && (
          <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500/90 text-white font-medium shadow-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
            Compass Active
          </div>
        )}
      </div>

      {/* Manual Location Input for Dev Testing */}
      {showManualInput && !userLocation && (
        <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-300/50 space-y-3">
          <p className="text-xs text-blue-600 font-medium">Dev Testing: Enter latitude & longitude</p>
          <div className="flex gap-2 sm:gap-3">
            <input
              type="number"
              placeholder="Latitude"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              step="0.0001"
              className="flex-1 px-3 py-2 rounded-lg bg-white text-gray-900 text-sm border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Longitude"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              step="0.0001"
              className="flex-1 px-3 py-2 rounded-lg bg-white text-gray-900 text-sm border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleManualLocation}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Set
            </button>
          </div>
          <p className="text-xs text-gray-600">Default: Penang (5.3414, 100.3048)</p>
        </div>
      )}

      {userLocation && isCalibrated && guidanceText && (
        <p className={`text-sm mt-3 text-center font-medium ${guidanceColor}`}>
          {guidanceText}
        </p>
      )}

      {locationError && (
        <p className="text-xs text-orange-600 mt-3 text-center font-medium px-2">
          {locationError}
        </p>
      )}

      {userLocation && (
        <p className="text-xs text-green-600 mt-3 text-center font-medium">
            Location obtained - Accuracy ±2° | Works worldwide
          </p>
      )}

      {!userLocation && !locationError && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          Click "Get Location" to enable Qibla direction. Requires location permission.
        </p>
      )}

      {userLocation && !isCalibrated && (
        <p className="text-xs text-amber-600 mt-3 text-center font-medium">
          {isAndroid() ? 'Enable "Motion" in Android settings for dynamic arrow' : 'Enable motion permission when prompted'}
        </p>
      )}

      {userLocation && motionPermissionDenied && (
        <div className="mt-2 text-center">
            <p className="text-xs text-red-600 font-medium mb-2">
            {isAndroid() ? 'Go to Settings -> Apps -> Permissions -> Motion & Fitness to enable' : 'Allow motion permission in browser settings for dynamic arrow'}
          </p>
          <button
            onClick={handleRequestMotionManually}
            disabled={requestingMotion}
            className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded transition-colors"
          >
            {requestingMotion ? 'Requesting...' : 'Request Motion Permission'}
          </button>
        </div>
      )}
    </div>
  );
}