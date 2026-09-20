import { useId } from "react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { cn } from "@/lib/utils";

export function PostCoverSvg({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const idPrefix = `aq${uid}`;

  const primaryStroke = "var(--accent)";
  const secondaryStroke =
    "color-mix(in oklab, var(--accent) 75%, var(--accent))";
  const lightStroke = "color-mix(in oklab, var(--accent) 85%, var(--surface))";

  const officialFont =
    'var(--font-arabic), "IBM Plex Sans Arabic", Tahoma, sans-serif';

  return (
    <svg
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cn("pointer-events-none size-full select-none", className)}
      style={{ fontFamily: officialFont }}
    >
      <defs>
        {/* Sky atmosphere gradient tailored to visual identity */}
        <linearGradient
          id={`${idPrefix}AtmosphereGrad`}
          x1="400"
          y1="0"
          x2="400"
          y2="450"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor="color-mix(in oklab, var(--accent) 5%, var(--background))"
          />
          <stop
            offset="45%"
            stopColor="color-mix(in oklab, var(--accent) 9%, var(--background))"
          />
          <stop
            offset="80%"
            stopColor="color-mix(in oklab, var(--accent) 15%, var(--background))"
          />
          <stop
            offset="100%"
            stopColor="color-mix(in oklab, var(--accent) 22%, var(--background))"
          />
        </linearGradient>

        {/* Ambient brand radial glow */}
        <radialGradient
          id={`${idPrefix}BrandGlow`}
          cx="400"
          cy="160"
          r="300"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor="color-mix(in oklab, var(--accent) 26%, transparent)"
          />
          <stop
            offset="55%"
            stopColor="color-mix(in oklab, var(--accent) 12%, transparent)"
          />
          <stop
            offset="85%"
            stopColor="color-mix(in oklab, var(--accent) 4%, transparent)"
          />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Center reading glow for high-contrast blog post titles */}
        <radialGradient
          id={`${idPrefix}TitleBackplateGlow`}
          cx="400"
          cy="225"
          r="210"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor="color-mix(in oklab, var(--accent) 9%, var(--surface))"
            stopOpacity="0.94"
          />
          <stop
            offset="60%"
            stopColor="color-mix(in oklab, var(--accent) 4%, var(--surface))"
            stopOpacity="0.5"
          />
          <stop
            offset="100%"
            stopColor="color-mix(in oklab, var(--accent) 10%, var(--background))"
            stopOpacity="0"
          />
        </radialGradient>

        {/* Distant Riyadh modern skyline gradient */}
        <linearGradient
          id={`${idPrefix}DistantSkylineGrad`}
          x1="0"
          y1="130"
          x2="0"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor="color-mix(in oklab, var(--accent) 14%, var(--background))"
          />
          <stop
            offset="100%"
            stopColor="color-mix(in oklab, var(--accent) 28%, var(--background))"
          />
        </linearGradient>

        {/* Contemporary Salmani Villa gradient */}
        <linearGradient
          id={`${idPrefix}SalmaniVillaGrad`}
          x1="0"
          y1="210"
          x2="0"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor="color-mix(in oklab, var(--accent) 11%, var(--surface))"
          />
          <stop
            offset="60%"
            stopColor="color-mix(in oklab, var(--accent) 16%, var(--surface))"
          />
          <stop
            offset="100%"
            stopColor="color-mix(in oklab, var(--accent) 24%, var(--background))"
          />
        </linearGradient>

        {/* Modern Corporate Glass Tower gradient */}
        <linearGradient
          id={`${idPrefix}CorporateTowerGrad`}
          x1="0"
          y1="135"
          x2="0"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor="color-mix(in oklab, var(--accent) 12%, var(--surface))"
          />
          <stop
            offset="50%"
            stopColor="color-mix(in oklab, var(--accent) 18%, var(--surface))"
          />
          <stop
            offset="100%"
            stopColor="color-mix(in oklab, var(--accent) 26%, var(--background))"
          />
        </linearGradient>

        {/* Central contract deed pedestal gradient */}
        <linearGradient
          id={`${idPrefix}ContractSheetGrad`}
          x1="260"
          y1="100"
          x2="540"
          y2="370"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor="color-mix(in oklab, var(--accent) 10%, var(--surface))"
            stopOpacity="0.94"
          />
          <stop
            offset="50%"
            stopColor="color-mix(in oklab, var(--accent) 6%, var(--surface))"
            stopOpacity="0.9"
          />
          <stop
            offset="100%"
            stopColor="color-mix(in oklab, var(--accent) 15%, var(--surface))"
            stopOpacity="0.88"
          />
        </linearGradient>

        {/* Horizon laser divider gradient */}
        <linearGradient
          id={`${idPrefix}GroundDividerGrad`}
          x1="0"
          y1="0"
          x2="800"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="transparent" />
          <stop offset="18%" stopColor="var(--accent)" />
          <stop
            offset="50%"
            stopColor="color-mix(in oklab, var(--accent) 85%, var(--surface))"
          />
          <stop offset="82%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>

        {/* Ground substrate gradient */}
        <linearGradient
          id={`${idPrefix}GroundSubstrateGrad`}
          x1="400"
          y1="400"
          x2="400"
          y2="450"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor="color-mix(in oklab, var(--accent) 22%, var(--background))"
          />
          <stop
            offset="100%"
            stopColor="color-mix(in oklab, var(--accent) 32%, var(--background))"
          />
        </linearGradient>

        {/* Precision CAD grid pattern */}
        <pattern
          id={`${idPrefix}CadGridPattern`}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.5"
            strokeOpacity={0.16}
          />
          <circle
            cx="0"
            cy="0"
            r="0.85"
            fill="var(--accent)"
            fillOpacity={0.3}
          />
        </pattern>

        {/* Isometric drafting floor diamond pattern */}
        <pattern
          id={`${idPrefix}IsoGridPattern`}
          width="50"
          height="28.87"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 0 14.43 L 25 0 L 50 14.43 L 25 28.87 Z"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.5"
            strokeOpacity={0.12}
          />
        </pattern>
      </defs>

      {/* Layer 1: Atmospheric Backdrop & Grids */}
      <rect width="800" height="450" fill={`url(#${idPrefix}AtmosphereGrad)`} />
      <rect width="800" height="450" fill={`url(#${idPrefix}BrandGlow)`} />
      <rect
        width="800"
        height="450"
        fill={`url(#${idPrefix}TitleBackplateGlow)`}
      />
      <rect width="800" height="450" fill={`url(#${idPrefix}CadGridPattern)`} />
      <rect
        y="190"
        width="800"
        height="260"
        fill={`url(#${idPrefix}IsoGridPattern)`}
      />

      {/* Layer 2: Perspective Projection Ray Guidelines */}
      <g
        stroke="var(--accent)"
        strokeWidth="0.6"
        strokeOpacity={0.2}
        strokeDasharray="3 4"
      >
        <line x1="400" y1="195" x2="0" y2="400" />
        <line x1="400" y1="195" x2="140" y2="400" />
        <line x1="400" y1="195" x2="265" y2="400" />
        <line x1="400" y1="195" x2="535" y2="400" />
        <line x1="400" y1="195" x2="660" y2="400" />
        <line x1="400" y1="195" x2="800" y2="400" />
        <line x1="400" y1="195" x2="0" y2="300" />
        <line x1="400" y1="195" x2="800" y2="300" />
      </g>

      {/* Layer 3: Official brand logo Watermark */}
      <g transform="translate(400, 48)" aria-label="Aqdkm Brand Watermark">
        <image
          href="/logo/logo.svg"
          x={-32}
          y={-12}
          width={64}
          height={44}
          opacity={0.85}
        />
      </g>

      {/* Layer 4: Distant Riyadh Architectural Skyline */}
      <g
        fill={`url(#${idPrefix}DistantSkylineGrad)`}
        stroke={primaryStroke}
        strokeWidth="0.65"
        strokeOpacity={0.42}
      >
        <path d="M 15 400 V 270 H 42 V 400 Z" />
        <path d="M 45 400 V 225 H 72 V 400 Z" />
        <line
          x1="58"
          y1="225"
          x2="58"
          y2="202"
          stroke={secondaryStroke}
          strokeWidth="0.8"
        />
        <path d="M 75 400 V 250 H 102 V 400 Z" />

        <path d="M 110 400 V 205 L 140 165 L 165 215 V 400 Z" />
        <line
          x1="140"
          y1="165"
          x2="140"
          y2="400"
          stroke={primaryStroke}
          strokeWidth="0.5"
          strokeOpacity={0.3}
        />

        <path d="M 175 400 V 240 H 195 V 200 H 220 V 170 H 240 V 400 Z" />
        <line
          x1="230"
          y1="170"
          x2="230"
          y2="142"
          stroke={secondaryStroke}
          strokeWidth="0.9"
        />

        <path d="M 250 400 V 220 L 285 245 V 400 Z" />
        <path d="M 330 400 V 195 H 365 V 400 Z" />
        <path d="M 435 400 V 190 H 470 V 400 Z" />
        <line
          x1="452"
          y1="190"
          x2="452"
          y2="160"
          stroke={secondaryStroke}
          strokeWidth="0.8"
        />

        <path d="M 515 400 V 215 L 545 175 L 570 220 V 400 Z" />
        <path d="M 580 400 V 230 H 605 V 400 Z" />
        <path d="M 610 400 V 180 H 635 V 150 H 660 V 400 Z" />
        <line
          x1="647"
          y1="150"
          x2="647"
          y2="120"
          stroke={secondaryStroke}
          strokeWidth="0.9"
        />
        <path d="M 670 400 V 195 L 705 165 V 400 Z" />
        <path d="M 715 400 V 235 H 745 V 205 H 775 V 400 Z" />
        <path d="M 780 400 V 260 H 795 V 400 Z" />
      </g>

      {/* Layer 5: LEFT SIDE - عقد سكني (Modern Salmani Saudi Villa Architecture) */}
      <g id={`${idPrefix}ResidentialBespokeVilla`}>
        {/* Cantilevered Second-Floor Master Volume */}
        <rect
          x="42"
          y="225"
          width="196"
          height="80"
          rx="3"
          fill={`url(#${idPrefix}SalmaniVillaGrad)`}
          stroke={primaryStroke}
          strokeWidth="1.25"
        />
        <line
          x1="38"
          y1="225"
          x2="242"
          y2="225"
          stroke={secondaryStroke}
          strokeWidth="2.5"
        />
        <line
          x1="42"
          y1="230"
          x2="238"
          y2="230"
          stroke={primaryStroke}
          strokeWidth="0.6"
          strokeOpacity={0.4}
        />

        {/* Salmani geometric stone mashrabiya screen */}
        <rect
          x="56"
          y="240"
          width="74"
          height="52"
          fill={primaryStroke}
          fillOpacity={0.12}
          stroke={primaryStroke}
          strokeWidth="0.8"
        />
        <g
          stroke={primaryStroke}
          strokeWidth="0.7"
          strokeOpacity={0.75}
          fill="none"
        >
          <polygon points="65,248 72,243 79,248 72,253" />
          <polygon points="83,248 90,243 97,248 90,253" />
          <polygon points="101,248 108,243 115,248 108,253" />
          <polygon points="74,258 81,253 88,258 81,263" />
          <polygon points="92,258 99,253 106,258 99,263" />
          <polygon points="110,258 117,253 124,258 117,263" />
          <polygon points="65,268 72,263 79,268 72,273" />
          <polygon points="83,268 90,263 97,268 90,273" />
          <polygon points="101,268 108,263 115,268 108,273" />
          <polygon points="74,278 81,273 88,278 81,283" />
          <polygon points="92,278 99,273 106,278 99,283" />
          <polygon points="110,278 117,273 124,278 117,283" />
        </g>

        {/* Master Bedroom Panoramic Glass Corner & Terrace */}
        <rect
          x="142"
          y="240"
          width="84"
          height="52"
          fill={secondaryStroke}
          fillOpacity={0.18}
          stroke={primaryStroke}
          strokeWidth="0.8"
        />
        <rect
          x="142"
          y="268"
          width="84"
          height="24"
          fill={lightStroke}
          fillOpacity={0.3}
          stroke={secondaryStroke}
          strokeWidth="1"
        />
        <line
          x1="170"
          y1="268"
          x2="170"
          y2="292"
          stroke={primaryStroke}
          strokeWidth="0.75"
        />
        <line
          x1="198"
          y1="268"
          x2="198"
          y2="292"
          stroke={primaryStroke}
          strokeWidth="0.75"
        />

        {/* Ground Floor Main Residential Footprint */}
        <rect
          x="32"
          y="305"
          width="218"
          height="95"
          fill="color-mix(in oklab, var(--accent) 14%, var(--background))"
          stroke={primaryStroke}
          strokeWidth="1.3"
        />
        <line
          x1="28"
          y1="305"
          x2="254"
          y2="305"
          stroke={secondaryStroke}
          strokeWidth="2"
        />

        {/* Grand Portico & Cantilevered Entrance Canopy */}
        <rect
          x="146"
          y="318"
          width="58"
          height="82"
          fill="color-mix(in oklab, var(--accent) 19%, var(--background))"
          stroke={primaryStroke}
          strokeWidth="1"
        />
        <polygon
          points="138,318 210,318 206,312 142,312"
          fill={secondaryStroke}
          fillOpacity={0.7}
          stroke={secondaryStroke}
          strokeWidth="1"
        />
        <circle cx="156" cy="315" r="1.4" fill={lightStroke} />
        <circle cx="175" cy="315" r="1.4" fill={lightStroke} />
        <circle cx="194" cy="315" r="1.4" fill={lightStroke} />

        {/* Grand Pivot Villa Entrance Door */}
        <rect
          x="154"
          y="336"
          width="42"
          height="64"
          fill={secondaryStroke}
          fillOpacity={0.35}
          stroke={secondaryStroke}
          strokeWidth="1"
        />
        <line
          x1="175"
          y1="336"
          x2="175"
          y2="400"
          stroke={primaryStroke}
          strokeWidth="0.8"
        />
        <line
          x1="172"
          y1="358"
          x2="172"
          y2="385"
          stroke={lightStroke}
          strokeWidth="1.8"
        />
        <line
          x1="178"
          y1="358"
          x2="178"
          y2="385"
          stroke={lightStroke}
          strokeWidth="1.8"
        />

        {/* Family Majlis Panoramic Glazed Window */}
        <rect
          x="48"
          y="325"
          width="82"
          height="55"
          fill={primaryStroke}
          fillOpacity={0.12}
          stroke={primaryStroke}
          strokeWidth="0.9"
        />
        <line
          x1="48"
          y1="352"
          x2="130"
          y2="352"
          stroke={primaryStroke}
          strokeWidth="0.8"
        />
        <line
          x1="89"
          y1="325"
          x2="89"
          y2="380"
          stroke={primaryStroke}
          strokeWidth="0.8"
        />
        <rect
          x="54"
          y="330"
          width="30"
          height="18"
          fill={lightStroke}
          fillOpacity={0.45}
        />

        {/* Residential Specification Badge with actual FaHome react-icon */}
        <g transform="translate(45, 184)">
          <rect
            width="135"
            height="24"
            rx="6"
            fill="color-mix(in oklab, var(--accent) 15%, var(--surface))"
            stroke={primaryStroke}
            strokeWidth="0.85"
          />
          <foreignObject x="5" y="4" width="16" height="16">
            <div style={{ color: "var(--accent)", lineHeight: 0 }}>
              <FaHome size={16} />
            </div>
          </foreignObject>
          <text
            x="75"
            y="12"
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--accent)"
            fontSize="8.5"
            fontWeight="bold"
            style={{ fontFamily: officialFont }}
            letterSpacing="0.3"
          >
            عقد سكني • RESIDENTIAL
          </text>
        </g>

        {/* Architectural Elevation Dimension Line (Left Margin) */}
        <g stroke={primaryStroke} strokeOpacity={0.65} strokeWidth="0.75">
          <line x1="22" y1="225" x2="22" y2="400" />
          <line x1="16" y1="225" x2="28" y2="225" />
          <line x1="16" y1="305" x2="28" y2="305" />
          <line x1="16" y1="400" x2="28" y2="400" />
          <text
            x="14"
            y="310"
            textAnchor="middle"
            dominantBaseline="central"
            fill={primaryStroke}
            fontSize="7"
            style={{ fontFamily: officialFont }}
            transform="rotate(-90 14 310)"
          >
            H: 7.80m
          </text>
        </g>
      </g>

      {/* Layer 6: RIGHT SIDE - عقد تجاري (Parametric Corporate Tower & Showroom Plaza) */}
      <g id={`${idPrefix}CommercialBespokeTower`}>
        {/* Aerodynamic Tapered High-Rise Corporate Tower */}
        <polygon
          points="605,150 740,150 748,325 595,325"
          fill={`url(#${idPrefix}CorporateTowerGrad)`}
          stroke={primaryStroke}
          strokeWidth="1.3"
        />

        <polygon
          points="600,150 745,150 735,132 612,132"
          fill={secondaryStroke}
          fillOpacity={0.6}
          stroke={secondaryStroke}
          strokeWidth="1.2"
        />
        <line
          x1="675"
          y1="132"
          x2="675"
          y2="88"
          stroke={primaryStroke}
          strokeWidth="1.5"
        />
        <circle cx="675" cy="88" r="2.5" fill={lightStroke} />
        <line
          x1="675"
          y1="102"
          x2="642"
          y2="132"
          stroke={primaryStroke}
          strokeWidth="0.6"
          strokeOpacity={0.5}
        />
        <line
          x1="675"
          y1="102"
          x2="708"
          y2="132"
          stroke={primaryStroke}
          strokeWidth="0.6"
          strokeOpacity={0.5}
        />

        {/* Curtain Wall Facade Mullions */}
        <g stroke={primaryStroke} strokeWidth="0.65" strokeOpacity="0.45">
          <line x1="620" y1="150" x2="612" y2="325" />
          <line x1="640" y1="150" x2="636" y2="325" />
          <line x1="660" y1="150" x2="658" y2="325" />
          <line x1="680" y1="150" x2="682" y2="325" />
          <line x1="700" y1="150" x2="704" y2="325" />
          <line x1="720" y1="150" x2="726" y2="325" />

          <line x1="603" y1="175" x2="741" y2="175" />
          <line x1="601" y1="200" x2="742" y2="200" />
          <line x1="599" y1="225" x2="743" y2="225" />
          <line x1="598" y1="250" x2="744" y2="250" />
          <line x1="596" y1="275" x2="746" y2="275" />
          <line x1="595" y1="300" x2="747" y2="300" />
        </g>

        {/* Selected Illuminated Corporate Office Suites */}
        <rect
          x="640"
          y="175"
          width="20"
          height="25"
          fill={lightStroke}
          fillOpacity={0.5}
        />
        <rect
          x="700"
          y="175"
          width="22"
          height="25"
          fill={secondaryStroke}
          fillOpacity={0.35}
        />
        <rect
          x="620"
          y="200"
          width="18"
          height="25"
          fill={secondaryStroke}
          fillOpacity={0.3}
        />
        <rect
          x="660"
          y="200"
          width="21"
          height="25"
          fill={lightStroke}
          fillOpacity={0.55}
        />
        <rect
          x="682"
          y="225"
          width="22"
          height="25"
          fill={lightStroke}
          fillOpacity={0.45}
        />
        <rect
          x="638"
          y="250"
          width="20"
          height="25"
          fill={lightStroke}
          fillOpacity={0.6}
        />
        <rect
          x="704"
          y="250"
          width="22"
          height="25"
          fill={secondaryStroke}
          fillOpacity={0.35}
        />
        <rect
          x="615"
          y="275"
          width="22"
          height="25"
          fill={secondaryStroke}
          fillOpacity={0.35}
        />
        <rect
          x="658"
          y="275"
          width="24"
          height="25"
          fill={lightStroke}
          fillOpacity={0.5}
        />

        {/* Commercial Retail & Showroom Podium Base */}
        <rect
          x="555"
          y="325"
          width="215"
          height="75"
          fill="color-mix(in oklab, var(--accent) 16%, var(--background))"
          stroke={primaryStroke}
          strokeWidth="1.3"
        />
        <rect
          x="555"
          y="325"
          width="215"
          height="16"
          fill={secondaryStroke}
          fillOpacity={0.45}
          stroke={secondaryStroke}
          strokeWidth="1"
        />
        <line
          x1="610"
          y1="333"
          x2="715"
          y2="333"
          stroke={lightStroke}
          strokeWidth="1.4"
        />

        {/* Showroom Panoramic Glazed Facade */}
        <rect
          x="568"
          y="348"
          width="68"
          height="52"
          fill={primaryStroke}
          fillOpacity={0.12}
          stroke={primaryStroke}
          strokeWidth="0.85"
        />
        <line
          x1="602"
          y1="348"
          x2="602"
          y2="400"
          stroke={primaryStroke}
          strokeWidth="0.75"
        />

        {/* Commercial Double Revolving Glass Entry */}
        <rect
          x="646"
          y="346"
          width="52"
          height="54"
          fill={secondaryStroke}
          fillOpacity={0.3}
          stroke={secondaryStroke}
          strokeWidth="1"
        />
        <line
          x1="672"
          y1="346"
          x2="672"
          y2="400"
          stroke={primaryStroke}
          strokeWidth="0.8"
        />
        <rect
          x="708"
          y="348"
          width="52"
          height="52"
          fill={primaryStroke}
          fillOpacity={0.12}
          stroke={primaryStroke}
          strokeWidth="0.85"
        />

        {/* Commercial Specification Badge with actual FaBuilding react-icon */}
        <g transform="translate(620, 110)">
          <rect
            width="138"
            height="24"
            rx="6"
            fill="color-mix(in oklab, var(--accent) 15%, var(--surface))"
            stroke={primaryStroke}
            strokeWidth="0.85"
          />
          <foreignObject x="5" y="4" width="16" height="16">
            <div style={{ color: "var(--accent)", lineHeight: 0 }}>
              <FaBuilding size={16} />
            </div>
          </foreignObject>
          <text
            x="78"
            y="12"
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--accent)"
            fontSize="8.5"
            fontWeight="bold"
            style={{ fontFamily: officialFont }}
            letterSpacing="0.3"
          >
            عقد تجاري • COMMERCIAL
          </text>
        </g>

        {/* Architectural Elevation Dimension Line (Right Margin) */}
        <g stroke={primaryStroke} strokeOpacity={0.65} strokeWidth="0.75">
          <line x1="778" y1="150" x2="778" y2="400" />
          <line x1="772" y1="150" x2="784" y2="150" />
          <line x1="772" y1="325" x2="784" y2="325" />
          <line x1="772" y1="400" x2="784" y2="400" />
          <text
            x="786"
            y="275"
            textAnchor="middle"
            dominantBaseline="central"
            fill={primaryStroke}
            fontSize="7"
            style={{ fontFamily: officialFont }}
            transform="rotate(90 786 275)"
          >
            H: 42.0m
          </text>
        </g>
      </g>

      {/* Layer 7: CENTER HERO - Framing Pedestal for the Blog Title Text */}
      <g id={`${idPrefix}CenterFramingPedestal`}>
        {/* Certificate Dossier Plaque */}
        <rect
          x="260"
          y="100"
          width="280"
          height="270"
          rx="10"
          fill={`url(#${idPrefix}ContractSheetGrad)`}
          stroke={primaryStroke}
          strokeWidth="1.2"
        />

        {/* Inner Legal Hairline Margin */}
        <rect
          x="268"
          y="108"
          width="264"
          height="254"
          rx="6"
          fill="none"
          stroke={primaryStroke}
          strokeWidth="0.65"
          strokeOpacity={0.45}
        />

        {/* Corner registration marks for the deed plaque */}
        <g stroke={secondaryStroke} strokeWidth="1">
          <path d="M 273 120 V 113 H 280" />
          <path d="M 527 120 V 113 H 520" />
          <path d="M 273 346 V 353 H 280" />
          <path d="M 527 346 V 353 H 520" />
        </g>

        {/* Plaque Top Header Bar with Verified Badge */}
        <g transform="translate(400, 118)">
          <line
            x1="-110"
            y1="0"
            x2="-22"
            y2="0"
            stroke={secondaryStroke}
            strokeWidth="0.75"
            strokeOpacity={0.6}
          />
          <line
            x1="22"
            y1="0"
            x2="110"
            y2="0"
            stroke={secondaryStroke}
            strokeWidth="0.75"
            strokeOpacity={0.6}
          />

          {/* Central RiVerifiedBadgeFill in Header */}
          <g transform="translate(-14, -14)" style={{ color: "var(--accent)" }}>
            <RiVerifiedBadgeFill size={28} />
          </g>

          {/* Official Subtitle above the Title Zone */}
          <text
            x="0"
            y="25"
            textAnchor="middle"
            dominantBaseline="central"
            fill={primaryStroke}
            fontSize="8"
            fontWeight="bold"
            style={{ fontFamily: officialFont }}
            letterSpacing="0.4"
          >
            منصة عقدكم • توثيق عقود الإيجار المعتمدة
          </text>
        </g>

        {/* Plaque Bottom Verification Seal Bar (Below the Title Zone) */}
        <g transform="translate(400, 335)">
          <line
            x1="-115"
            y1="0"
            x2="115"
            y2="0"
            stroke={secondaryStroke}
            strokeWidth="0.75"
            strokeOpacity={0.5}
          />

          {/* Centered Seal Tag */}
          <rect
            x="-85"
            y="-10"
            width="170"
            height="20"
            rx="4"
            fill="color-mix(in oklab, var(--accent) 14%, var(--surface))"
            stroke={primaryStroke}
            strokeWidth="0.7"
          />
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="central"
            fill={primaryStroke}
            fontSize="7"
            fontWeight="600"
            style={{ fontFamily: officialFont }}
            letterSpacing="0.3"
          >
            توثيق رقمي فوري • EJAR CERTIFIED
          </text>

          {/* Twin Ribbon Drapes */}
          <path
            d="M -10 10 L -15 28 L -5 24 L 0 28 L 0 10 Z"
            fill={secondaryStroke}
            fillOpacity={0.6}
            stroke={primaryStroke}
            strokeWidth="0.6"
          />
          <path
            d="M 10 10 L 15 28 L 5 24 L 0 28 L 0 10 Z"
            fill={secondaryStroke}
            fillOpacity={0.6}
            stroke={primaryStroke}
            strokeWidth="0.6"
          />
        </g>

        {/* Data Conduit Connections Linking the Plaque to Both Properties */}
        {/* Left Conduit (to Residential Villa) */}
        <path
          d="M 260 335 C 220 335, 200 350, 160 350"
          fill="none"
          stroke={secondaryStroke}
          strokeWidth="1.2"
          strokeDasharray="3 3"
        />
        <circle cx="160" cy="350" r="3" fill={secondaryStroke} />
        <circle
          cx="160"
          cy="350"
          r="5.5"
          fill="none"
          stroke={secondaryStroke}
          strokeWidth="0.75"
        />

        {/* Right Conduit (to Commercial Plaza) */}
        <path
          d="M 540 335 C 580 335, 610 350, 650 350"
          fill="none"
          stroke={secondaryStroke}
          strokeWidth="1.2"
          strokeDasharray="3 3"
        />
        <circle cx="650" cy="350" r="3" fill={secondaryStroke} />
        <circle
          cx="650"
          cy="350"
          r="5.5"
          fill="none"
          stroke={secondaryStroke}
          strokeWidth="0.75"
        />
      </g>

      {/* Layer 8: Horizon Laser Ground & Substrate */}
      <rect
        y="400"
        width="800"
        height="50"
        fill={`url(#${idPrefix}GroundSubstrateGrad)`}
        stroke={primaryStroke}
        strokeWidth="1"
      />
      <line
        x1="0"
        y1="400"
        x2="800"
        y2="400"
        stroke={`url(#${idPrefix}GroundDividerGrad)`}
        strokeWidth="2"
      />
      <line
        x1="0"
        y1="414"
        x2="800"
        y2="414"
        stroke={primaryStroke}
        strokeWidth="0.75"
        strokeOpacity={0.4}
      />

      {/* Layer 9: Precision Technical CAD Blueprint Markings */}
      <g stroke={primaryStroke} strokeWidth="0.85">
        {/* Top-Left Corner Drafting Registration Bracket */}
        <path d="M 30 28 H 70" />
        <path d="M 30 28 V 68" />
        <circle cx="30" cy="28" r="2.8" fill={primaryStroke} />

        {/* Top-Right Corner Drafting Registration Bracket */}
        <path d="M 770 28 H 730" />
        <path d="M 770 28 V 68" />
        <circle cx="770" cy="28" r="2.8" fill={primaryStroke} />

        {/* Radius Angle Arc Callout */}
        <path
          d="M 685 325 A 35 35 0 0 0 720 360"
          fill="none"
          stroke={secondaryStroke}
          strokeDasharray="2 3"
          strokeWidth="0.8"
        />
        <circle cx="685" cy="325" r="1.8" fill={secondaryStroke} />
        <circle cx="720" cy="360" r="1.8" fill={secondaryStroke} />
        <text
          x="724"
          y="346"
          textAnchor="start"
          dominantBaseline="central"
          fill={secondaryStroke}
          fontSize="6.5"
          style={{ fontFamily: officialFont }}
        >
          R: 35
        </text>

        {/* Bottom Baseline Registration Brackets */}
        <path d="M 25 392 H 60" strokeWidth="1.2" />
        <path d="M 775 392 H 740" strokeWidth="1.2" />

        {/* Architectural Metric Scale Bar (Bottom Left) */}
        <g transform="translate(60, 388)">
          <line
            x1="0"
            y1="0"
            x2="60"
            y2="0"
            stroke={primaryStroke}
            strokeWidth="0.75"
          />
          <line
            x1="0"
            y1="-3"
            x2="0"
            y2="3"
            stroke={primaryStroke}
            strokeWidth="0.75"
          />
          <line
            x1="30"
            y1="-2"
            x2="30"
            y2="2"
            stroke={primaryStroke}
            strokeWidth="0.75"
          />
          <line
            x1="60"
            y1="-3"
            x2="60"
            y2="3"
            stroke={primaryStroke}
            strokeWidth="0.75"
          />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            dominantBaseline="hanging"
            fill={primaryStroke}
            fontSize="6.5"
            style={{ fontFamily: officialFont }}
          >
            0
          </text>
          <text
            x="30"
            y="6"
            textAnchor="middle"
            dominantBaseline="hanging"
            fill={primaryStroke}
            fontSize="6.5"
            style={{ fontFamily: officialFont }}
          >
            10
          </text>
          <text
            x="60"
            y="6"
            textAnchor="middle"
            dominantBaseline="hanging"
            fill={primaryStroke}
            fontSize="6.5"
            style={{ fontFamily: officialFont }}
          >
            25m
          </text>
        </g>

        {/* Title Stamp & Geocoded Data (Bottom Right) */}
        <g transform="translate(760, 382)">
          <text
            x="0"
            y="0"
            textAnchor="end"
            dominantBaseline="hanging"
            fill={primaryStroke}
            fontSize="7.5"
            fontWeight="bold"
            style={{ fontFamily: officialFont }}
          >
            عقدكم // AQDKM RENTAL CONTRACT PLATFORM
          </text>
          <text
            x="0"
            y="11"
            textAnchor="end"
            dominantBaseline="hanging"
            fill={secondaryStroke}
            fontSize="6.5"
            fontWeight="500"
            style={{ fontFamily: officialFont }}
            opacity="0.85"
          >
            24°46&apos;31&quot;N 46°41&apos;15&quot;E • RIYADH KSA • EJAR 2026
          </text>
        </g>
      </g>
    </svg>
  );
}
