import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
  TextPath,
} from 'react-native-svg';

interface BrandLogoProps {
  size?: number;
}

export function BrandLogo({ size = 72 }: BrandLogoProps): JSX.Element {
  return (
    <Svg accessibilityLabel="Logo LeiteGen Pro" height={size} viewBox="0 0 160 160" width={size}>
      <Defs>
        <LinearGradient id="leitegenBlue" x1="28" x2="132" y1="28" y2="132">
          <Stop offset="0" stopColor="#0b4f73" />
          <Stop offset="1" stopColor="#17698c" />
        </LinearGradient>
        <Path d="M 38 74 A 42 42 0 0 1 122 74" id="topTextArc" />
        <Path d="M 122 98 A 42 42 0 0 1 38 98" id="bottomTextArc" />
      </Defs>

      <Circle cx="80" cy="80" fill="#d7e2e5" opacity={0.34} r="72" />
      <Circle cx="80" cy="78" fill="#fdfefe" r="68" stroke="#0d5f83" strokeWidth="6" />
      <Circle cx="80" cy="78" fill="none" r="56" stroke="#d5e2e7" strokeWidth="3" />
      <Circle cx="80" cy="78" fill="url(#leitegenBlue)" r="39" />

      <SvgText fill="#155a7b" fontFamily="Montserrat" fontSize="14" fontWeight="700" letterSpacing="1.5">
        <TextPath href="#topTextArc" startOffset="50%" textAnchor="middle">
          LEITEGEN PRO
        </TextPath>
      </SvgText>
      <SvgText fill="#155a7b" fontFamily="Montserrat" fontSize="14" fontWeight="700" letterSpacing="1.5">
        <TextPath href="#bottomTextArc" startOffset="50%" textAnchor="middle">
          LEITEGEN PRO
        </TextPath>
      </SvgText>

      <SvgText fill="#d4a843" fontFamily="Montserrat" fontSize="15" fontWeight="700" x="113" y="41">
        PRO
      </SvgText>
      <SvgText fill="#d4a843" fontFamily="Montserrat" fontSize="15" fontWeight="700" x="106" y="128">
        PRO
      </SvgText>

      <Path
        d="M80 38 C74 56 61 69 61 88 C61 105 74 118 91 116 C105 114 116 101 115 87 C114 75 106 66 96 58 C92 53 87 46 80 38 Z"
        fill="#f7fbfc"
        opacity={0.88}
      />
      <Path
        d="M79 47 C75 62 66 73 66 88 C66 102 77 112 91 111 C103 110 111 100 110 88 C109 76 101 68 91 61 C87 56 83 51 79 47 Z"
        fill="#eef7f8"
      />

      <G stroke="#f3d57c" strokeLinecap="round" strokeWidth="4">
        <Path d="M101 51 C92 70 75 86 56 101" />
        <Path d="M100 52 C108 68 105 88 95 108" />
      </G>
      <G fill="none" stroke="#103f59" strokeLinecap="round" strokeWidth="4">
        <Path d="M62 103 C78 91 90 78 101 58" />
        <Path d="M59 91 C75 97 86 103 95 112" />
        <Path d="M68 82 C81 88 91 94 100 104" />
        <Path d="M76 73 C88 78 96 84 104 92" />
        <Path d="M87 62 C95 66 101 71 106 77" />
      </G>
      <Path
        d="M74 116 C66 115 58 111 52 105 C65 107 79 101 91 91 C89 105 85 113 74 116 Z"
        fill="#f7fbfc"
      />
      <Path d="M103 105 L117 116" stroke="#103f59" strokeLinecap="round" strokeWidth="5" />
      <Path d="M107 101 L119 105" stroke="#103f59" strokeLinecap="round" strokeWidth="4" />
    </Svg>
  );
}
