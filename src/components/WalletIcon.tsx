import React from 'react';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

interface WalletIconProps {
    size?: number;
    color?: string;
}

export function WalletIcon({ size = 28, color = '#FFFFFF' }: WalletIconProps) {
    // Scale factor from 1024 viewBox to target size
    const scale = size / 1024;

    return (
        <Svg width={size} height={size} viewBox="0 0 1024 1024" fill="none">
            {/* Wallet body - main rectangle */}
            <Rect
                x="162" y="262"
                width="700" height="500"
                rx="64"
                fill={color}
                opacity={0.9}
            />

            {/* Top accent bar */}
            <Path
                d="M162 326C162 289.55 191.55 260 228 260H796C832.45 260 862 289.55 862 326V380H162V326Z"
                fill={color}
                opacity={0.6}
            />

            {/* Card slot */}
            <Path
                d="M712 432H862V592H712C693.67 592 678 576.33 678 558V466C678 447.67 693.67 432 712 432Z"
                fill={color}
            />

            {/* Clasp circle */}
            <Circle
                cx="770"
                cy="512"
                r="36"
                fill="#1A1A2E"
            />

            {/* Bottom accent bar */}
            <Path
                d="M162 682H862V706C862 742.45 832.45 772 796 772H228C191.55 772 162 742.45 162 706V682Z"
                fill={color}
                opacity={0.6}
            />
        </Svg>
    );
}
